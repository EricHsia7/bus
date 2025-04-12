import { getMaterialSymbols } from '../../data/apis/getMaterialSymbols/index';
import { deleteDataReceivingProgress } from '../../data/apis/loader';
import { prepareForMaterialSymbolsSearch, searchForMaterialSymbols } from '../../data/search/searchMaterialSymbols';
import { generateIdentifier } from '../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { containPhoneticSymbols } from '../../tools/text';
import { dataDownloadCompleted } from '../home/index';
import { getIconHTML } from '../icons/index';
import { GeneratedElement, pushPageHistory, revokePageHistory } from '../index';
import { promptMessage } from '../prompt/index';

type Target = 'editor' | 'creator' | '';

let currentTarget: Target = '';

const folderEditorField = documentQuerySelector('.css_folder_editor_field');
const folderCreatorField = documentQuerySelector('.css_folder_creator_field');
const folderIconSelectorField = documentQuerySelector('.css_folder_icon_selector_field');

function generateElementOfSymbol(symbol: string): GeneratedElement {
  // const identifier = generateIdentifier('i');
  const element = document.createElement('div');
  // element.id = identifier;
  element.classList.add('css_folder_icon_selector_symbol');
  element.setAttribute('onclick', `bus.folder.selectFolderIcon('${symbol}', '${currentTarget}')`);
  element.innerHTML = getIconHTML(symbol);
  return {
    element: element,
    id: ''
  };
}

async function initializeFolderIconSelectorField() {
  const materialSymbolsElement = elementQuerySelector(folderIconSelectorField, '.css_folder_icon_selector_body .css_folder_icon_selector_material_symbols');
  materialSymbolsElement.innerHTML = '';
  const requestID = generateIdentifier('r');
  const materialSymbols = await getMaterialSymbols(requestID);
  deleteDataReceivingProgress(requestID);
  const fragment = new DocumentFragment();
  for (const symbol of materialSymbols) {
    const symbolElement = generateElementOfSymbol(symbol, currentTarget);
    fragment.appendChild(symbolElement.element);
  }
  materialSymbolsElement.append(fragment);
}

export function updateMaterialSymbolsSearchResult(query: string): void {
  const materialSymbolsSearchResultsElement = elementQuerySelector(folderIconSelectorField, '.css_folder_icon_selector_body .css_folder_icon_selector_material_symbols_search_results');
  const materialSymbolsElement = elementQuerySelector(folderIconSelectorField, '.css_folder_icon_selector_body .css_folder_icon_selector_material_symbols');
  if (!containPhoneticSymbols(query)) {
    const searchResults = searchForMaterialSymbols(query, 100);
    const fragment = new DocumentFragment();
    for (const result of searchResults) {
      const symbolElement = generateElementOfSymbol(result.item, currentTarget);
      fragment.appendChild(symbolElement.element);
    }
    materialSymbolsSearchResultsElement.innerHTML = '';
    materialSymbolsSearchResultsElement.append(fragment);
    materialSymbolsSearchResultsElement.setAttribute('displayed', searchResults.length > 0 ? 'true' : 'false');
    materialSymbolsElement.setAttribute('displayed', searchResults.length > 0 ? 'false' : 'true');
  }
}

export function selectFolderIcon(symbol: string): void {
  let iconInputElement;
  switch (currentTarget) {
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
  pushPageHistory('FolderIconSelector');
  var openFolderIconSelectorElement;
  switch (target) {
    case 'editor':
      currentTarget = 'editor';
      openFolderIconSelectorElement = elementQuerySelector(folderEditorField, '.css_folder_editor_body .css_folder_editor_groups .css_folder_editor_group[group="folder-icon"] .css_folder_editor_group_body .css_folder_editor_icon_input .css_folder_editor_open_folder_icon_selector');
      break;
    case 'creator':
      currentTarget = 'creator';
      openFolderIconSelectorElement = elementQuerySelector(folderCreatorField, '.css_folder_creator_body .css_folder_creator_groups .css_folder_creator_group[group="folder-icon"] .css_folder_creator_group_body .css_folder_creator_icon_input .css_folder_creator_open_folder_icon_selector');
      break;
    default:
      break;
  }
  if (openFolderIconSelectorElement.getAttribute('disabled') === 'false') {
    if (dataDownloadCompleted) {
      folderIconSelectorField.setAttribute('displayed', 'true');
      initializeFolderIconSelectorField(currentTarget);
      prepareForMaterialSymbolsSearch();
    } else {
      promptMessage('資料還在下載中', 'download_for_offline');
    }
  }
}

export function closeFolderIconSelector(): void {
  revokePageHistory('FolderIconSelector');
  folderIconSelectorField.setAttribute('displayed', 'false');
}
