import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => ({
  test: {
    include: ['tests/nuxt/**/*.test.ts'],
    environment: 'node',
    env: {
      TZ: 'Asia/Tokyo',
      DATABASE_URL: process.env.TEST_DATABASE_URL ?? '',
      NUXT_TEST_BUILD: mode === 'production' ? '1' : '',
    },
    hookTimeout: mode === 'production' ? 420_000 : 180_000,
    testTimeout: 60_000,
  },
}));
