import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '@': fileURLToPath(new URL('./app', import.meta.url)),
      '~~': fileURLToPath(new URL('./', import.meta.url)),
      '@@': fileURLToPath(new URL('./', import.meta.url)),
      '#server': fileURLToPath(new URL('./server', import.meta.url)),
      '#imports': fileURLToPath(new URL('./tests/mocks/imports.ts', import.meta.url)),
      '#auth': fileURLToPath(
        new URL('./node_modules/@sidebase/nuxt-auth/dist/runtime/server/services/index.js', import.meta.url),
      ),
    },
  },
  test: {
    environment: 'node',
    env: {
      // 表示日付が実行環境のタイムゾーンで揺れないように固定する
      TZ: 'Asia/Tokyo',
      // 開発用 DB を壊さないよう、テスト中の DATABASE_URL はテスト用 DB で上書きする。
      // 未設定なら空文字になり、テスト側のガードが落ちる
      DATABASE_URL: process.env.TEST_DATABASE_URL ?? '',
    },
    exclude: ['**/node_modules/**', '**/.output/**', '**/packages/prisma/**'],
    server: {
      deps: {
        inline: ['@sidebase/nuxt-auth'],
      },
    },
  },
});
