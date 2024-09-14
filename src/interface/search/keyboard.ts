import { updateSearchResult } from './index';
import { drawRoundedRect, getTextWidth } from '../../tools/index';
import { documentQuerySelector } from '../../tools/query-selector';
import { getIconHTML } from '../icons/index';
import { FieldSize } from '../index';

let keyboard_keys = [
  ['紅', '藍', '1', '2', '3'],
  ['綠', '棕', '4', '5', '6'],
  ['橘', '小', '7', '8', '9'],
  ['鍵盤', '幹線', '清空', '0', '刪除']
];

const searchInputElement = documentQuerySelector('.css_search_field .css_search_head .css_search_search_input #search_input');
const keyboardElement = documentQuerySelector('.css_search_field .css_search_body .css_search_keyboard');
const searchInputCanvasElement = documentQuerySelector('.css_search_field .css_search_head .css_search_search_input canvas');

const searchInputCanvasContext = searchInputCanvasElement.getContext('2d');
const searchInputPlaceholder = '搜尋路線、地點';
const searchInputCanvasScale = window.devicePixelRatio;

function querySearchInputCanvasSize(): FieldSize {
  return {
    width: window.innerWidth - 55,
    height: 55
  };
}

export function ResizeSearchInputCanvasSize(): void {
  const size = querySearchInputCanvasSize();
  const width = size.width;
  const height = size.height;
  searchInputCanvasElement.width = width * searchInputCanvasScale;
  searchInputCanvasElement.height = height * searchInputCanvasScale;
}

function supportTouch(): boolean {
  if ('ontouchstart' in window || navigator.maxTouchPoints) {
    // Touch events are supported
    return true;
  } else {
    // Touch events are not supported
    return false;
  }
}

function initializeKeyboard(): void {
  var result = [];
  for (var row of keyboard_keys) {
    for (var column of row) {
      let eventScript = '';
      let eventType = 'onmousedown';
      let html = '';
      switch (column) {
        case '刪除':
          eventScript = 'bus.searchPage.deleteCharFromInout()';
          html = getIconHTML('backspace');
          break;
        case '清空':
          eventScript = 'bus.searchPage.emptyInput()';
          html = column;
          break;
        case '鍵盤':
          eventScript = 'bus.searchPage.openSystemKeyboard()';
          html = getIconHTML('keyboard');
          break;
        default:
          eventScript = `bus.searchPage.typeTextIntoInput('${column}')`;
          html = column;
          break;
      }

      if (supportTouch()) {
        eventType = 'ontouchstart';
      }
      result.push(`<div class="css_search_keyboard_key" ${eventType}="${eventScript}">${html}</div>`);
    }
  }
  keyboardElement.innerHTML = result.join('');
}

export function openKeyboard() {
  initializeKeyboard();
  keyboardElement.setAttribute('displayed', 'true');
}

export function closeKeyboard() {
  keyboardElement.setAttribute('displayed', 'false');
}

export function openSystemKeyboard() {
  searchInputElement.focus();
}

export function typeTextIntoInput(value): void {
  var currentValue = String(searchInputElement.value);
  var newValue = `${currentValue}${value}`;
  searchInputElement.value = newValue;
  updateSearchResult(newValue);
  updateSearchInput(newValue);
}

export function deleteCharFromInout(): void {
  var currentValue = String(searchInputElement.value);
  var newValue = currentValue.substring(0, currentValue.length - 1);
  searchInputElement.value = newValue;
  updateSearchResult(newValue);
  updateSearchInput(newValue);
}

export function emptyInput(): void {
  searchInputElement.value = '';
  updateSearchResult('');
  updateSearchInput('');
}

export function updateSearchInput(value: string = ''): void {
  let empty = false;
  if (value.length === 0) {
    value = searchInputPlaceholder;
    empty = true;
  }
  const size = querySearchInputCanvasSize();
  const width = size.width * searchInputCanvasScale;
  const height = size.height * searchInputCanvasScale;
  const fontSize: number = 20 * searchInputCanvasScale;
  const fontFamily: string = '"Noto Sans TC", sans-serif';
  const lineHeight: number = 25 * searchInputCanvasScale;
  const textColor: string = getComputedStyle(document.documentElement).getPropertyValue('--b-cssvar-333333');
  const placeholderTextColor: string = getComputedStyle(document.documentElement).getPropertyValue('--b-cssvar-aeaeb2');
  const cursorWidth: number = 1.8 * searchInputCanvasScale;
  const cursorBorderRadius: number = 0.9 * searchInputCanvasScale;
  const cursorColor: string = getComputedStyle(document.documentElement).getPropertyValue('--b-cssvar-main-color');
  let cursorOffset: number = 0;

  searchInputCanvasContext.font = `500 ${fontSize}px ${fontFamily}`;
  searchInputCanvasContext.fillStyle = empty ? placeholderTextColor : textColor;
  searchInputCanvasContext.textAlign = 'center';
  searchInputCanvasContext.textBaseline = 'middle';

  cursorOffset = empty ? 1 : Math.max(1, searchInputCanvasContext.measureText(value).width);

  searchInputCanvasContext.clearRect(0, 0, width, height);
  searchInputCanvasContext.fillText(value, searchInputCanvasContext.measureText(value).width / 2, height / 2);

  drawRoundedRect(searchInputCanvasContext, cursorOffset, (height - lineHeight) / 2, cursorWidth, lineHeight, cursorBorderRadius, cursorColor);
}
