import { updateSearchResult } from './index';
import { supportTouch } from '../../tools/index';
import { drawRoundedRect } from '../../tools/graphic';
import { documentQuerySelector } from '../../tools/query-selector';
import { getIconHTML } from '../icons/index';
import { querySize } from '../index';

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

const padding: number = 15 * searchInputCanvasScale;
const cursorWidth: number = 1.8 * searchInputCanvasScale;
const cursorBorderRadius: number = 0.9 * searchInputCanvasScale;
const lineHeight: number = 25 * searchInputCanvasScale;
const fontSize: number = 20 * searchInputCanvasScale;
const fontFamily: string = '"Noto Sans TC", sans-serif';

let textColor: string = getComputedStyle(document.documentElement).getPropertyValue('--b-cssvar-333333');
let placeholderTextColor: string = getComputedStyle(document.documentElement).getPropertyValue('--b-cssvar-aeaeb2');
let cursorColor: string = getComputedStyle(document.documentElement).getPropertyValue('--b-cssvar-main-color');
let textWidth: number = 0;
let slicedTextWidth: number = 0;
let cursorOffset: number = 0;
let size = querySize('head-one-button');
let width = size.width * searchInputCanvasScale;
let height = size.height * searchInputCanvasScale;
let playingCursorAnimation: boolean = false;

export function ResizeSearchInputCanvasSize(): void {
  size = querySize('head-one-button');
  width = size.width;
  height = size.height;
  searchInputCanvasElement.width = width * searchInputCanvasScale;
  searchInputCanvasElement.height = height * searchInputCanvasScale;
  updateSearchInput(searchInputElement.value, -1);
}

function initializeKeyboard(): void {
  let result = [];
  for (const row of keyboard_keys) {
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
  keyboardElement.innerHTML = result.join('');
}

export function openKeyboard() {
  initializeKeyboard();
  keyboardElement.setAttribute('displayed', 'true');

  playingCursorAnimation = true;
  animateCursor();

  const value = searchInputElement.value;
  updateSearchInput(value, -1);
}

export function closeKeyboard() {
  keyboardElement.setAttribute('displayed', 'false');
  playingCursorAnimation = false;
}

export function openSystemKeyboard(event: Event) {
  event.preventDefault();
  searchInputElement.focus();
}

export function typeTextIntoInput(value): void {
  const currentValue = String(searchInputElement.value);
  const newValue = `${currentValue}${value}`;
  searchInputElement.value = newValue;
  updateSearchResult(newValue);
  updateSearchInput(newValue, -1);
}

export function deleteCharFromInout(): void {
  const currentValue = String(searchInputElement.value);
  const newValue = currentValue.substring(0, currentValue.length - 1);
  searchInputElement.value = newValue;
  updateSearchResult(newValue);
  updateSearchInput(newValue, -1);
}

export function emptyInput(): void {
  searchInputElement.value = '';
  updateSearchResult('');
  updateSearchInput('', -1);
}

export function updateSearchInput(value: string = '', cursorIndex: number): void {
  let empty = false;
  if (value.length === 0) {
    value = searchInputPlaceholder;
    empty = true;
    cursorIndex = 0;
  } else {
    if (cursorIndex === -1) {
      cursorIndex = value.length;
    }
  }

  size = querySize('head-one-button');
  width = size.width * searchInputCanvasScale;
  height = size.height * searchInputCanvasScale;
  textColor = getComputedStyle(document.documentElement).getPropertyValue('--b-cssvar-333333');
  placeholderTextColor = getComputedStyle(document.documentElement).getPropertyValue('--b-cssvar-aeaeb2');
  cursorColor = getComputedStyle(document.documentElement).getPropertyValue('--b-cssvar-main-color');

  searchInputCanvasContext.font = `500 ${fontSize}px ${fontFamily}`;
  searchInputCanvasContext.fillStyle = empty ? placeholderTextColor : textColor;
  searchInputCanvasContext.textAlign = 'center';
  searchInputCanvasContext.textBaseline = 'middle';

  textWidth = searchInputCanvasContext.measureText(value).width;
  slicedTextWidth = searchInputCanvasContext.measureText(value.substring(0, cursorIndex)).width;
  cursorOffset = empty ? 1 : Math.max(1, slicedTextWidth);

  searchInputCanvasContext.globalAlpha = 1;
  searchInputCanvasContext.clearRect(0, 0, width, height);
  searchInputCanvasContext.fillText(value, textWidth / 2 + (Math.min(cursorOffset, width - padding) - cursorOffset), height / 2);

  drawRoundedRect(searchInputCanvasContext, Math.min(cursorOffset, width - padding), (height - lineHeight) / 2, cursorWidth, lineHeight, cursorBorderRadius, cursorColor);
}

function animateCursor(): void {
  const x = new Date().getTime() / 400;
  const alpha = Math.abs(Math.sin(x));
  searchInputCanvasContext.globalAlpha = alpha;
  searchInputCanvasContext.clearRect(Math.min(cursorOffset, width - padding) - 1, 0, cursorWidth + 2, height);
  drawRoundedRect(searchInputCanvasContext, Math.min(cursorOffset, width - padding), (height - lineHeight) / 2, cursorWidth, lineHeight, cursorBorderRadius, cursorColor);
  if (playingCursorAnimation) {
    window.requestAnimationFrame(animateCursor);
  }
}
