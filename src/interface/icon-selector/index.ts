import { getSettingOptionValue } from '../../data/settings/index';
import { IntegratedMaterialSymbols, IntegratedMaterialSymbolsItem, integrateMaterialSymbols } from '../../data/symbols';
import { BitState } from '../../tools/bit-state';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector, elementQuerySelectorAll, getElementsBelow } from '../../tools/elements';
import { booleanToString, generateIdentifier } from '../../tools/index';
import { getBlankIconElement, getIconElement, setIcon } from '../icons/index';
import { hidePreviousPage, pushPageHistory, querySize, revokePageHistory, showPreviousPage } from '../index';

const iconSelectorField = documentQuerySelector('.css_icon_selector_field');
const bodyElement = elementQuerySelector(iconSelectorField, '.css_icon_selector_body');
const trayElement = elementQuerySelector(bodyElement, '.css_icon_selector_tray');
const contentElement = elementQuerySelector(trayElement, '.css_icon_selector_content');

let currentIntegration: IntegratedMaterialSymbols = [];
let currentItemsLength: number = 0;
let previousAnimation: boolean = false;
let previosuSkeletonScreen: boolean = false;
let previousInputElement;

const buffer = 16;
const itemHeight = 50;
const itemExtraHeight = 171;

const state = new BitState(1);

let currentItemElementsLength = 0;
let windowWidth = 0;
let windowHeight = 0;
let visibleElementsQuantity = 0;
let currentStartIndex = -1;
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
      updateIconSelectorField(currentIntegration, previousInputElement, currentStartIndex, previosuSkeletonScreen, previousAnimation);
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
  element.setAttribute('stretching', 'false');
  element.setAttribute('push-direction', '0'); // 0: normal state, 1: downward, 2: upward
  element.setAttribute('push-state', '0'); // 0: normal state, 1: compensation , 2: transition
  element.setAttribute('index', '0');

  const headElement = documentCreateDivElement();
  headElement.classList.add('css_icon_selector_item_head');

  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_icon_selector_item_icon');
  iconElement.appendChild(getBlankIconElement());

  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_icon_selector_item_name');

  const capsuleElement = documentCreateDivElement();
  capsuleElement.classList.add('css_icon_selector_item_capsule');

  const mainElement = documentCreateDivElement();
  mainElement.classList.add('css_icon_selector_item_capsule_main');
  mainElement.innerText = '使用圖示';
  capsuleElement.appendChild(mainElement);

  const stretchElement = documentCreateDivElement();
  stretchElement.classList.add('css_icon_selector_item_capsule_stretch');
  stretchElement.appendChild(getIconElement('keyboard_arrow_down'));
  stretchElement.addEventListener('click', function () {
    stretchItemElement(element);
  });
  capsuleElement.appendChild(stretchElement);

  const bodyElement = documentCreateDivElement();
  bodyElement.classList.add('css_icon_selector_item_body');
  bodyElement.setAttribute('displayed', 'false');

  const buttonsElement = documentCreateDivElement();
  buttonsElement.classList.add('css_icon_selector_item_buttons');

  // Tab: Description
  const tabDescriptionElement = documentCreateDivElement();
  tabDescriptionElement.classList.add('css_icon_selector_item_button');
  tabDescriptionElement.setAttribute('highlighted', 'true');
  tabDescriptionElement.setAttribute('type', 'tab');
  tabDescriptionElement.setAttribute('code', '0');
  tabDescriptionElement.onclick = () => {
    switchItemBodyElementTab(element, 0);
  };

  const tabDescriptionIconElement = documentCreateDivElement();
  tabDescriptionIconElement.classList.add('css_icon_selector_item_button_icon');
  tabDescriptionIconElement.appendChild(getIconElement('description'));
  tabDescriptionElement.appendChild(tabDescriptionIconElement);
  tabDescriptionElement.appendChild(document.createTextNode('描述'));
  buttonsElement.appendChild(tabDescriptionElement);

  // Tab: Related
  const tabRelatedElement = documentCreateDivElement();
  tabRelatedElement.classList.add('css_icon_selector_item_button');
  tabRelatedElement.setAttribute('highlighted', 'false');
  tabRelatedElement.setAttribute('type', 'tab');
  tabRelatedElement.setAttribute('code', '1');
  tabRelatedElement.onclick = () => {
    switchItemBodyElementTab(element, 0);
  };

  const tabRelatedIconElement = documentCreateDivElement();
  tabRelatedIconElement.classList.add('css_icon_selector_item_button_icon');
  tabRelatedIconElement.appendChild(getIconElement('join'));
  tabRelatedElement.appendChild(tabRelatedIconElement);
  tabRelatedElement.appendChild(document.createTextNode('相關'));
  buttonsElement.appendChild(tabRelatedElement);

  // Tab: Keywords
  const tabKeywordsElement = documentCreateDivElement();
  tabKeywordsElement.classList.add('css_icon_selector_item_button');
  tabKeywordsElement.setAttribute('highlighted', 'false');
  tabKeywordsElement.setAttribute('type', 'tab');
  tabKeywordsElement.setAttribute('code', '2');
  tabKeywordsElement.onclick = () => {
    switchItemBodyElementTab(element, 0);
  };

  const tabKeywordsIconElement = documentCreateDivElement();
  tabKeywordsIconElement.classList.add('css_icon_selector_item_button_icon');
  tabKeywordsIconElement.appendChild(getIconElement('tag'));
  tabKeywordsElement.appendChild(tabKeywordsIconElement);
  tabKeywordsElement.appendChild(document.createTextNode('標籤'));
  buttonsElement.appendChild(tabKeywordsElement);

  headElement.appendChild(iconElement);
  headElement.appendChild(nameElement);
  headElement.appendChild(capsuleElement);
  element.appendChild(headElement);

  bodyElement.appendChild(buttonsElement);
  element.appendChild(bodyElement);

  return element;
}

