module.exports = {
  plugins: ['stylelint-scss'],
  extends: ['stylelint-config-standard-scss'],
  customSyntax: 'postcss-html',
  rules: {
    'selector-class-pattern': [
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)*(--[a-z0-9]+(-[a-z0-9]+)*)*$',
      { message: 'Expected class selector to be BEM or kebab-case' },
    ],
    'at-rule-no-unknown': [
      true,
      { ignoreAtRules: ['tailwind', 'layer', 'apply', 'theme', 'utility', 'reference', 'variant'] },
    ],
    'scss/at-rule-no-unknown': [true, { ignoreAtRules: ['reference', 'apply', 'tailwind', 'layer', 'variant'] }],
  },
};
