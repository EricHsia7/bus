import { MaterialSymbols } from './material-symbols-type';

export function getIconHTML(iconID: MaterialSymbols): string {
  return /*html*/ `<span class="css_material_symbols_rounded">${iconID}</span>`;
}
