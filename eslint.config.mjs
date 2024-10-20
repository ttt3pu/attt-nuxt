// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import eslintConfigPrettier from 'eslint-config-prettier';

export default withNuxt([
  {
    ignores: ['prisma/**'],
  },
  eslintConfigPrettier,
]);