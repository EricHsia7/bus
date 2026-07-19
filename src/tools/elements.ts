export function documentQuerySelector(selectorExpression: string): HTMLElement {
  return document.querySelector(selectorExpression) as HTMLElement;
}

export function documentQuerySelectorAll(selectorExpression: string): NodeListOf<HTMLElement> {
  return document.querySelectorAll(selectorExpression);
}

export function elementQuerySelector(element: HTMLElement, selectorExpression: string): HTMLElement {
  return element.querySelector(selectorExpression) as HTMLElement;
}

export function elementQuerySelectorAll(element: HTMLElement, selectorExpression: string): NodeListOf<HTMLElement> {
  return element.querySelectorAll(selectorExpression);
}

export function getElementsBelow(referenceElement: HTMLElement, className: string): Array<HTMLElement> {
  const elements: Array<HTMLElement> = [];
  let sibling = referenceElement.nextElementSibling;

  while (sibling) {
    if (sibling.classList.contains(className)) {
      elements.push(sibling as HTMLElement);
    }
    sibling = sibling.nextElementSibling;
  }

  return elements;
}

export function documentCreateDivElement(): HTMLDivElement {
  return document.createElement('div');
}
