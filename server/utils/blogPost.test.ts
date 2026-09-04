import type { BlogPost } from '@prisma/client';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { blogPosts } from '../../tests/fixtures/blog-posts';
import { createPrismaClient } from './prisma';
import {
  createBlogPost,
  deleteBlogPost,
  findBlogPost,
  listBlogPosts,
  updateBlogPost,
  type BlogPostInput,
} from './blogPost';

// テーブルを空にしてから流すので、開発用や本番の DB に向いていたら実行させない
const databaseName = new URL(process.env.DATABASE_URL || 'postgresql://invalid/').pathname.slice(1);

if (!databaseName.endsWith('_test')) {
  throw new Error(
    `テスト用 DB が必要です。末尾が _test のデータベースを TEST_DATABASE_URL に設定してください（make test-db）。現在: ${databaseName || '未設定'}`,
  );
}

const prisma = createPrismaClient();

// フィクスチャは JSON を通った後の形なので、DB へ入れる前に Date へ戻す
const rows = blogPosts.map((post) => ({
  ...post,
  created_at: new Date(post.created_at),
  updated_at: new Date(post.updated_at),
  published_at: new Date(post.published_at),
}));

// API のレスポンスは JSON になってからクライアントへ渡るので、その形で固定する
function asJson(posts: BlogPost | BlogPost[] | null) {
  return JSON.parse(JSON.stringify(posts));
}

const input: BlogPostInput = {
  title: '新しい技術スタックの導入検証',
  content: '## はじめに\n新しい技術の検証結果をまとめました。\n\n## 結論\n非常に良好です。',
  published_at: new Date('2024-04-01T10:00:00.000Z'),
};

beforeEach(async () => {
  await prisma.blogPost.deleteMany();
  await prisma.blogPost.createMany({ data: rows });

  // フィクスチャは id を明示して入れるので、作成のテストが採番する id とぶつからないよう
  // シーケンスをフィクスチャの最大値まで進めておく
  const maxId = Math.max(...rows.map((row) => row.id));
  await prisma.$queryRaw`SELECT setval(pg_get_serial_sequence('"BlogPost"', 'id'), ${maxId}::bigint)`;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('ブログ記事の一覧取得', () => {
  it('公開日時の降順で記事一覧の JSON が変わらないこと', async () => {
    const posts = await listBlogPosts(prisma);
    expect(asJson(posts)).toMatchSnapshot();
  });
});

describe('ブログ記事の 1 件取得', () => {
  it('指定した id の記事 JSON が変わらないこと', async () => {
    const post = await findBlogPost(prisma, rows[0]!.id);
    expect(asJson(post)).toMatchSnapshot();
  });

  it('存在しない id では null が返ること', async () => {
    const post = await findBlogPost(prisma, 999999);
    expect(post).toBeNull();
  });
});

describe('ブログ記事の作成', () => {
  it('記事が新しく保存され、一覧に追加されること', async () => {
    await createBlogPost(prisma, input);

    const posts = await listBlogPosts(prisma);
    expect(posts).toHaveLength(rows.length + 1);

    const created = posts.find((post) => post.title === input.title);
    expect(created).toBeDefined();
    expect(created?.content).toBe(input.content);
    expect(created?.published_at.toISOString()).toBe((input.published_at as Date).toISOString());
  });
});

describe('ブログ記事の編集', () => {
  it('指定した記事の内容が更新され、updated_at が更新されること', async () => {
    const target = rows[1]!;
    const updateInput: BlogPostInput = {
      title: '更新されたタイトル',
      content: '更新されたコンテンツです。',
      published_at: new Date('2024-02-16T12:00:00.000Z'),
    };

    await updateBlogPost(prisma, target.id, updateInput);

    const updated = await findBlogPost(prisma, target.id);
    expect(updated).toBeDefined();
    expect(updated?.title).toBe(updateInput.title);
    expect(updated?.content).toBe(updateInput.content);
    expect(updated?.created_at).toEqual(target.created_at);
    expect(updated?.updated_at.getTime()).toBeGreaterThan(target.updated_at.getTime());
  });
});

describe('ブログ記事の削除', () => {
  it('指定した記事が削除され、一覧から消えること', async () => {
    const target = rows[0]!;

    await deleteBlogPost(prisma, target.id);

    const posts = await listBlogPosts(prisma);
    expect(posts).toHaveLength(rows.length - 1);
    expect(posts.find((post) => post.id === target.id)).toBeUndefined();

    const deleted = await findBlogPost(prisma, target.id);
    expect(deleted).toBeNull();
  });
});
