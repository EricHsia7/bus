import { MaterialSymbols } from "./material-symbols-type";

export function getIconHTML(iconID: MaterialSymbols): string {
  return `<span class="css_material_symbols_rounded">${iconID}</span>`;
}
