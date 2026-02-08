/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'custom-property-pattern': [
      '(b-cssvar-)[a-z0-9_-]*',
      {
        message: (name) => `Expected custom property name "${name}" to start with "--b-cssvar-"`
      }
    ],
    'selector-class-pattern': [
      '(css_)[a-z0-9_-]*',
      {
        message: (selector) => `Expected class selector "${selector}" to start with "css_"`
      }
    ],
    'alpha-value-notation': null,
    'color-function-alias-notation': null,
    'color-function-notation': null,
    'comment-empty-line-before': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'declaration-property-value-no-unknown': null,
    'length-zero-no-unit': null,
    'no-descending-specificity': null,
    'property-no-vendor-prefix': null,
    'custom-property-empty-line-before': null
  }
};