function updateIconSelectorField(integration: IntegratedMaterialSymbols, inputElement: HTMLInputElement, startIndex: number, skeletonScreen: boolean, animation: boolean): void {
  function updateItem(thisElement: HTMLElement, thisItem: IntegratedMaterialSymbolsItem, thisIndex: number, stretched: boolean): void {
    function updateIcon(thisElement: HTMLElement, thisItem: IntegratedMaterialSymbolsItem): void {
      const headElement = elementQuerySelector(thisElement, '.css_icon_selector_item_head');
      const iconElement = elementQuerySelector(headElement, '.css_icon_selector_item_icon');
      setIcon(iconElement, thisItem.name);
    }

    function updateName(thisElement: HTMLElement, thisItem: IntegratedMaterialSymbolsItem): void {
      const headElement = elementQuerySelector(thisElement, '.css_icon_selector_item_head');
      const nameElement = elementQuerySelector(headElement, '.css_icon_selector_item_name');
      nameElement.innerText = thisItem.name;
    }

    function updateDescription(thisElement: HTMLElement, thisItem: IntegratedMaterialSymbolsItem): void {
      const bodyElement = elementQuerySelector(thisElement, '.css_icon_selector_item_body');
      const descriptionElement = elementQuerySelector(bodyElement, '.css_icon_selector_item_description');
      if (thisItem.description === false) {
        descriptionElement.setAttribute('empty', 'true');
        descriptionElement.innerText = '';
      } else {
        descriptionElement.setAttribute('empty', 'false');
        descriptionElement.innerText = thisItem.description;
      }
    }

    function updateCapsuleMainOnclick(thisElement: HTMLElement, thisItem: IntegratedMaterialSymbolsItem, inputElement: HTMLInputElement): void {
      const headElement = elementQuerySelector(thisElement, '.css_icon_selector_item_head');
      const capsuleElement = elementQuerySelector(headElement, '.css_icon_selector_item_capsule');
      const capsuleMainElement = elementQuerySelector(capsuleElement, '.css_icon_selector_item_capsule_main');
      capsuleMainElement.onclick = function () {
        selectIcon(thisItem.name, inputElement);
      };
    }

    function updateIndex(thisElement: HTMLElement, index: number): void {
      thisElement.setAttribute('index', index.toString());
    }

    function updateStretched(thisElement: HTMLElement, stretched: boolean): void {
      thisElement.setAttribute('stretched', booleanToString(stretched));
    }

    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      thisElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }

    function updateAnimation(thisElement: HTMLElement, animation: boolean): void {
      thisElement.setAttribute('animation', booleanToString(animation));
    }

    updateIcon(thisElement, thisItem);
    updateName(thisElement, thisItem);
    updateDescription(thisElement, thisItem);
    updateCapsuleMainOnclick(thisElement, thisItem, inputElement);
    updateIndex(thisElement, thisIndex);
    updateStretched(thisElement, stretched);
    updateSkeletonScreen(thisElement, skeletonScreen);
    updateAnimation(thisElement, animation);
  }

  const itemsLength = integration.length;
  if (currentItemsLength !== itemsLength) {
    state.resize(itemsLength);
    trayElement.style.setProperty('--b-cssvar-icon-selector-tray-height', `${getTrayHeight()}px`);
  }

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

  for (let k = 0; k < visibleElementsQuantity; k++) {
    const thisElement = itemElements[k];
    const index = startIndex + k;
    const currentItem = integration[index];
    if (currentItem) {
      updateItem(thisElement, currentItem, index, state.state[index] === 1 ? true : false);
    }
  }

  currentItemsLength = itemsLength;
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

