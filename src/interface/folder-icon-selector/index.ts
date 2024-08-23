import { getMaterialSymbols } from '../../data/apis/getMaterialSymbols.ts';
import { prepareForMaterialSymbolsSearch } from '../../data/search/searchMaterialSymbols.ts';
import { containPhoneticSymbols, generateIdentifier } from '../../tools/index.ts';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector.ts';
import { dataPreloadCompleted } from '../home/index.ts';
import { getIconHTML } from '../icons/index.ts';
import { GeneratedElement } from '../index.ts';
import { prompt_message } from '../prompt/index.ts';

var currentFuse: any = false;

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
  const materialSymbolsElement = elementQuerySelector(Field, '.css_folder_icon_selector_body .css_folder_icon_selector_material_symbols');
  materialSymbolsElement.innerHTML = '';
  const requestID: string = `r_${generateIdentifier()}`;
  const materialSymbols = await getMaterialSymbols(requestID);
  for (const symbol of materialSymbols) {
    const symbolElement = generateElementOfSymbol(symbol);
    materialSymbolsElement.appendChild(symbolElement.element);
  }
}

export function updateMaterialSymbolsSearchResult(query: string): void {
  const Field = documentQuerySelector('.css_folder_icon_selector_field');
  const materialSymbolsSearchResultsElement = elementQuerySelector(Field, '.css_folder_icon_selector_body .css_folder_icon_selector_material_symbols_search_results');
  const materialSymbolsElement = elementQuerySelector(Field, '.css_folder_icon_selector_body .css_folder_icon_selector_material_symbols');
  materialSymbolsSearchResultsElement.innerHTML = '';
  if (!containPhoneticSymbols(query) && currentFuse) {
    var searchResults = currentFuse.search(query).slice(0, 30);
    for (var result of searchResults) {
      const symbolElement = generateElementOfSymbol(result);
      materialSymbolsSearchResultsElement.appendChild(symbolElement.element);
    }
    materialSymbolsSearchResultsElement.setAttribute('displayed', searchResults.length > 0 ? 'true' : 'false');
    materialSymbolsElement.setAttribute('displayed', searchResults.length > 0 ? 'false' : 'true');
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

export function closeFolderIconSelector(): void {
  const Field = documentQuerySelector('.css_folder_icon_selector_field');
  Field.setAttribute('displayed', 'false');
}
