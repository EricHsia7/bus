import { getSettingOptionValue } from '../../data/settings/index';
import { IntegratedMaterialSymbols, IntegratedMaterialSymbolsItem, integrateMaterialSymbols } from '../../data/symbols';
import { BitState } from '../../tools/bit-state';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/elements';
import { booleanToString, generateIdentifier } from '../../tools/index';
import { getBlankIconElement, getIconElement, setIcon } from '../icons/index';
import { hidePreviousPage, pushPageHistory, querySize, revokePageHistory, showPreviousPage } from '../index';

const iconSelectorField = documentQuerySelector('.css_icon_selector_field');
const bodyElement = elementQuerySelector(iconSelectorField, '.css_icon_selector_body');
const trayElement = elementQuerySelector(bodyElement, '.css_icon_selector_tray');
const contentElement = elementQuerySelector(trayElement, '.css_icon_selector_content');

let currentIntegration: IntegratedMaterialSymbols = [];

let previousAnimation: boolean = false;
let previosuSkeletonScreen: boolean = false;
let previousInputElement;

const buffer = 8;
const itemHeight = 50;
const itemExtraHeight = 90;

const state = new BitState(1);

let currentItemElementsLength = 0;
let windowWidth = 0;
let windowHeight = 0;
let visibleElementsQuantity = 0;
let currentStartIndex = -1;
let currentFirstVisibleIndex = -1;
let itemElements: Array<HTMLElement> = [];

let initialized: boolean = false;

export function initializeIconSelectorVirtualScroll(): void {
  if (initialized) return;

  const windowSize = querySize('window');
  windowWidth = windowSize.width;
  windowHeight = windowSize.height;
  visibleElementsQuantity = Math.ceil(windowHeight / itemHeight) + buffer * 2;

  bodyElement.addEventListener('scroll', function () {
    const firstVisibleIndex = getFirstVisibleIndex(bodyElement.scrollTop);
    const anchor = Math.max(0, firstVisibleIndex - (firstVisibleIndex % buffer));
    if (anchor !== currentStartIndex) {
      currentStartIndex = anchor;
      updateIconSelectorField(currentIntegration, previousInputElement, firstVisibleIndex, previosuSkeletonScreen, previousAnimation);
      contentElement.style.setProperty('--b-cssvar-icon-selector-content-translate-y', `${getElementTop(anchor)}px`);
    }
  });

  trayElement.style.setProperty('--b-cssvar-icon-selector-tray-height', `${getTrayHeight()}px`);
}

function getTrayHeight(): number {
  return state.length * itemHeight + state.sum(-1) * itemExtraHeight;
}

function getElementTop(index: number): number {
  return index * itemHeight + state.sum(index) * itemExtraHeight;
}

function getFirstVisibleIndex(scrollTop: number): number {
  let low = 0;
  let high = state.length * 1;
  while (low < high) {
    const mid = (low + high + 1) >> 1;
    if (getElementTop(mid) <= scrollTop) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }
  return low;
}

function generateElementOfItem(): HTMLElement {
  const element = documentCreateDivElement();
  element.classList.add('css_icon_selector_item');
  element.setAttribute('animation', 'false');
  element.setAttribute('skeleton-screen', 'false');
  element.setAttribute('stretched', 'false');
  element.setAttribute('index', '0');

  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_icon_selector_item_icon');
  iconElement.appendChild(getBlankIconElement());

  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_icon_selector_item_name');

  const stretchElement = documentCreateDivElement();
  stretchElement.classList.add('css_icon_selector_item_stretch');
  stretchElement.appendChild(getIconElement('keyboard_arrow_down'));
  stretchElement.addEventListener('click', function () {
    stretchSymbolItem(element);
  });

  const bodyElement = documentCreateDivElement();
  bodyElement.classList.add('css_icon_selector_list_item_body');

  element.appendChild(iconElement);
  element.appendChild(nameElement);
  element.appendChild(stretchElement);
  element.appendChild(bodyElement);

  return element;
}

