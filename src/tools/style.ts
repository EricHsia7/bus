export function getCSSVariableValue(property: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(property);
}
