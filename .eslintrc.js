module.exports = {
  root: true,
  extends: [
    '@nuxtjs/eslint-config-typescript',
  ],
  rules: {
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error'],
      },
    ],
    'comma-dangle': ['error', 'always-multiline'],
    'vue/no-v-html': 0,
  },
};
