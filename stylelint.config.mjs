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
    'alpha-value-notation': false,
    'color-function-alias-notation': false,
    'color-function-notation': false,
    'comment-empty-line-before': false,
    'declaration-block-no-redundant-longhand-properties': false,
    'declaration-property-value-no-unknown': false,
    'length-zero-no-unit': false,
    'no-descending-specificity': false,
    'property-no-vendor-prefix': false,
    'custom-property-empty-line-before': false
  }
};
