import { getMaterialSymbolsSearchIndex } from '../../data/apis/getMaterialSymbolsSearchIndex';
import { deleteDataReceivingProgress } from '../../data/apis/loader';
import { MaterialSymbolsSearchResult, MaterialSymbolsSearchResults, prepareForMaterialSymbolsSearch, searchForMaterialSymbols } from '../../data/search/searchMaterialSymbols';
import { generateIdentifier } from '../../tools';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/elements';
import { containPhoneticSymbols } from '../../tools/text';
import { closeIconSelector } from '../icon-selector';
import { getBlankIconElement, setIcon } from '../icons';
import { MaterialSymbol } from '../icons/material-symbols-type';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';

let previousSearchResults: MaterialSymbolsSearchResults = [];
let previousInputElement;
let initialized: boolean = false;

const iconSelectorSearchField = documentQuerySelector('.css_icon_selector_search_field');
const headElement = elementQuerySelector(iconSelectorSearchField, '.css_icon_selector_search_head');
const searchInputElement = elementQuerySelector(headElement, '.css_icon_selector_search_input input[type="text"]') as HTMLInputElement;
const bodyElement = elementQuerySelector(iconSelectorSearchField, '.css_icon_selector_search_body');
const resultsElement = elementQuerySelector(bodyElement, '.css_icon_selector_search_results');

function generateElementOfResultItem(): HTMLElement {
  const element = documentCreateDivElement();
  element.classList.add('css_icon_selector_search_result');

  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_icon_selector_search_result_icon');
  iconElement.appendChild(getBlankIconElement());

  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_icon_selector_search_result_name');

  element.appendChild(iconElement);
  element.appendChild(nameElement);

  return element;
}

export function showIconSelectorSearch(): void {
  iconSelectorSearchField.setAttribute('displayed', 'true');
}

export function hideIconSelectorSearch(): void {
  iconSelectorSearchField.setAttribute('displayed', 'false');
}

export function openIconSelectorSearch(query: string, inputElement: HTMLInputElement): void {
  pushPageHistory('IconSelectorSearch');
  initializeIconSelectorSearchField(query, inputElement);
  showIconSelectorSearch();
  hidePreviousPage();
}

export function closeIconSelectorSearch(): void {
  hideIconSelectorSearch();
  showPreviousPage();
  revokePageHistory('IconSelectorSearch');
}

export function initializeIconSelectorSearchInput(): void {
  if (initialized) return;
  initialized = true;

  searchInputElement.addEventListener('paste', function () {
    updateResults();
  });

  searchInputElement.addEventListener('cut', function () {
    updateResults();
  });

  searchInputElement.addEventListener('selectionchange', function () {
    updateResults();
  });

  document.addEventListener('selectionchange', function () {
    updateResults();
  });

  searchInputElement.addEventListener('keyup', function () {
    updateResults();
  });
}

function updateResults(): void {
  function updateItem(thisElement: HTMLElement, inputElement: HTMLInputElement, currentItem: MaterialSymbolsSearchResult, previousItem: MaterialSymbolsSearchResult | null): void {
    function updateTypeIcon(thisElement: HTMLElement, thisItem: MaterialSymbolsSearchResult): void {
      const iconElement = elementQuerySelector(thisElement, '.css_icon_selector_search_result_icon');
      setIcon(iconElement, thisItem.item);
    }

    function updateName(thisElement: HTMLElement, thisItem: MaterialSymbolsSearchResult): void {
      const nameElement = elementQuerySelector(thisElement, '.css_icon_selector_search_result_name');
      nameElement.innerText = thisItem.item;
    }

    function updateOnclick(thisElement: HTMLElement, inputElement: HTMLInputElement, thisItem: MaterialSymbolsSearchResult): void {
      thisElement.onclick = function () {
        selectIcon(thisItem.item, inputElement);
      };
    }

    if (previousItem !== null) {
      if (currentItem.item !== previousItem.item) {
        updateTypeIcon(thisElement, currentItem);
        updateName(thisElement, currentItem);
        updateOnclick(thisElement, inputElement, currentItem);
      }
    } else {
      updateTypeIcon(thisElement, currentItem);
      updateName(thisElement, currentItem);
      updateOnclick(thisElement, inputElement, currentItem);
    }
  }

  const query = searchInputElement.value;
  if (!containPhoneticSymbols(query)) {
    const searchResults = searchForMaterialSymbols(query);
    const searchResultsLength = searchResults.length;

    const resultElements = Array.from(elementQuerySelectorAll(resultsElement, '.css_icon_selector_search_result'));
    const currentSearchResultElementsLength = resultElements.length;
    if (searchResultsLength !== currentSearchResultElementsLength) {
      const difference = currentSearchResultElementsLength - searchResultsLength;
      if (difference < 0) {
        const fragment = new DocumentFragment();
        for (let o = 0; o > difference; o--) {
          const newResultElement = generateElementOfResultItem();
          fragment.appendChild(newResultElement);
          resultElements.push(newResultElement);
        }
        resultsElement.appendChild(fragment);
      } else if (difference > 0) {
        for (let p = currentSearchResultElementsLength - 1, q = currentSearchResultElementsLength - difference - 1; p > q; p--) {
          resultElements[p].remove();
          resultElements.splice(p, 1);
        }
      }
    }

    for (let i = 0; i < searchResultsLength; i++) {
      const thisElement = resultElements[i];
      const thisItem = searchResults[i];
      const previousItem = previousSearchResults[i];
      if (previousItem) {
        updateItem(thisElement, previousInputElement, thisItem, previousItem);
      } else {
        updateItem(thisElement, previousInputElement, thisItem, null);
      }
    }

    previousSearchResults = searchResults;
  }
}

async function initializeIconSelectorSearchField(query: string, inputElement: HTMLInputElement) {
  const requestID = generateIdentifier();
  searchInputElement.value = query;
  const materialSymbolsSearchIndex = await getMaterialSymbolsSearchIndex(requestID);
  prepareForMaterialSymbolsSearch(materialSymbolsSearchIndex);
  updateResults();
  deleteDataReceivingProgress(requestID);
  previousInputElement = inputElement;
}

function selectIcon(icon: MaterialSymbol, inputElement: HTMLInputElement): void {
  inputElement.value = icon;
  closeIconSelectorSearch();
  closeIconSelector();
}
