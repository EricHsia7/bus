import { prepareForSearch, searchFor, SearchItem, SearchResult } from '../../data/search/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/elements';
import { getTextBoundingBox } from '../../tools/graphic';
import { booleanToString, supportTouch } from '../../tools/index';
import { containPhoneticSymbols } from '../../tools/text';
import { openBus } from '../bus/index';
import { dataDownloadCompleted } from '../home/index';
import { getBlankIconElement, getIconElement, setIcon } from '../icons/index';
import { MaterialSymbols } from '../icons/material-symbols-type';
import { pushPageHistory, querySize, revokePageHistory, scrollDocumentToTop } from '../index';
import { openLocation } from '../location/index';
import { promptMessage } from '../prompt/index';
import { openRoute } from '../route/index';

let previousSearchResults: Array<SearchResult> = [];

const searchField = documentQuerySelector('.css_search_field');
const searchHeadElement = elementQuerySelector(searchField, '.css_search_head');
const searchBodyElement = elementQuerySelector(searchField, '.css_search_body');
const searchInputElement = elementQuerySelector(searchHeadElement, '.css_search_search_input #search_input') as HTMLInputElement;

const searchInputSVGElement = elementQuerySelector(searchHeadElement, '.css_search_search_input svg') as SVGElement;
const searchInputSVGTextElement = elementQuerySelector(searchInputSVGElement, 'text[component="text"]') as SVGTextElement;
const searchInputSVGCursorElement = elementQuerySelector(searchInputSVGElement, 'path[component="cursor"]') as SVGPathElement;

const searchTypeFilterButtonElement = elementQuerySelector(searchHeadElement, '.css_search_button_right');
const searchResultsElement = elementQuerySelector(searchBodyElement, '.css_search_results');
const searchKeyboardElement = elementQuerySelector(searchBodyElement, '.css_search_keyboard');

const fontWeight = '400';
const fontSize = '20px';
const fontFamily = '"Noto Sans TC", sans-serif';
const searchInputPlaceholder = '搜尋路線、地點、公車';

const keyboardRows: Array<[string, string, string, string, string]> = [
  ['紅', '藍', '1', '2', '3'],
  ['綠', '棕', '4', '5', '6'],
  ['橘', '小', '7', '8', '9'],
  ['鍵盤', '幹線', '清空', '0', '刪除']
];

let size = querySize('head-two-button');
let width = size.width;
let height = size.height;
let keyboardInitialized = false;
let previousValue: string = '';
let previousType = 0;

export function typeTextIntoInput(value): void {
  const currentValue = searchInputElement.value;
  const newValue = `${currentValue}${value}`;
  searchInputElement.value = newValue;
  updateSearchResult();
  bringToEnd();
  updateSearchInput();
  scrollDocumentToTop();
}

export function deleteCharFromInput(): void {
  const currentValue = searchInputElement.value;
  const newValue = currentValue.substring(0, currentValue.length - 1);
  searchInputElement.value = newValue;
  updateSearchResult();
  bringToEnd();
  updateSearchInput();
  scrollDocumentToTop();
}

export function emptyInput(): void {
  searchInputElement.value = '';
  updateSearchResult();
  bringToEnd();
  updateSearchInput();
  scrollDocumentToTop();
}

export function openSystemKeyboard(event: Event): void {
  event.preventDefault();
  searchInputElement.focus();
  scrollDocumentToTop();
}

function initializeKeyboard(): void {
  if (!keyboardInitialized) {
    keyboardInitialized = true;
    const fragment = new DocumentFragment();
    for (const row of keyboardRows) {
      for (const item of row) {
        const newButtonElement = document.createElement('button');
        newButtonElement.classList.add('css_search_keyboard_key');
        const eventName = supportTouch() ? 'touchstart' : 'mousedown';
        switch (item) {
          case '刪除':
            newButtonElement.addEventListener(eventName, deleteCharFromInput);
            newButtonElement.appendChild(getIconElement('backspace'));
            break;
          case '清空':
            newButtonElement.addEventListener(eventName, emptyInput);
            newButtonElement.innerText = item;
            break;
          case '鍵盤':
            newButtonElement.addEventListener(eventName, openSystemKeyboard);
            newButtonElement.appendChild(getIconElement('keyboard'));
            break;
          default:
            // Use an IIFE (Immediately Invoked Function Expression) to create a new scope for each item value. This ensures that the item variable is captured by value rather than by reference.
            newButtonElement.addEventListener(
              eventName,
              (function (currentItem) {
                return function () {
                  typeTextIntoInput(currentItem);
                };
              })(item)
            );
            newButtonElement.innerText = item;
            break;
        }

        fragment.appendChild(newButtonElement);
      }
    }
    searchKeyboardElement.append(fragment);
  }
}

