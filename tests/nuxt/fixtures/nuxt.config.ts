import { fileURLToPath } from 'node:url';
import { defineNuxtConfig } from 'nuxt/config';

// test:nuxt の --extends でのみ読み込み、本番のルーティングには追加しない。
export default defineNuxtConfig({
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
