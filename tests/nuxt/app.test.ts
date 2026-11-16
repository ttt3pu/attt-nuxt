import { spawn, type ChildProcess } from 'node:child_process';
import { createServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createPrismaClient } from '../../server/utils/prisma';

// 既存の DB テストと同じ安全条件を満たす DB にだけフィクスチャを保存する。
const databaseName = new URL(process.env.DATABASE_URL || 'postgresql://invalid/').pathname.slice(1);
if (!databaseName.endsWith('_test')) {
  throw new Error('末尾が _test の TEST_DATABASE_URL を設定してください（make test-db）。');
}

const prisma = createPrismaClient();
const article = {
  title: '記事配信の検証サンプル',
  content: '## 配信の確認\n\n本文から[トップページ](/)へ戻れます。\n\n<script>alert("sample")</script>',
  published_at: new Date('2024-04-01T10:00:00.000Z'),
};
let articleId: number | undefined;
let server: ChildProcess | undefined;
let origin: string;
let serverOutput = '';

async function request(path: string, init?: RequestInit) {
  return fetch(new URL(path, origin), { signal: AbortSignal.timeout(60_000), ...init });
}

beforeAll(async () => {
  const saved = await prisma.blogPost.create({ data: article });
  articleId = saved.id;

  const socket = createServer();
  await new Promise<void>((resolve) => socket.listen(0, '127.0.0.1', resolve));
  const address = socket.address();
  if (!address || typeof address === 'string') throw new Error('テスト用ポートを取得できません。');
  const port = address.port;
  await new Promise<void>((resolve, reject) => socket.close((error) => (error ? reject(error) : resolve())));
  origin = `http://127.0.0.1:${port}`;

  // プロダクトの設定、ページ、API、自動 import をそのまま使う。外部のフィード取得は呼ばない。
  server = spawn('pnpm', ['dev', '--host', '127.0.0.1', '--port', String(port), '--extends', './tests/nuxt/fixtures'], {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      NODE_ENV: 'development',
      NUXT_AUTH_BASE_URL: `${origin}/api/auth`,
      AUTH_SECRET: 'nuxt-regression-test-secret',
      NUXT_TELEMETRY_DISABLED: '1',
      BROWSER: 'none',
    },
  });
  for (const stream of [server.stdout, server.stderr]) {
    stream?.on('data', (chunk) => {
      serverOutput = (serverOutput + String(chunk)).slice(-8000);
    });
  }

  const deadline = Date.now() + 150_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Nuxt が終了しました。\n${serverOutput}`);
    try {
      const response = await fetch(new URL('/api/auth/session', origin), { signal: AbortSignal.timeout(2000) });
      if (response.ok && response.headers.get('content-type')?.includes('application/json')) return;
    } catch {
      /* 起動中は接続できるまで待つ。 */
    }
    await delay(500);
  }
  throw new Error(`Nuxt の起動がタイムアウトしました。\n${serverOutput}`);
});

afterAll(async () => {
  if (server?.pid) {
    process.kill(-server.pid, 'SIGTERM');
    const deadline = Date.now() + 5000;
    while (server.exitCode === null && server.signalCode === null && Date.now() < deadline) await delay(100);
    try {
      process.kill(-server.pid, 'SIGKILL');
    } catch {
      /* すでに終了したプロセスは無視する。 */
    }
  }
  if (articleId !== undefined) await prisma.blogPost.deleteMany({ where: { id: articleId } });
  await prisma.$disconnect();
});

describe('Nuxt を通したブログと管理画面の配信', () => {
  it('Pinia に取り込んだ記事が SSR で日付順のリンクとして描画され、復元用の状態も配信されること', async () => {
    const response = await request('/__test/posts');
    const html = await response.text();
    expect(response.status).toBe(200);
    const items = [...html.matchAll(/<a\b[^>]*role="listitem"[^>]*>[\s\S]*?<\/a>/g)].map(([item]) => item);
    expect(items).toHaveLength(4);
    expect(items[0]).toContain('最新のブログ検証記事');
    expect(items[0]).toContain('href="/blog/42"');
    expect(items[0]).toContain('2024.05.01');
    expect(items[1]).toContain('外部フィードの検証記事');
    expect(items[1]).toContain('href="https://example.com/articles/feed-sample"');
    expect(items[1]).toContain('target="_blank"');
    expect(items[2]).toContain('ブログ一覧の検証記事');
    expect(items[2]).toContain('href="/blog/41"');
    const payload = html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)?.[1];
    expect(payload).toBeDefined();
    expect(payload).toContain('"pinia"');
    expect(payload).toContain('最新のブログ検証記事');
  });

  it('次の SSR リクエストに前のリクエストの記事が漏れないこと', async () => {
    expect((await request('/__test/posts')).status).toBe(200);
    const response = await request('/__test/posts?empty=1');
    const html = await response.text();
    expect(response.status).toBe(200);
    expect([...html.matchAll(/role="listitem"/g)]).toHaveLength(1);
    expect(html).not.toContain('最新のブログ検証記事');
    expect(html).not.toContain('外部フィードの検証記事');
  });

  it('動的な記事 API が DB の記事と公開日時を JSON で返すこと', async () => {
    const response = await request(`/api/blog/${articleId}`);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      id: articleId,
      title: article.title,
      content: article.content,
      published_at: article.published_at.toISOString(),
    });
  });

  it('記事ページの SSR にタイトル、公開日、Markdown 本文と内部リンクが含まれること', async () => {
    const response = await request(`/blog/${articleId}`);
    const html = await response.text();
    expect(response.status).toBe(200);
    expect(html).toContain(`<title>${article.title} | attt</title>`);
    expect(html).toContain(article.title);
    expect(html).toContain('2024.04.01');
    expect(html).toContain('<h2>配信の確認</h2>');
    expect(html).toContain('<a href="/">トップページ</a>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>alert("sample")</script>');
    expect(html).toContain('__NUXT_DATA__');
  });

  it('管理画面は記事編集フォームを SSR せずクライアント用スクリプトを配信すること', async () => {
    const response = await request(`/admin/blog/${articleId}/edit`);
    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain('<div id="__nuxt">');
    expect(html).toContain('type="module"');
    expect(html).not.toContain('<form');
    expect(html).not.toContain(article.title);
  });

  it('未ログインの HTTP リクエストによる記事作成が拒否されること', async () => {
    const response = await request('/api/blog/create', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(article),
    });
    expect(response.status).toBe(401);
    expect(await prisma.blogPost.count({ where: { title: article.title } })).toBe(1);
  });
});
