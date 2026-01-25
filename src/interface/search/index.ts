import { prepareForSearch, searchFor, SearchItem, SearchResult } from '../../data/search/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/elements';
import { drawRoundedRect } from '../../tools/graphic';
import { supportTouch } from '../../tools/index';
import { getCSSVariableValue } from '../../tools/style';
import { containPhoneticSymbols } from '../../tools/text';
import { openBus } from '../bus/index';
import { dataDownloadCompleted } from '../home/index';
import { getBlankIconElement, getIconElement, setIcon } from '../icons/index';
import { MaterialSymbols } from '../icons/material-symbols-type';
import { GeneratedElement, pushPageHistory, querySize, revokePageHistory, scrollDocumentToTop } from '../index';
import { openLocation } from '../location/index';
import { promptMessage } from '../prompt/index';
import { openRoute } from '../route/index';

let previousSearchResults: Array<SearchResult> = [];

const searchField = documentQuerySelector('.css_search_field');
const searchHeadElement = elementQuerySelector(searchField, '.css_search_head');
const searchBodyElement = elementQuerySelector(searchField, '.css_search_body');
const searchInputElement = elementQuerySelector(searchHeadElement, '.css_search_search_input #search_input') as HTMLInputElement;
const searchInputCanvasElement = elementQuerySelector(searchHeadElement, '.css_search_search_input canvas') as HTMLCanvasElement;
const searchTypeFilterButtonElement = elementQuerySelector(searchHeadElement, '.css_search_button_right');
const searchResultsElement = elementQuerySelector(searchBodyElement, '.css_search_results');
const searchKeyboardElement = elementQuerySelector(searchBodyElement, '.css_search_keyboard');

const searchInputCanvasContext = searchInputCanvasElement.getContext('2d');
const searchInputPlaceholder = '搜尋路線、地點、公車';
const searchInputCanvasScale = window.devicePixelRatio;

const padding: number = 15 * searchInputCanvasScale;
const cursorWidth: number = 1.8 * searchInputCanvasScale;
const cursorBorderRadius: number = 0.9 * searchInputCanvasScale;
const selectionHighlightBorderRadius: number = 4 * searchInputCanvasScale;
const lineHeight: number = 25 * searchInputCanvasScale;
const fontWeight: string = '400';
const fontSize: number = 20 * searchInputCanvasScale;
const fontFamily: string = '"Noto Sans TC", sans-serif';

const keyboardRows: Array<[string, string, string, string, string]> = [
  ['紅', '藍', '1', '2', '3'],
  ['綠', '棕', '4', '5', '6'],
  ['橘', '小', '7', '8', '9'],
  ['鍵盤', '幹線', '清空', '0', '刪除']
];

let textColor: string = getCSSVariableValue('--b-cssvar-333333');
let placeholderTextColor: string = getCSSVariableValue('--b-cssvar-aeaeb2');
let cursorColor: string = getCSSVariableValue('--b-cssvar-main-color');
let textWidth: number = 0;
let textWidthToCursorStart: number = 0;
let selectedTextWidth: number = 0;
let selection: boolean = false;
let cursorOffset: number = 0;
let size = querySize('head-two-button');
let width = size.width * searchInputCanvasScale;
let height = size.height * searchInputCanvasScale;
let playingCursorAnimation: boolean = false;
let keyboardInitialized = false;

export function typeTextIntoInput(value): void {
  const currentValue = getSearchInputValue();
  const newValue = `${currentValue}${value}`;
  searchInputElement.value = newValue;
  updateSearchResult();
  updateSearchInput(-1, -1);
  scrollDocumentToTop();
}

export function deleteCharFromInput(): void {
  const currentValue = getSearchInputValue();
  const newValue = currentValue.substring(0, currentValue.length - 1);
  searchInputElement.value = newValue;
  updateSearchResult();
  updateSearchInput(-1, -1);
  scrollDocumentToTop();
}

export function emptyInput(): void {
  searchInputElement.value = '';
  updateSearchResult();
  updateSearchInput(-1, -1);
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
            newButtonElement.appendChild(document.createTextNode(item));
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
            newButtonElement.appendChild(document.createTextNode(item));
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
  playingCursorAnimation = true;
  animateCursor();
  updateSearchInput(-1, -1);
}

export function closeKeyboard(): void {
  searchKeyboardElement.setAttribute('displayed', 'false');
  playingCursorAnimation = false;
}

export function getSearchTypeFilterValue(): SearchItem['type'] | -1 {
  return parseInt(searchTypeFilterButtonElement.getAttribute('type'));
}

export function getSearchInputValue(): string {
  return String(searchInputElement.value);
}

