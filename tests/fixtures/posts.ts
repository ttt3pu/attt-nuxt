import type { BlogPost } from '@prisma/client';
import type { ZennPost } from '~/types';

// API の JSON と同じく日時は文字列。トップページの useFetch と同じ境界で型を合わせる。
export const postsResponse = {
  blogPosts: [
    {
      id: 41,
      title: 'ブログ一覧の検証記事',
      content: '一覧には表示しない本文',
      created_at: '2024-03-01T00:00:00.000Z',
      updated_at: '2024-03-01T00:00:00.000Z',
      published_at: '2024-03-01T00:00:00.000Z',
    },
    {
      id: 42,
      title: '最新のブログ検証記事',
      content: '一覧には表示しない本文',
      created_at: '2024-05-01T00:00:00.000Z',
      updated_at: '2024-05-01T00:00:00.000Z',
      published_at: '2024-05-01T00:00:00.000Z',
    },
  ] as unknown as BlogPost[],
  zennPosts: [
    {
      title: '外部フィードの検証記事',
      link: 'https://example.com/articles/feed-sample',
      pubDate: 'Mon, 01 Apr 2024 00:00:00 GMT',
    },
  ] satisfies ZennPost[],
};
