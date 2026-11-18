import { execFile, spawn, type ChildProcess } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import { promisify } from 'node:util';
import postcss from 'postcss';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createPrismaClient } from '../../server/utils/prisma';
import { ADMIN_EMAIL } from '../../shared/constants/auth';
import { startGoogleOAuthFixture } from '../fixtures/google-oauth';

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
let google: Awaited<ReturnType<typeof startGoogleOAuthFixture>> | undefined;
let serverOutput = '';
const production = process.env.NUXT_TEST_BUILD === '1';

async function request(path: string, init?: RequestInit) {
  return fetch(new URL(path, origin), { signal: AbortSignal.timeout(60_000), ...init });
}

function cookies(response: Response) {
  return response.headers
    .getSetCookie()
    .map((cookie) => cookie.split(';')[0]!)
    .join('; ');
}

async function googleLogin(role: 'admin' | 'general' | 'unverified', invalidState = false) {
  const start = await request('/api/auth/callback/google', { redirect: 'manual' });
  expect(start.status).toBe(302);
  const state = new URL(start.headers.get('location')!).searchParams.get('state')!;
  return request(
    `/api/auth/callback/google?${new URLSearchParams({ code: role, state: invalidState ? 'invalid-state' : state })}`,
    {
      redirect: 'manual',
      headers: { cookie: cookies(start) },
    },
  );
}

