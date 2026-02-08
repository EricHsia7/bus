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
    ]
  }
};
