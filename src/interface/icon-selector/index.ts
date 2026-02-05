import { getMaterialSymbolsSearchIndex } from '../../data/apis/getMaterialSymbolsSearchIndex/index';
import { deleteDataReceivingProgress } from '../../data/apis/loader';
import { prepareForMaterialSymbolsSearch, searchForMaterialSymbols } from '../../data/search/searchMaterialSymbols';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { generateIdentifier } from '../../tools/index';
import { containPhoneticSymbols } from '../../tools/text';
import { dataDownloadCompleted } from '../home/index';
import { getIconElement } from '../icons/index';
import { pushPageHistory, revokePageHistory } from '../index';
import { promptMessage } from '../prompt/index';

type Target = 'editor' | 'creator' | '';

let currentTarget: Target = '';

const folderEditorField = documentQuerySelector('.css_folder_editor_field');
const folderCreatorField = documentQuerySelector('.css_folder_creator_field');
const iconSelectorField = documentQuerySelector('.css_icon_selector_field');

function generateElementOfSymbol(symbol: string): HTMLElement {
  const element = documentCreateDivElement();
  element.classList.add('css_icon_selector_symbol');
  element.onclick = function () {
    selectIcon(symbol, currentTarget);
  };
  element.appendChild(getIconElement(symbol));
  return element;
}

async function initializeIconSelectorField() {
  const materialSymbolsElement = elementQuerySelector(iconSelectorField, '.css_icon_selector_body .css_icon_selector_material_symbols');
  materialSymbolsElement.innerHTML = '';
  const requestID = generateIdentifier();
  const materialSymbols = await getMaterialSymbolsSearchIndex(requestID);
  deleteDataReceivingProgress(requestID);
  const fragment = new DocumentFragment();
  const dictionary = materialSymbols.dictionary.split(',');
  for (const symbolKey in materialSymbols.symbols) {
    const symbolNameComponents = symbolKey.split('_');
    for (let i = symbolNameComponents.length - 1; i >= 0; i--) {
      symbolNameComponents.splice(i, 1, dictionary[parseInt(symbolNameComponents[i])]);
    }
    const symbol = symbolNameComponents.join('_');
    const symbolElement = generateElementOfSymbol(symbol, currentTarget);
    fragment.appendChild(symbolElement);
  }
  materialSymbolsElement.append(fragment);
}

export function updateMaterialSymbolsSearchResult(query: string): void {
  const materialSymbolsSearchResultsElement = elementQuerySelector(iconSelectorField, '.css_icon_selector_body .css_icon_selector_material_symbols_search_results');
  const materialSymbolsElement = elementQuerySelector(iconSelectorField, '.css_icon_selector_body .css_icon_selector_material_symbols');
  if (!containPhoneticSymbols(query)) {
    const searchResults = searchForMaterialSymbols(query);
    const fragment = new DocumentFragment();
    for (const result of searchResults) {
      const symbolElement = generateElementOfSymbol(result.item, currentTarget);
      fragment.appendChild(symbolElement);
    }
    materialSymbolsSearchResultsElement.innerHTML = '';
    materialSymbolsSearchResultsElement.append(fragment);
    materialSymbolsSearchResultsElement.setAttribute('displayed', searchResults.length > 0 ? 'true' : 'false');
    materialSymbolsElement.setAttribute('displayed', searchResults.length > 0 ? 'false' : 'true');
  }
}

export function selectIcon(symbol: string): void {
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
  closeIconSelector();
}

export function openIconSelector(target: Target): void {
  pushPageHistory('IconSelector');
  var openIconSelectorElement;
  switch (target) {
    case 'editor':
      currentTarget = 'editor';
      openIconSelectorElement = elementQuerySelector(folderEditorField, '.css_folder_editor_body .css_folder_editor_groups .css_folder_editor_group[group="folder-icon"] .css_folder_editor_group_body .css_folder_editor_icon_input .css_folder_editor_open_icon_selector');
      break;
    case 'creator':
      currentTarget = 'creator';
      openIconSelectorElement = elementQuerySelector(folderCreatorField, '.css_folder_creator_body .css_folder_creator_groups .css_folder_creator_group[group="folder-icon"] .css_folder_creator_group_body .css_folder_creator_icon_input .css_folder_creator_open_icon_selector');
      break;
    default:
      break;
  }
  if (dataDownloadCompleted) {
    iconSelectorField.setAttribute('displayed', 'true');
    initializeIconSelectorField(currentTarget);
    prepareForMaterialSymbolsSearch();
  } else {
    promptMessage('download_for_offline', '資料還在下載中');
  }
}

export function closeIconSelector(): void {
  revokePageHistory('IconSelector');
  iconSelectorField.setAttribute('displayed', 'false');
}
