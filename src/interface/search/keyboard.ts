import { updateSearchResult } from './index.ts';
import { getTextWidth } from '../../tools/index.ts';
import { documentQuerySelector } from '../../tools/query-selector.ts';
import { icons } from '../icons/index.ts';

let keyboard_keys = [
  ['紅', '藍', '1', '2', '3'],
  ['綠', '棕', '4', '5', '6'],
  ['橘', '小', '7', '8', '9'],
  ['更多', '幹線', '清空', '0', '刪除']
];

const searchInputElement = documentQuerySelector('.css_search_field .css_search_head .css_search_search_input #search_route_input');
const keyboardElement = documentQuerySelector('.css_search_field .css_search_body .css_search_keyboard');

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
      var eventScript = `bus.searchPage.typeTextIntoInput('${column}')`;
      var eventType = 'onmousedown';
      var html = column;
      if (column === '刪除') {
        eventScript = 'bus.searchPage.deleteCharFromInout()';
        html = icons.backspace;
      }
      if (column === '清空') {
        eventScript = 'bus.searchPage.emptyInput()';
      }
      if (supportTouch()) {
        var eventType = 'ontouchstart';
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
  initializeKeyboard();
  keyboardElement.setAttribute('displayed', 'false');
}

export function typeTextIntoInput(value): void {
  var currentValue = String(searchInputElement.value);
  var newValue = `${currentValue}${value}`;
  searchInputElement.value = newValue;
  updateSearchResult(newValue);
  uodateCursor(newValue);
}

export function deleteCharFromInout(): void {
  var currentValue = String(searchInputElement.value);
  var newValue = currentValue.substring(0, currentValue.length - 1);
  searchInputElement.value = newValue;
  updateSearchResult(newValue);
  uodateCursor(newValue);
}

export function emptyInput(): void {
  searchInputElement.value = '';
  updateSearchResult('');
  uodateCursor('');
}

function uodateCursor(value: string): void {
  var offset = getTextWidth(value, 500, '20px', `"Noto Sans", sans-serif`, 100, 'normal', 'none', '1.2');
  documentQuerySelector('#search_style').innerHTML = `:root {--b-cssvar-cursor-offset:${offset}px}`;
}
