import { getMaterialSymbols } from '../../data/apis/getMaterialSymbols.ts';
import { prepareForMaterialSymbolsSearch } from '../../data/search/searchMaterialSymbols.ts';
import { generateIdentifier } from '../../tools/index.ts';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector.ts';
import { dataPreloadCompleted } from '../home/index.ts';
import { getIconHTML } from '../icons/index.ts';
import { GeneratedElement } from '../index.ts';
import { prompt_message } from '../prompt/index.ts';

var currentFuse;

function generateElementOfSymbol(symbol: string): GeneratedElement {
  var identifier = `i_${generateIdentifier()}`;
  var element = document.createElement('div');
  element.id = identifier;
  element.classList.add('css_folder_icon_selector_symbol');
  element.innerHTML = getIconHTML(symbol);
  return {
    element: element,
    id: identifier
  };
}

async function initializeFolderIconSelectorField(): void {
  const Field = documentQuerySelector('.css_folder_icon_selector_field');
  const bodyElement = elementQuerySelector(Field, '.css_folder_icon_selector_body');
  bodyElement.innerHTML = '';
  const requestID: string = `r_${generateIdentifier()}`;
  const materialSymbols = await getMaterialSymbols(requestID);
  for (const symbol of materialSymbols) {
    const symbolElement = generateElementOfSymbol(symbol);
    bodyElement.appendChild(symbolElement);
  }
}

export function openFolderIconSelector(): void {
  const Field = documentQuerySelector('.css_folder_icon_selector_field');
  if (dataPreloadCompleted) {
    Field.setAttribute('displayed', 'true');
    initializeFolderIconSelectorField();
    prepareForMaterialSymbolsSearch().then((preparation) => {
      currentFuse = preparation;
    });
  } else {
    prompt_message('資料還在下載中');
  }
}

export function cloaseFolderIconSelector(): void {
  const Field = documentQuerySelector('.css_folder_icon_selector_field');
  Field.setAttribute('displayed', 'false');
}
