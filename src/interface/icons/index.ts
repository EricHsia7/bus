import { elementQuerySelector } from '../../tools/elements';
import { MaterialSymbols } from './material-symbols-type';

export function getIconHTML(identifier: MaterialSymbols): string {
  return /*html*/ `<span class="css_material_symbols_rounded">${identifier}</span>`;
}

export function getIconElement(identifier: MaterialSymbols): HTMLSpanElement {
  const iconElement = document.createElement('span');
  iconElement.classList.add('css_material_symbols_rounded');
  iconElement.appendChild(document.createTextNode(identifier));
  return iconElement;
}

export function getBlankIconElement(): HTMLSpanElement {
  const iconElement = document.createElement('span');
  iconElement.classList.add('css_material_symbols_rounded');
  return iconElement;
}

export function setIcon(parentElement: HTMLElement, identifier: MaterialSymbols): void {
  const thisSpanElement = elementQuerySelector(parentElement, 'span.css_material_symbols_rounded');
  thisSpanElement.innerText = identifier;
}