export function openKeyboard(): void {
  initializeKeyboard();
  searchKeyboardElement.setAttribute('displayed', 'true');
  bringToEnd();
}

export function closeKeyboard(): void {
  searchKeyboardElement.setAttribute('displayed', 'false');
}

export function initializeSearchInput(): void {
  searchInputElement.addEventListener('paste', function () {
    updateSearchInput();
    updateSearchResult();
  });
  searchInputElement.addEventListener('cut', function () {
    updateSearchInput();
    updateSearchResult();
  });
  searchInputElement.addEventListener('selectionchange', function () {
    updateSearchInput();
    updateSearchResult();
  });
  document.addEventListener('selectionchange', function () {
    updateSearchInput();
    updateSearchResult();
  });
  searchInputElement.addEventListener('keyup', function () {
    updateSearchInput();
    updateSearchResult();
  });
  searchInputElement.addEventListener('scroll', function () {
    updateSearchInput();
  });
}

function getSearchTypeFilterValue(): SearchItem['type'] | -1 {
  return parseInt(searchTypeFilterButtonElement.getAttribute('type'));
}

function updateSearchInput(): void {
  const scrollLeft = searchInputElement.scrollLeft;
  const currentValue = searchInputElement.value;
  const selectionStart = searchInputElement.selectionStart;
  const selectionEnd = searchInputElement.selectionEnd;

  const empty = currentValue.length === 0;
  const text = empty ? searchInputPlaceholder : currentValue;
  const cursorStart = empty ? 0 : selectionStart;
  const cursorEnd = empty ? 0 : selectionEnd;
  const selection = cursorStart !== cursorEnd;

  const m = getTextBoundingBox(text, fontWeight, fontSize, fontFamily);
  const m1 = getTextBoundingBox(text.substring(0, cursorStart), fontWeight, fontSize, fontFamily);
  const x = scrollLeft * -1;
  const y = m[0] + (height - m[2]) / 2;

  searchInputSVGTextElement.textContent = text;
  searchInputSVGTextElement.setAttribute('transform', `translate(${x} ${y})`);
  searchInputSVGCursorElement.setAttribute('transform', `translate(${empty ? 1 : Math.max(Math.min(m1[1] + x, width - 1), 1)} 0)`);

  searchInputSVGTextElement.setAttribute('empty', booleanToString(empty));
  searchInputSVGCursorElement.setAttribute('selection', booleanToString(selection));
  searchInputElement.setAttribute('selection', booleanToString(selection));
}

function bringToEnd(): void {
  const currentValue = searchInputElement.value;
  const length = currentValue.length;
  const m = getTextBoundingBox(currentValue, fontWeight, fontSize, fontFamily);
  searchInputElement.setSelectionRange(length, length);
  searchInputElement.scrollTo({ left: m[1] - width });
}

export function resizeSearchInputSVG(): void {
  size = querySize('head-two-button');
  width = size.width;
  height = size.height;
  searchInputSVGElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
  bringToEnd();
  updateSearchInput();
}

function generateElementOfSearchResultItem(): HTMLElement {
  const searchResultItemElement = document.createElement('div');
  searchResultItemElement.classList.add('css_search_search_result');

  const nameElement = document.createElement('div');
  nameElement.classList.add('css_search_search_result_name');

  const typeElement = document.createElement('div');
  typeElement.classList.add('css_search_search_result_type');
  typeElement.appendChild(getBlankIconElement());

  searchResultItemElement.appendChild(typeElement);
  searchResultItemElement.appendChild(nameElement);
  return searchResultItemElement;
}

