module.exports = {
  extends: ['stylelint-config-standard'],
  customSyntax: 'postcss-html',
  rules: {
    'selector-class-pattern': [
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)*(--[a-z0-9]+(-[a-z0-9]+)*)*$',
      { message: 'Expected class selector to be BEM or kebab-case' },
    ],
    'at-rule-no-unknown': [true, { ignoreAtRules: ['reference', 'apply', 'tailwind', 'layer', 'variant'] }],
  },
};