beforeAll(async () => {
  google = await startGoogleOAuthFixture();
  const saved = await prisma.blogPost.create({ data: article });
  articleId = saved.id;

  const socket = createServer();
  await new Promise<void>((resolve) => socket.listen(0, '127.0.0.1', resolve));
  const address = socket.address();
  if (!address || typeof address === 'string') throw new Error('テスト用ポートを取得できません。');
  const port = address.port;
  await new Promise<void>((resolve, reject) => socket.close((error) => (error ? reject(error) : resolve())));
  origin = `http://127.0.0.1:${port}`;

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    NODE_ENV: production ? 'production' : 'development',
    AUTH_SECRET: 'legacy-test-secret',
    AUTH_CLIENT_ID_GOOGLE: 'legacy-test-client-id',
    AUTH_CLIENT_SECRET_GOOGLE: 'legacy-test-client-secret',
    NUXT_AUTH_BASE_URL: `${origin}/api/auth`,
    NUXT_OAUTH_GOOGLE_TOKEN_URL: `${google.origin}/token`,
    NUXT_OAUTH_GOOGLE_USER_URL: `${google.origin}/user`,
    NUXT_DEPLOY_WEBHOOK_URL: '',
    NUXT_TELEMETRY_DISABLED: '1',
    BROWSER: 'none',
    HOST: '127.0.0.1',
    PORT: String(port),
    NUXT_TEST_PRERENDER_ARTICLE: production ? String(articleId) : '',
  };
  // 新しい変数に依存せず、既存の短い secret でも実行できることを検証する。
  delete env.NUXT_APP_SECRET;
  delete env.NITRO_APP_SECRET;
  delete env.NUXT_APP_SECRET_GENERATED;
  delete env.NUXT_OAUTH_GOOGLE_CLIENT_ID;
  delete env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET;
  delete env.NUXT_OAUTH_GOOGLE_REDIRECT_URL;
  if (production) {
    const buildEnv = { ...env };
    for (const key of [
      'AUTH_SECRET',
      'AUTH_CLIENT_ID_GOOGLE',
      'AUTH_CLIENT_SECRET_GOOGLE',
      'NUXT_AUTH_BASE_URL',
      'NEXTAUTH_URL',
      'AUTH_ORIGIN',
    ])
      Reflect.deleteProperty(buildEnv, key);
    // Nitro が生成する unstorage の import も含め、本番と同じビルド経路を通す。
    await promisify(execFile)('pnpm', ['build', '--extends', './tests/nuxt/fixtures'], {
      env: buildEnv,
      timeout: 240_000,
      maxBuffer: 4 * 1024 * 1024,
    });
  }

  // プロダクトの設定、ページ、API、自動 import をそのまま使う。外部のフィード取得は呼ばない。
  const command = production ? process.execPath : 'pnpm';
  const args = production
    ? ['.output/server/index.mjs']
    : ['dev', '--host', '127.0.0.1', '--port', String(port), '--extends', './tests/nuxt/fixtures'];
  server = spawn(command, args, {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env,
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
      const response = await fetch(new URL('/api/_auth/session', origin), { signal: AbortSignal.timeout(2000) });
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
  await google?.close();
});

describe('Nuxt を通したブログと管理画面の配信', () => {
  it('旧環境変数だけで Google 認証を開始し登録済みのコールバックに戻ること', async () => {
    const response = await request('/api/auth/callback/google', { redirect: 'manual' });
    expect(response.status).toBe(302);
    const location = new URL(response.headers.get('location')!);
    expect(location.origin).toBe('https://accounts.google.com');
    expect(location.searchParams.get('client_id')).toBe('legacy-test-client-id');
    expect(location.searchParams.get('redirect_uri')).toBe(`${origin}/api/auth/callback/google`);
    expect(location.searchParams.get('state')).toBeTruthy();
    expect(response.headers.get('set-cookie')).toBeTruthy();
  });

  it('管理者が Google ログインするとセッションが復元され、記事の編集とログアウトができること', async () => {
    const login = await googleLogin('admin');
    expect(login.status).toBe(302);
    expect(login.headers.get('location')).toBe('/admin');
    const cookie = cookies(login);
    expect(cookie).toContain('nuxt-auth-session=');
    const session = await request('/api/_auth/session', { headers: { cookie } });
    expect(session.status).toBe(200);
    const payload = await session.json();
    expect(payload.user).toEqual({ email: ADMIN_EMAIL, name: 'Sample User', image: 'https://example.com/avatar.png' });
    expect(payload).not.toHaveProperty('secure');
    expect(payload).not.toHaveProperty('tokens');
    try {
      const edit = await request(`/api/blog/${articleId}/edit`, {
        method: 'POST',
        headers: { cookie, 'content-type': 'application/json' },
        body: JSON.stringify({ ...article, content: '管理者による編集の検証' }),
      });
      expect(edit.status).toBe(204);
      expect((await prisma.blogPost.findUniqueOrThrow({ where: { id: articleId } })).content).toBe(
        '管理者による編集の検証',
      );
    } finally {
      // 失敗時も他の配信テストへ編集内容を持ち越さない。
      await prisma.blogPost.update({ where: { id: articleId }, data: article });
    }
    const logout = await request('/api/_auth/session', { method: 'DELETE', headers: { cookie } });
    expect(logout.status).toBe(200);
    const clearedCookie = cookies(logout);
    expect(
      (await (await request('/api/_auth/session', { headers: { cookie: clearedCookie } })).json()).user,
    ).toBeUndefined();
    const denied = await request(`/api/blog/${articleId}/edit`, {
      method: 'POST',
      headers: { cookie: clearedCookie, 'content-type': 'application/json' },
      body: JSON.stringify(article),
    });
    expect(denied.status).toBe(401);
  });

  it('一般ユーザーはログインしても記事の作成と編集が拒否されること', async () => {
    const login = await googleLogin('general');
    expect(login.headers.get('location')).toBe('/admin');
    const cookie = cookies(login);
    const session = await (await request('/api/_auth/session', { headers: { cookie } })).json();
    expect(session.user.email).toBe('sample@example.com');
    for (const path of ['/api/blog/create', `/api/blog/${articleId}/edit`]) {
      const response = await request(path, {
        method: 'POST',
        headers: { cookie, 'content-type': 'application/json' },
        body: JSON.stringify(article),
      });
      expect(response.status).toBe(401);
    }
    expect(await prisma.blogPost.count({ where: { title: article.title } })).toBe(1);
    expect((await prisma.blogPost.findUniqueOrThrow({ where: { id: articleId } })).content).toBe(article.content);
  });

  it.each(['unverified', 'invalid-state'] as const)(
    'メール未確認または不正な state ではログインできないこと（%s）',
    async (scenario) => {
      const login = await googleLogin(scenario === 'unverified' ? 'unverified' : 'admin', scenario === 'invalid-state');
      expect(login.status).toBe(302);
      expect(login.headers.get('location')).toBe('/admin/login?error=oauth');
      const session = await (await request('/api/_auth/session', { headers: { cookie: cookies(login) } })).json();
      expect(session.user).toBeUndefined();
    },
  );

  it('未ログインでは公開セッションにユーザーが含まれずログアウトできること', async () => {
    const response = await request('/api/_auth/session');
    expect(response.status).toBe(200);
    expect((await response.json()).user).toBeUndefined();
    const logout = await request('/api/_auth/session', { method: 'DELETE' });
    expect(logout.status).toBe(200);
    expect(logout.headers.get('set-cookie')).toContain('nuxt-auth-session=');
  });

  it.runIf(production)(
    '記事ページで使う和文・欧文フォントが指定のウェイトで同一オリジンから配信されること',
    async () => {
      const html = await (await request(`/blog/${articleId}`)).text();
      expect(html).not.toMatch(/https?:\/\/fonts\.(?:googleapis|gstatic)\.com/);
      const stylesheets = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)];
      expect(stylesheets.length).toBeGreaterThan(0);
      // Nuxt はページの CSS と @font-face を SSR HTML にインライン化する場合もある。
      const css = [
        ...[...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map((match) => match[1]),
        ...(await Promise.all(
          stylesheets.map(async ([, href]) => {
            const response = await request(href!);
            expect(response.status).toBe(200);
            return response.text();
          }),
        )),
      ].join('\n');
      expect(css).not.toMatch(/https?:\/\/fonts\.(?:googleapis|gstatic)\.com/);
      expect(css).toMatch(/--font-family-en:\s*["']?Poppins/);
      expect(css).toMatch(/--font-family-jp:\s*["']Noto Sans JP["']/);
      expect(css).toMatch(/font-family:\s*var\(--font-family-jp\)/);

      const faces: { family: string; weight: string; style: string; urls: string[] }[] = [];
      postcss.parse(css).walkAtRules('font-face', (rule) => {
        const declarations: Record<string, string> = {};
        rule.walkDecls((decl) => {
          declarations[decl.prop] = decl.value;
        });
        const family = declarations['font-family']?.replace(/["']/g, '');
        if (family !== 'Poppins' && family !== 'Noto Sans JP') return;
        faces.push({
          family,
          weight: declarations['font-weight']!,
          style: declarations['font-style']!,
          urls: [...(declarations.src ?? '').matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((match) => match[1]!),
        });
      });
      expect([...new Set(faces.map(({ family, weight, style }) => `${family}: ${weight} ${style}`))].sort()).toEqual([
        'Noto Sans JP: 400 normal',
        'Poppins: 400 normal',
        'Poppins: 500 normal',
      ]);
      // サブセットごとに出力されたファイルも確認し、日本語の一部だけ欠ける退行を検知する。
      for (const face of faces) {
        expect(face.urls.length).toBeGreaterThan(0);
        for (const url of face.urls) {
          expect(new URL(url, origin).origin).toBe(origin);
          const response = await request(url);
          expect(response.status, url).toBe(200);
          expect(response.headers.get('content-type')).toMatch(/font\//);
          const bytes = Buffer.from(await response.arrayBuffer());
          expect(bytes.subarray(0, 4).toString()).toBe('wOF2');
          expect(bytes.length).toBeGreaterThan(100);
        }
      }
    },
  );

  it('Pinia に取り込んだ記事が SSR で日付順のリンクとして描画され、復元用の状態も配信されること', async () => {
    const response = await request('/__test/posts');
    const html = await response.text();
    expect(response.status).toBe(200);
    const items = [...html.matchAll(/<a\b[^>]*role="listitem"[^>]*>[\s\S]*?<\/a>/g)].map(([item]) => item);
    expect(items).toHaveLength(4);
    expect(items[0]).toContain('最新のブログ検証記事');
    expect(items[0]).toContain('href="/blog/42"');
    expect(items[0]).toContain('2024.05.01');
    expect(items[0]).toMatch(/class="[^"]*pencil-box-icon[^"]*"[\s\S]*?<svg\b[^>]*>[\s\S]*?<path\b[^>]*d="[^"]+"/);
    expect(items[1]).toContain('外部フィードの検証記事');
    expect(items[1]).toContain('href="https://example.com/articles/feed-sample"');
    expect(items[1]).toContain('target="_blank"');
    expect(items[2]).toContain('ブログ一覧の検証記事');
    expect(items[2]).toContain('href="/blog/41"');
    expect(items[3]).toMatch(
      /class="[^"]*pencil-box-multiple-icon[^"]*"[\s\S]*?<svg\b[^>]*>[\s\S]*?<path\b[^>]*d="[^"]+"/,
    );
    expect(html).toMatch(
      /<button\b[^>]*aria-label="Prev"[^>]*>[\s\S]*?class="[^"]*chevron-left-icon[^"]*"[\s\S]*?<svg\b[^>]*>[\s\S]*?<path\b[^>]*d="[^"]+"/,
    );
    expect(html).toMatch(
      /<button\b[^>]*aria-label="Next"[^>]*>[\s\S]*?class="[^"]*chevron-right-icon[^"]*"[\s\S]*?<svg\b[^>]*>[\s\S]*?<path\b[^>]*d="[^"]+"/,
    );
    expect(html).toMatch(
      /<form\b[\s\S]*?class="[^"]*lock-open-icon[^"]*"[\s\S]*?<svg\b[^>]*width="20"[^>]*height="20"[^>]*>[\s\S]*?<path\b[^>]*d="[^"]+"/,
    );
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
    expect(html).toMatch(
      /<a\b[^>]*href="\/"[^>]*>[\s\S]*?class="[^"]*chevron-left-icon[^"]*"[\s\S]*?<svg\b[^>]*>[\s\S]*?<path\b[^>]*d="[^"]+"[\s\S]*?<span>Main page<\/span><\/a>/,
    );
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>alert("sample")</script>');
    expect(html).toContain('__NUXT_DATA__');
    if (production) {
      // SSR の成功だけでなく、事前生成された記事がそのまま配信されることを確認する。
      expect(html).toBe(await readFile(`.output/public/blog/${articleId}/index.html`, 'utf8'));
    }
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
