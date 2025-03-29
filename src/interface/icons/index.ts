import { MaterialSymbols } from './material-symbols-type';

export function getIconHTML(identifier: MaterialSymbols): string {
  return /*html*/ `<span class="css_material_symbols_rounded">${identifier}</span>`;
}
