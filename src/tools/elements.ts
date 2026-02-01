export function documentQuerySelector(selectorExpression: string): HTMLElement {
  return document.querySelector(selectorExpression);
}

export function documentQuerySelectorAll(selectorExpression: string): NodeListOf<HTMLElement> {
  return document.querySelectorAll(selectorExpression);
}

export function elementQuerySelector(element: HTMLElement, selectorExpression: string): HTMLElement {
  return element.querySelector(selectorExpression);
}

export function elementQuerySelectorAll(element: HTMLElement, selectorExpression: string): NodeListOf<HTMLElement> {
  return element.querySelectorAll(selectorExpression);
}

export function getElementsBelow(referenceElement: HTMLElement, className: string): Array<HTMLElement> {
  const elements = [];
  let sibling = referenceElement.nextElementSibling;

  while (sibling) {
    if (sibling.classList.contains(className)) {
      elements.push(sibling);
    }
    sibling = sibling.nextElementSibling;
  }

  return elements;
}

export function documentCreateDIVElement(): HTMLDivElement {
  return document.createElement('div');
}
