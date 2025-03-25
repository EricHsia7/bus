import { openKeyboard, closeKeyboard } from './keyboard';
import { prepareForSearch, searchFor, SearchItem } from '../../data/search/index';
import { getIconHTML } from '../icons/index';
import { dataDownloadCompleted } from '../home/index';
import { promptMessage } from '../prompt/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { containPhoneticSymbols } from '../../tools/text';
import { getCSSVariableValue } from '../../tools/style';
import { supportTouch } from '../../tools/index';
import { drawRoundedRect } from '../../tools/graphic';
import { pushPageHistory, revokePageHistory } from '../index';
import { MaterialSymbols } from '../icons/material-symbols-type';
import { querySize } from '../index';

const searchField = documentQuerySelector('.css_search_field');
const searchHeadElement = elementQuerySelector(searchField, '.css_search_head');
const searchBodyElement = elementQuerySelector(searchField, '.css_search_body');
const searchInputElement = elementQuerySelector(searchHeadElement, '.css_search_search_input #search_input') as HTMLInputElement;
const searchInputCanvasElement = elementQuerySelector(searchHeadElement, '.css_search_search_input canvas');
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
const fontSize: number = 20 * searchInputCanvasScale;
const fontFamily: string = '"Noto Sans TC", sans-serif';

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

export function getSearchInputValue(): string {
  return String(searchInputElement.value);
}

export function getSearchTypeFilterValue(): number {
  return parseInt(searchTypeFilterButtonElement.getAttribute('type'));
}

export function openSearch(): void {
  if (dataDownloadCompleted) {
    pushPageHistory('Search');
    searchField.setAttribute('displayed', 'true');
    openKeyboard();
    prepareForSearch();
  } else {
    promptMessage('資料還在下載中', 'download_for_offline');
  }
}

export function closeSearch(): void {
  revokePageHistory('Search');
  closeKeyboard();
  searchField.setAttribute('displayed', 'false');
}

export function resizeSearchInputCanvas(): void {
  size = querySize('head-two-button');
  width = size.width;
  height = size.height;
  searchInputCanvasElement.width = width * searchInputCanvasScale;
  searchInputCanvasElement.height = height * searchInputCanvasScale;
  updateSearchInput(-1, -1);
}

function initializeKeyboard(): void {
  const keyboardKeys: Array<[string, string, string, string, string]> = [
    ['紅', '藍', '1', '2', '3'],
    ['綠', '棕', '4', '5', '6'],
    ['橘', '小', '7', '8', '9'],
    ['鍵盤', '幹線', '清空', '0', '刪除']
  ];
  const result: Array<string> = [];
  for (const row of keyboardKeys) {
    for (const column of row) {
      let eventScript = '';
      let eventType = 'onmousedown';
      let html = '';
      switch (column) {
        case '刪除':
          eventScript = 'bus.search.deleteCharFromInout()';
          html = getIconHTML('backspace');
          break;
        case '清空':
          eventScript = 'bus.search.emptyInput()';
          html = column;
          break;
        case '鍵盤':
          eventScript = 'bus.search.openSystemKeyboard(event)';
          html = getIconHTML('keyboard');
          break;
        default:
          eventScript = `bus.search.typeTextIntoInput('${column}')`;
          html = column;
          break;
      }

      if (supportTouch()) {
        eventType = 'ontouchstart';
      }
      result.push(`<button class="css_search_keyboard_key" ${eventType}="${eventScript}">${html}</button>`);
    }
  }
  searchKeyboardElement.innerHTML = result.join('');
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

export function typeTextIntoInput(value): void {
  const currentValue = getSearchInputValue();
  const newValue = `${currentValue}${value}`;
  searchInputElement.value = newValue;
  updateSearchResult();
  updateSearchInput(-1, -1);
}

export function deleteCharFromInout(): void {
  const currentValue = getSearchInputValue();
  const newValue = currentValue.substring(0, currentValue.length - 1);
  searchInputElement.value = newValue;
  updateSearchResult();
  updateSearchInput(-1, -1);
}

export function emptyInput(): void {
  searchInputElement.value = '';
  updateSearchResult();
  updateSearchInput(-1, -1);
}

export function openSystemKeyboard(event: Event): void {
  event.preventDefault();
  searchInputElement.focus();
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

  searchInputCanvasContext.font = `500 ${fontSize}px ${fontFamily}`;
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

export function updateSearchResult(): void {
  const currentType = getSearchTypeFilterValue();
  const currentValue = getSearchInputValue();
  if (!containPhoneticSymbols(currentValue)) {
    const typeToIcon: Array<MaterialSymbols> = ['route', 'location_on', 'directions_bus'];
    const html: Array<string> = [];
    const searchResults = searchFor(currentValue, currentType, 30);
    for (const result of searchResults) {
      const name = result.item.n;
      const typeIcon = getIconHTML(typeToIcon[result.item.type]);
      let onclickScript = '';
      switch (result.item.type) {
        case 0:
          onclickScript = `bus.route.openRoute(${result.item.id}, [${result.item.pid.join(',')}])`;
          break;
        case 1:
          onclickScript = `bus.location.openLocation('${result.item.hash}')`;
          break;
        case 2:
          onclickScript = `bus.bus.openBus(${result.item.id})`;
          break;
        default:
          break;
      }
      html.push(`<div class="css_search_search_result" onclick="${onclickScript}"><div class="css_search_search_result_type">${typeIcon}</div><div class="css_search_search_result_route_name">${name}</div></div>`);
    }
    searchResultsElement.innerHTML = html.join('');
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
  searchTypeFilterButtonElement.innerHTML = getIconHTML(icons[newType + 1]);
  searchTypeFilterButtonElement.setAttribute('type', newType.toString());
  updateSearchResult();
}

function animateCursor(): void {
  const x = new Date().getTime() / 400;
  const alpha = Math.abs(Math.sin(x));
  if (selection) {
    searchInputCanvasContext.globalAlpha = alpha;
    searchInputCanvasContext.clearRect(Math.min(cursorOffset, width - padding) - 1, 0, cursorWidth + 2, height);
    drawRoundedRect(searchInputCanvasContext, Math.min(cursorOffset, width - padding), (height - lineHeight) / 2, cursorWidth, lineHeight, cursorBorderRadius, cursorColor);
  }
  if (playingCursorAnimation) {
    window.requestAnimationFrame(animateCursor);
  }
}
