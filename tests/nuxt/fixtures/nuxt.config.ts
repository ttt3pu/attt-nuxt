import { fileURLToPath } from 'node:url';
import { defineNuxtConfig } from 'nuxt/config';

// test:nuxt の --extends でのみ読み込み、本番のルーティングには追加しない。
export default defineNuxtConfig({
  // テスト DB の記事を事前生成する。トップページの外部フィード取得はこの検証から外す。
  ...(process.env.NUXT_TEST_PRERENDER_ARTICLE
    ? {
        routeRules: { '/': { prerender: false } },
        nitro: {
          prerender: {
            routes: [`/blog/${process.env.NUXT_TEST_PRERENDER_ARTICLE}`],
            crawlLinks: false,
            failOnError: true,
          },
        },
      }
    : {}),
  hooks: {
    'pages:extend'(pages) {
      pages.push({
        name: 'test-posts',
        path: '/__test/posts',
        file: fileURLToPath(new URL('./PostsFixture.vue', import.meta.url)),
      });
    },
  },
});
