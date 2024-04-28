export function documentQuerySelector(selectorExpression: string): HTMLElement {
  return document.querySelector(selectorExpression);
}

export function documentQuerySelectorAll(selectorExpression: string): NodeListOf<HTMLElement> {
  try {
    return document.querySelectorAll(selectorExpression);
  } catch (e) {
    console.log(selectorExpression);
  }
}

export function elementQuerySelector(element: HTMLElement, selectorExpression: string): HTMLElement {
  return element.querySelector(selectorExpression);
}

export function elementQuerySelectorAll(element: HTMLElement, selectorExpression: string): NodeListOf<HTMLElement> {
  return element.querySelectorAll(selectorExpression);
}
