import { getMaterialSymbolsSearchIndex } from '../../data/apis/getMaterialSymbolsSearchIndex';
import { MaterialSymbolsSearchResult, MaterialSymbolsSearchResults, prepareForMaterialSymbolsSearch, searchForMaterialSymbols } from '../../data/search/searchMaterialSymbols';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { Progress } from '../../tools/progress';
import { containPhoneticSymbols } from '../../tools/text';
import { closeIconSelector } from '../icon-selector';
import { getBlankIconElement, setIcon } from '../icons';
import { MaterialSymbol } from '../icons/material-symbols-type';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';

let previousSearchResults: MaterialSymbolsSearchResults = [];
let previousInputElement: HTMLInputElement;
let previousQuery: string = '';
let initialized: boolean = false;

const iconSelectorSearchField = documentQuerySelector('.css_icon_selector_search_field');
const headElement = elementQuerySelector(iconSelectorSearchField, '.css_icon_selector_search_head');
const searchInputElement = elementQuerySelector(headElement, '.css_icon_selector_search_input input[type="text"]') as HTMLInputElement;
const bodyElement = elementQuerySelector(iconSelectorSearchField, '.css_icon_selector_search_body');
const resultsElement = elementQuerySelector(bodyElement, '.css_icon_selector_search_results');

const resultElements: Array<HTMLElement> = [];

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
      nameElement.textContent = thisItem.item;
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

      if (previousInputElement !== inputElement) {
        updateOnclick(thisElement, inputElement, currentItem);
      }
    } else {
      updateTypeIcon(thisElement, currentItem);
      updateName(thisElement, currentItem);
      updateOnclick(thisElement, inputElement, currentItem);
    }
  }

  const query = searchInputElement.value;
  if (!containPhoneticSymbols(query) && query !== previousQuery) {
    const searchResults = searchForMaterialSymbols(query);
    const searchResultsLength = searchResults.length;

    const resultElementsLength = resultElements.length;
    if (searchResultsLength !== resultElementsLength) {
      const difference = resultElementsLength - searchResultsLength;
      if (difference < 0) {
        const fragment = new DocumentFragment();
        for (let o = 0; o > difference; o--) {
          const newResultElement = generateElementOfResultItem();
          fragment.appendChild(newResultElement);
          resultElements.push(newResultElement);
        }
        resultsElement.appendChild(fragment);
      } else if (difference > 0) {
        for (let p = resultElementsLength - 1, q = resultElementsLength - difference - 1; p > q; p--) {
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
    previousQuery = query;
  }
}

async function initializeIconSelectorSearchField(query: string, inputElement: HTMLInputElement) {
  previousInputElement = inputElement;
  searchInputElement.value = query;
  const progress = new Progress(1, function () {});
  const materialSymbolsSearchIndex = await getMaterialSymbolsSearchIndex(progress);
  progress.terminate();
  prepareForMaterialSymbolsSearch(materialSymbolsSearchIndex);
  updateResults();
}

function selectIcon(icon: MaterialSymbol, inputElement: HTMLInputElement): void {
  inputElement.value = icon;
  closeIconSelectorSearch();
  closeIconSelector();
}