function stretchItemElement(itemElement: HTMLElement): void {
  const contentElement = itemElement.parentElement as HTMLElement;
  const itemBodyElement = elementQuerySelector(itemElement, '.css_icon_selector_item_body');

  const elementsBelow = getElementsBelow(itemElement, 'css_icon_selector_item');
  const elementsBelowLength = elementsBelow.length;

  const itemElementRect = itemElement.getBoundingClientRect();
  const contentElementRect = contentElement.getBoundingClientRect();
  const itemElementY = itemElementRect.top - contentElementRect.top; // itemElementRect.top + scrollTop - (contentElementRect.top + scrollTop)

  const stretched = itemElement.getAttribute('stretched') === 'true' ? true : false;
  const animation = itemElement.getAttribute('animation') === 'true' ? true : false;

  if (animation) {
    const pushDirection = stretched ? '2' : '1';

    // Separate the elements from the document flow while keeping its position
    itemElement.setAttribute('stretching', 'true');
    itemElement.style.setProperty('--b-cssvar-icon-selector-item-y', `${itemElementY}px`);

    // Set push direction and push state
    for (let i = 0; i < elementsBelowLength; i++) {
      const thisItemElement = elementsBelow[i];
      thisItemElement.setAttribute('push-direction', pushDirection);
      thisItemElement.setAttribute('push-state', '1');
    }

    itemBodyElement.addEventListener(
      'transitionend',
      function () {
        // Reset the push direction and push state
        for (let i = 0; i < elementsBelowLength; i++) {
          const thisItemElement = elementsBelow[i];
          thisItemElement.setAttribute('push-direction', '0');
          thisItemElement.setAttribute('push-state', '0');
        }
        // Deposit the element
        itemElement.setAttribute('stretching', 'false');
      },
      { once: true }
    );

    itemBodyElement.addEventListener(
      'transitionstart',
      function () {
        // Transition the elements below
        for (let i = 0; i < elementsBelowLength; i++) {
          const thisItemElement = elementsBelow[i];
          thisItemElement.setAttribute('push-state', '2');
        }
      },
      { once: true }
    );
  }

  const index = parseInt(itemElement.getAttribute('index') || '0', 10);

  if (stretched) {
    if (animation) {
      itemBodyElement.addEventListener(
        'transitionend',
        function () {
          itemBodyElement.setAttribute('displayed', 'false');
        },
        { once: true }
      );
    } else {
      itemBodyElement.setAttribute('displayed', 'false');
    }
    itemElement.setAttribute('stretched', 'false');
    state.set(index, 0);
  } else {
    itemBodyElement.setAttribute('displayed', 'true');
    itemElement.setAttribute('stretched', 'true');
    state.set(index, 1);
  }

  trayElement.style.setProperty('--b-cssvar-icon-selector-tray-height', `${getTrayHeight()}px`);
}

function switchItemBodyElementTab(itemElement: HTMLElement, tabCode: number): void {
  const buttons = elementQuerySelector(itemElement, '.css_icon_selector_item_buttons');
  const button = elementQuerySelectorAll(buttons, '.css_icon_selector_item_button[highlighted="true"][type="tab"]');
  for (const t of button) {
    t.setAttribute('highlighted', 'false');
  }
  elementQuerySelector(buttons, `.css_icon_selector_item_button[code="${tabCode}"]`).setAttribute('highlighted', 'true');
  switch (tabCode) {
    case 0:
      elementQuerySelector(itemElement, '.css_icon_selector_item_description').setAttribute('displayed', 'true');
      elementQuerySelector(itemElement, '.css_icon_selector_item_related').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_icon_selector_item_keywords').setAttribute('displayed', 'false');
      break;
    case 1:
      elementQuerySelector(itemElement, '.css_icon_selector_item_description').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_icon_selector_item_related').setAttribute('displayed', 'true');
      elementQuerySelector(itemElement, '.css_icon_selector_item_keywords').setAttribute('displayed', 'false');
      break;
    case 2:
      elementQuerySelector(itemElement, '.css_icon_selector_item_description').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_icon_selector_item_related').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_icon_selector_item_keywords').setAttribute('displayed', 'true');
      break;
    default:
      break;
  }
}
