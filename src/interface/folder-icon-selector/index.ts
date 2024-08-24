import { getMaterialSymbols } from '../../data/apis/getMaterialSymbols.ts';
import { prepareForMaterialSymbolsSearch } from '../../data/search/searchMaterialSymbols.ts';
import { containPhoneticSymbols, generateIdentifier } from '../../tools/index.ts';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector.ts';
import { dataPreloadCompleted } from '../home/index.ts';
import { getIconHTML } from '../icons/index.ts';
import { GeneratedElement } from '../index.ts';
import { prompt_message } from '../prompt/index.ts';

type Target = 'editor' | 'creator';

var currentFuse: any = false;

const folderEditorField = documentQuerySelector('.css_folder_editor_field');
const folderCreatorField = documentQuerySelector('.css_folder_creator_field');
const folderIconSelectorField = documentQuerySelector('.css_folder_icon_selector_field');

function generateElementOfSymbol(symbol: string, target: Target): GeneratedElement {
  var identifier = `i_${generateIdentifier()}`;
  var element = document.createElement('div');
  element.id = identifier;
  element.classList.add('css_folder_icon_selector_symbol');
  element.setAttribute('onclick', `bus.folder.selectFolderIcon('${symbol}', '${target}')`);
  element.innerHTML = getIconHTML(symbol);
  return {
    element: element,
    id: identifier
  };
}

async function initializeFolderIconSelectorField(target: Target): void {
  const materialSymbolsElement = elementQuerySelector(folderIconSelectorField, '.css_folder_icon_selector_body .css_folder_icon_selector_material_symbols');
  materialSymbolsElement.innerHTML = '';
  const requestID: string = `r_${generateIdentifier()}`;
  const materialSymbols = await getMaterialSymbols(requestID);
  for (const symbol of materialSymbols) {
    const symbolElement = generateElementOfSymbol(symbol, target);
    materialSymbolsElement.appendChild(symbolElement.element);
  }
}

export function updateMaterialSymbolsSearchResult(query: string): void {
  const materialSymbolsSearchResultsElement = elementQuerySelector(folderIconSelectorField, '.css_folder_icon_selector_body .css_folder_icon_selector_material_symbols_search_results');
  const materialSymbolsElement = elementQuerySelector(folderIconSelectorField, '.css_folder_icon_selector_body .css_folder_icon_selector_material_symbols');
  materialSymbolsSearchResultsElement.innerHTML = '';
  if (!containPhoneticSymbols(query) && currentFuse) {
    var searchResults = currentFuse.search(query).slice(0, 30);
    for (var result of searchResults) {
      const symbolElement = generateElementOfSymbol(result.item);
      materialSymbolsSearchResultsElement.appendChild(symbolElement.element);
    }
    materialSymbolsSearchResultsElement.setAttribute('displayed', searchResults.length > 0 ? 'true' : 'false');
    materialSymbolsElement.setAttribute('displayed', searchResults.length > 0 ? 'false' : 'true');
  }
}

export function selectFolderIcon(symbol: string, target: Target): void {
  var iconInputElement;
  switch (target) {
    case 'editor':
      iconInputElement = elementQuerySelector(folderEditorField, '.css_folder_editor_body .css_folder_editor_groups .css_folder_editor_group[group="folder-icon"] .css_folder_editor_group_body .css_folder_editor_icon_input input');
      break;
    case 'creator':
      iconInputElement = elementQuerySelector(folderCreatorField, '.css_folder_creator_body .css_folder_creator_groups .css_folder_creator_group[group="folder-icon"] .css_folder_creator_group_body .css_folder_creator_icon_input input');
      break;
    default:
      break;
  }
  iconInputElement.value = symbol;
  closeFolderIconSelector();
}

export function openFolderIconSelector(target: Target): void {
  var openFolderIconSelectorElement;
  switch (target) {
    case 'editor':
      openFolderIconSelectorElement = elementQuerySelector(folderEditorField, '.css_folder_editor_body .css_folder_editor_groups .css_folder_editor_group[group="folder-icon"] .css_folder_editor_group_body .css_folder_editor_icon_input .css_folder_editor_open_folder_icon_selector');
      break;
    case 'creator':
      openFolderIconSelectorElement = elementQuerySelector(folderCreatorField, '.css_folder_creator_body .css_folder_creator_groups .css_folder_creator_group[group="folder-icon"] .css_folder_creator_group_body .css_folder_creator_icon_input .css_folder_creator_open_folder_icon_selector');
      break;
    default:
      break;
  }
  if (openFolderIconSelectorElement.getAttribute('disabled') === 'false') {
    if (dataPreloadCompleted) {
      folderIconSelectorField.setAttribute('displayed', 'true');
      initializeFolderIconSelectorField(target);
      prepareForMaterialSymbolsSearch().then((preparation) => {
        currentFuse = preparation;
      });
    } else {
      prompt_message('資料還在下載中');
    }
  }
}

export function closeFolderIconSelector(): void {
  folderIconSelectorField.setAttribute('displayed', 'false');
}