export function updateSearchInput(cursorStart: number, cursorEnd: number): void {
  let value = getSearchInputValue();
  let empty = false;
  if (value.length === 0) {
    value = searchInputPlaceholder;
    empty = true;
    cursorStart = 0;
    cursorEnd = 0;
  } else {
    if (cursorStart === -1 && cursorEnd === -1) {
      cursorStart = value.length;
      cursorEnd = cursorStart * 1;
    }
  }

  size = querySize('head-two-button');
  width = size.width * searchInputCanvasScale;
  height = size.height * searchInputCanvasScale;
  textColor = getCSSVariableValue('--b-cssvar-333333');
  placeholderTextColor = getCSSVariableValue('--b-cssvar-aeaeb2');
  cursorColor = getCSSVariableValue('--b-cssvar-main-color');

  searchInputCanvasContext.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  searchInputCanvasContext.textAlign = 'center';
  searchInputCanvasContext.textBaseline = 'middle';

  textWidth = searchInputCanvasContext.measureText(value).width;
  textWidthToCursorStart = searchInputCanvasContext.measureText(value.substring(0, cursorStart)).width;
  selectedTextWidth = searchInputCanvasContext.measureText(value.substring(cursorStart, cursorEnd)).width;
  cursorOffset = empty ? 1 : Math.max(1, textWidthToCursorStart);

  searchInputCanvasContext.clearRect(0, 0, width, height);

  if (cursorStart === cursorEnd) {
    selection = true;
    searchInputCanvasContext.globalAlpha = 1;
    searchInputCanvasContext.fillStyle = empty ? placeholderTextColor : textColor;
    searchInputCanvasContext.fillText(value, textWidth / 2 + (Math.min(cursorOffset, width - padding) - cursorOffset), height / 2);
    drawRoundedRect(searchInputCanvasContext, Math.min(cursorOffset, width - padding), (height - lineHeight) / 2, cursorWidth, lineHeight, cursorBorderRadius, cursorColor);
  } else {
    selection = false;
    searchInputCanvasContext.globalAlpha = 0.27;
    drawRoundedRect(searchInputCanvasContext, Math.min(cursorOffset, width - padding), (height - lineHeight) / 2, selectedTextWidth, lineHeight, selectionHighlightBorderRadius, cursorColor);
    searchInputCanvasContext.globalAlpha = 1;
    searchInputCanvasContext.fillStyle = empty ? placeholderTextColor : textColor;
    searchInputCanvasContext.fillText(value, textWidth / 2 + (Math.min(cursorOffset, width - padding) - cursorOffset), height / 2);
    searchInputCanvasContext.globalAlpha = 0.08;
    drawRoundedRect(searchInputCanvasContext, Math.min(cursorOffset, width - padding), (height - lineHeight) / 2, selectedTextWidth, lineHeight, selectionHighlightBorderRadius, cursorColor);
  }
}

export function resizeSearchInputCanvas(): void {
  size = querySize('head-two-button');
  width = size.width;
  height = size.height;
  searchInputCanvasElement.width = width * searchInputCanvasScale;
  searchInputCanvasElement.height = height * searchInputCanvasScale;
  updateSearchInput(-1, -1);
}

function animateCursor(): void {
  const x = performance.now();
  const alpha = 1 - Math.pow(Math.sin((Math.PI * x) / 960), 4);
  if (selection) {
    searchInputCanvasContext.globalAlpha = alpha;
    searchInputCanvasContext.clearRect(Math.min(cursorOffset, width - padding) - 1, 0, cursorWidth + 2, height);
    drawRoundedRect(searchInputCanvasContext, Math.min(cursorOffset, width - padding), (height - lineHeight) / 2, cursorWidth, lineHeight, cursorBorderRadius, cursorColor);
  }
  if (playingCursorAnimation) {
    window.requestAnimationFrame(animateCursor);
  }
}

function generateElementOfSearchResultItem(): GeneratedElement {
  const searchResultItemElement = document.createElement('div');
  searchResultItemElement.classList.add('css_search_search_result');

  const nameElement = document.createElement('div');
  nameElement.classList.add('css_search_search_result_name');

  const typeElement = document.createElement('div');
  typeElement.classList.add('css_search_search_result_type');
  typeElement.appendChild(getBlankIconElement());

  searchResultItemElement.appendChild(typeElement);
  searchResultItemElement.appendChild(nameElement);
  return {
    element: searchResultItemElement,
    id: ''
  };
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
  const currentValue = getSearchInputValue();
  if (!containPhoneticSymbols(currentValue)) {
    const searchResults = searchFor(currentValue, currentType, 30);
    const searchResultLength = searchResults.length;
    const currentItemCapacity = elementQuerySelectorAll(searchResultsElement, '.css_search_search_result').length;
    if (searchResultLength !== currentItemCapacity) {
      const difference = currentItemCapacity - searchResultLength;
      if (difference < 0) {
        const fragment = new DocumentFragment();
        for (let o = 0, d = Math.abs(difference); o < d; o++) {
          const newElement = generateElementOfSearchResultItem();
          fragment.appendChild(newElement.element);
        }
        searchResultsElement.appendChild(fragment);
      } else {
        const searchResultElements2 = elementQuerySelectorAll(searchResultsElement, '.css_search_search_result');
        for (let o = 0, d = Math.abs(difference); o < d; o++) {
          const itemIndex = currentItemCapacity - 1 - o;
          searchResultElements2[itemIndex].remove();
        }
      }
    }

    const searchResultElements = elementQuerySelectorAll(searchResultsElement, '.css_search_search_result');
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
