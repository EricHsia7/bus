import { elementQuerySelector } from '../../tools/elements';
import { MaterialSymbol } from './material-symbols-type';

export function getIconElement(identifier: MaterialSymbol): HTMLSpanElement {
  const iconElement = document.createElement('span');
  iconElement.classList.add('css_material_symbols_rounded');
  iconElement.innerText = identifier;
  return iconElement;
}

export function getBlankIconElement(): HTMLSpanElement {
  const iconElement = document.createElement('span');
  iconElement.classList.add('css_material_symbols_rounded');
  return iconElement;
}

export function setIcon(parentElement: HTMLElement, identifier: MaterialSymbol): void {
  const thisSpanElement = elementQuerySelector(parentElement, 'span.css_material_symbols_rounded');
  thisSpanElement.innerText = identifier;
}