export function updateSearchResult(): void {
  const typeToIcon: Array<MaterialSymbols> = ['route', 'location_on', 'directions_bus'];

  function updateItem(element: HTMLElement, currentItem: SearchResult, previousItem: SearchResult | null): void {
    function updateTypeIcon(item: SearchResult, element: HTMLElement): void {
      const thisSearchResultTypeElement = elementQuerySelector(element, '.css_search_search_result_type');
      setIcon(thisSearchResultTypeElement, typeToIcon[item.item.type]);
    }

    function updateName(item: SearchResult, element: HTMLElement): void {
      const nameElement = elementQuerySelector(element, '.css_search_search_result_name');
      nameElement.innerText = item.item.n;
    }

    function updateClickHandler(item: SearchResult, element: HTMLElement): void {
      switch (item.item.type) {
        case 0:
          element.onclick = function () {
            openRoute(item.item.id as number, item.item.pid);
          };
          break;
        case 1:
          element.onclick = function () {
            openLocation(item.item.hash);
          };
          break;
        case 2:
          element.onclick = function () {
            openBus(item.item.id as number);
          };
          break;
        default:
          break;
      }
    }
    // compare the current item with the previous item
    if (previousItem) {
      if (currentItem.item.type !== previousItem.item.type) {
        updateTypeIcon(currentItem, element);
      }
      if (currentItem.item.id !== previousItem.item.id) {
        updateName(currentItem, element);
        updateClickHandler(currentItem, element);
      }
    }
    // if the previous item is null, it means this is a new item
    else {
      updateTypeIcon(currentItem, element);
      updateName(currentItem, element);
      updateClickHandler(currentItem, element);
    }
  }

  const currentType = getSearchTypeFilterValue();
  const currentValue = searchInputElement.value;
  if (!containPhoneticSymbols(currentValue) && (currentValue !== previousValue || currentType !== previousType)) {
    const searchResults = searchFor(currentValue, currentType, 30);
    const searchResultLength = searchResults.length;
    const searchResultElements = Array.from(elementQuerySelectorAll(searchResultsElement, '.css_search_search_result'));
    const currentItemCapacity = searchResultElements.length;
    if (searchResultLength !== currentItemCapacity) {
      const difference = currentItemCapacity - searchResultLength;
      if (difference < 0) {
        const fragment = new DocumentFragment();
        for (let o = 0; o > difference; o--) {
          const newSearchResultElement = generateElementOfSearchResultItem();
          fragment.appendChild(newSearchResultElement);
          searchResultElements.push(newSearchResultElement);
        }
        searchResultsElement.appendChild(fragment);
      } else if (difference > 0) {
        for (let p = currentItemCapacity - 1, q = currentItemCapacity - difference - 1; p > q; p--) {
          searchResultElements[p].remove();
          searchResultElements.splice(p, 1);
        }
      }
    }

    for (let i = 0; i < searchResultLength; i++) {
      const previousItem = previousSearchResults[i];
      const currentItem = searchResults[i];
      const thisItemElement = searchResultElements[i];
      if (previousItem) {
        updateItem(thisItemElement, currentItem, previousItem);
      } else {
        updateItem(thisItemElement, currentItem, null);
      }
    }
    previousSearchResults = searchResults;
  }

  previousValue = currentValue;
  previousType = currentType;
}

export function switchSearchTypeFilter(): void {
  const currentType = getSearchTypeFilterValue();
  let newType: number = -1;
  if (currentType >= -1 && currentType < 2) {
    newType = currentType + 1;
  } else {
    newType = -1;
  }
  const icons: Array<MaterialSymbols> = ['filter_list', 'route', 'location_on', 'directions_bus'];
  setIcon(searchTypeFilterButtonElement, icons[newType + 1]);
  searchTypeFilterButtonElement.setAttribute('type', newType.toString());
  updateSearchResult();
}

export function openSearch(): void {
  if (dataDownloadCompleted) {
    pushPageHistory('Search');
    searchField.setAttribute('displayed', 'true');
    openKeyboard();
    prepareForSearch();
  } else {
    promptMessage('download_for_offline', '資料還在下載中');
  }
}

export function closeSearch(): void {
  revokePageHistory('Search');
  closeKeyboard();
  searchField.setAttribute('displayed', 'false');
}
