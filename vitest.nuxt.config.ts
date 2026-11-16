import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/nuxt/**/*.test.ts'],
    environment: 'node',
    env: {
      TZ: 'Asia/Tokyo',
      DATABASE_URL: process.env.TEST_DATABASE_URL ?? '',
    },
    hookTimeout: 180_000,
    testTimeout: 60_000,
  },
});