function updateIconSelectorField(integration: IntegratedMaterialSymbols, inputElement: HTMLInputElement, firstVisibleIndex: number, skeletonScreen: boolean, animation: boolean): void {
  function updateItem(thisElement: HTMLElement, thisItem: IntegratedMaterialSymbolsItem, thisIndex: number, stretched: boolean, previousItem: IntegratedMaterialSymbolsItem | null): void {
    function updateIcon(thisElement: HTMLElement, thisItem: IntegratedMaterialSymbolsItem): void {
      setIcon(thisElement, thisItem.name);
    }

    function updateName(thisElement: HTMLElement, thisItem: IntegratedMaterialSymbolsItem): void {
      const nameElement = elementQuerySelector(thisElement, '.css_icon_selector_item_name');
      nameElement.innerText = thisItem.name;
    }

    function updateOnclick(thisElement: HTMLElement, thisItem: IntegratedMaterialSymbolsItem, inputElement: HTMLInputElement): void {
      // thisElement.onclick = function () {
      //   selectIcon(thisItem.name, inputElement);
      // };
    }

    function updateIndex(thisElement: HTMLElement, index: number): void {
      thisElement.setAttribute('index', index.toString());
    }

    function updateStretched(thisElement: HTMLElement, stretched: boolean): void {
      thisElement.setAttribute('index', booleanToString(stretched));
    }

    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      thisElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }

    function updateAnimation(thisElement: HTMLElement, animation: boolean): void {
      thisElement.setAttribute('animation', booleanToString(animation));
    }

    if (previousItem === null || previousItem === undefined) {
      updateIcon(thisElement, thisItem);
      updateName(thisElement, thisItem);
      updateOnclick(thisElement, thisItem, inputElement);
      updateIndex(thisElement, thisIndex);
      updateStretched(thisElement, stretched);
      updateSkeletonScreen(thisElement, skeletonScreen);
      updateAnimation(thisElement, animation);
    } else {
      if (previousItem.name !== thisItem.name) {
        updateIcon(thisElement, thisItem);
        updateName(thisElement, thisItem);
        updateOnclick(thisElement, thisItem, inputElement);
        updateIndex(thisElement, thisIndex);
        updateStretched(thisElement, stretched);
      } else if (previousInputElement !== inputElement) {
        updateOnclick(thisElement, thisItem, inputElement);
      }

      if (previosuSkeletonScreen !== skeletonScreen) {
        updateSkeletonScreen(thisElement, skeletonScreen);
      }

      if (previousAnimation !== animation) {
        updateAnimation(thisElement, animation);
      }
    }
  }

  const itemsLength = integration.length;
  state.resize(itemsLength);

  if (visibleElementsQuantity !== currentItemElementsLength) {
    itemElements = Array.from(elementQuerySelectorAll(contentElement, '.css_icon_selector_item'));
    currentItemElementsLength = itemElements.length;
    const difference = currentItemElementsLength - visibleElementsQuantity;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newItemElement = generateElementOfItem();
        fragment.appendChild(newItemElement);
        itemElements.push(newItemElement);
      }
      contentElement.append(fragment);
    } else if (difference > 0) {
      for (let p = currentItemElementsLength - 1, q = currentItemElementsLength - difference - 1; p > q; p--) {
        itemElements[p].remove();
        itemElements.splice(p, 1);
      }
    }
  }

  contentElement.setAttribute('binding', 'true');

  for (let k = 0; k < visibleElementsQuantity; k++) {
    const thisElement = itemElements[k];
    const index = firstVisibleIndex + k;
    const currentItem = integration[index];
    if (currentFirstVisibleIndex + k !== index) {
      updateItem(thisElement, currentItem, index, state.state[index] === 1 ? true : false, integration[currentFirstVisibleIndex + k]);
    } else {
      updateItem(thisElement, currentItem, index, state.state[index] === 1 ? true : false, null);
    }
  }

  contentElement.setAttribute('binding', 'false');

  currentFirstVisibleIndex = firstVisibleIndex;
  previousInputElement = inputElement;
  previosuSkeletonScreen = skeletonScreen;
  previousAnimation = animation;
}

function setupIconSelectorFieldSkeleton(inputElement: HTMLInputElement): void {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const items: IntegratedMaterialSymbols = [];
  for (let i = 0; i < visibleElementsQuantity; i++) {
    items.push({
      name: '',
      description: '',
      related: [],
      keywords: []
    });
  }
  updateIconSelectorField(items, inputElement, 0, true, playing_animation);
}

async function initializeIconSelectorField(inputElement: HTMLInputElement) {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const requestID = generateIdentifier();

  initializeIconSelectorVirtualScroll();

  setupIconSelectorFieldSkeleton(inputElement);

  const integration = await integrateMaterialSymbols(requestID);
  currentIntegration = integration;
  updateIconSelectorField(integration, inputElement, 0, false, playing_animation);
}

function selectIcon(symbol: string, inputElement: HTMLInputElement): void {
  inputElement.value = symbol;
  closeIconSelector();
}

export function showIconSelector(): void {
  iconSelectorField.setAttribute('displayed', 'true');
}

export function hideIconSelector(): void {
  iconSelectorField.setAttribute('displayed', 'false');
}

export function openIconSelector(inputElement: HTMLInputElement): void {
  pushPageHistory('IconSelector');
  showIconSelector();
  initializeIconSelectorField(inputElement);
  hidePreviousPage();
}

export function closeIconSelector(): void {
  hideIconSelector();
  showPreviousPage();
  revokePageHistory('IconSelector');
}

function stretchSymbolItem(thisElement: HTMLElement): void {
  const stretched = thisElement.getAttribute('stretched') === 'true' ? true : false;
  const animation = thisElement.getAttribute('animation') === 'true' ? true : false;

  if (stretched) {
    thisElement.setAttribute('stretched', 'false');
  } else {
    thisElement.setAttribute('stretched', 'true');
  }
}
