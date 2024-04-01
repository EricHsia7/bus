import { updateSearchResult } from './index.ts';
import { getTextWidth } from '../../tools/index.ts';

let keyboard_keys = [
  ['紅', '藍', '1', '2', '3'],
  ['綠', '棕', '4', '5', '6'],
  ['橘', '小', '7', '8', '9'],
  ['更多', '幹線', '清空', '0', '刪除']
];

const searchInputElement = document.querySelector('.search_page_field .search_page_head .search_page_search_input #search_route_input');
const keyboardElement = document.querySelector('.search_page_field .search_page_body .search_page_keyboard');

function supportTouch(): boolean {
if ('ontouchstart' in window || navigator.maxTouchPoints) {
    // Touch events are supported
return true
} else {
    // Touch events are not supported
return false
}
}

function initializeKeyboard(): void {
  var result = [];
  for (var row of keyboard_keys) {
    for (var column of row) {
      var eventScript = `bus.searchPage.typeTextIntoInput('${column}')`;
      var eventType = 'onclick'
if (column === '刪除') {
        eventScript = 'bus.searchPage.deleteCharFromInout()';
      }
      if (column === '清空') {
        eventScript = 'bus.searchPage.emptyInput()';
      }
      if(supportTouch()) {
      var eventType = 'ontouchstart'
}
      result.push(`<div class="search_page_keyboard_key" ${eventType}="${eventScript}">${column}</div>`);
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

function uodateCursor(value) {
  var offset = getTextWidth(value, `400 20px "Noto Sans", sans-serif`);
  document.querySelector('#search_style').innerHTML = `:root {--cursor-offset:${offset}px}`;
}
