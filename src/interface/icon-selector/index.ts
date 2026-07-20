import { getSettingOptionValue } from '../../data/settings/index';
import { IntegratedMaterialSymbols, IntegratedMaterialSymbolsItem, integrateMaterialSymbols } from '../../data/symbols';
import { BitState } from '../../tools/bit-state';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector, elementQuerySelectorAll, getElementsBelow } from '../../tools/elements';
import { booleanToString } from '../../tools/index';
import { getCSSVariableValue } from '../../tools/style';
import { openIconSelectorSearch } from '../icon-selector-search';
import { getBlankIconElement, getIconElement, setIcon } from '../icons/index';
import { hidePreviousPage, pushPageHistory, querySize, revokePageHistory, showPreviousPage } from '../index';

const Field = documentQuerySelector('.css_icon_selector_field');

const BodyElement = elementQuerySelector(Field, '.css_icon_selector_body');
const TrayElement = elementQuerySelector(BodyElement, '.css_icon_selector_tray');
const ContentElement = elementQuerySelector(TrayElement, '.css_icon_selector_content');

const HeadElement = elementQuerySelector(Field, '.css_icon_selector_head');
const HeadButtonRightElement = elementQuerySelector(HeadElement, '.css_icon_selector_button_right');

/**
 * div.css_icon_selector_item(n) in div.css_icon_selector_content(1)
 */
const itemElements: Array<HTMLElement> = [];

let currentIntegration: IntegratedMaterialSymbols = [];
let currentItemsLength: number = 0;
let previousAnimation: boolean = false;
let previosuSkeletonScreen: boolean = false;
let previousInputElement: HTMLInputElement;

const buffer = 16;
const itemHeight = 50;
const itemExtraHeight = 141;

const stretchState = new BitState(1);
const tabState = new BitState(1);

// let windowWidth = 0;
let windowHeight: number = 0;
let visibleElementsQuantity: number = 0;
let currentStartIndex: number = -1;
let offsetY: number = 0;
let initialized: boolean = false;

export function initializeIconSelectorVirtualScroll(): void {
  if (initialized) return;
  initialized = true;

  const windowSize = querySize('window');
  // windowWidth = windowSize.width;
  windowHeight = windowSize.height;
  visibleElementsQuantity = Math.ceil(windowHeight / itemHeight) + buffer * 2;
  offsetY = parseInt(getCSSVariableValue('--b-cssvar-safe-area-top')) + 55;

  BodyElement.addEventListener('scroll', function () {
    const firstVisibleIndex = getFirstVisibleIndex(BodyElement.scrollTop);
    const anchor = Math.max(0, firstVisibleIndex - (firstVisibleIndex % buffer));
    if (anchor !== currentStartIndex) {
      currentStartIndex = anchor;
      updateIconSelectorField(currentIntegration, previousInputElement, currentStartIndex, previosuSkeletonScreen, previousAnimation);
      ContentElement.style.setProperty('--b-cssvar-icon-selector-content-translate-y', `${getElementTop(anchor)}px`);
    }
  });

  ContentElement.style.setProperty('--b-cssvar-icon-selector-content-translate-y', `${offsetY}px`);
  TrayElement.style.setProperty('--b-cssvar-icon-selector-tray-height', `${getTrayHeight()}px`);
}

function getTrayHeight(): number {
  return offsetY + stretchState.length * itemHeight + stretchState.sum(stretchState.length) * itemExtraHeight;
}

function getElementTop(index: number): number {
  return offsetY + index * itemHeight + stretchState.sum(index) * itemExtraHeight;
}

function getFirstVisibleIndex(scrollTop: number): number {
  let low = 0;
  let high = stretchState.length * 1;
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

  // head
  const headElement = documentCreateDivElement();
  headElement.classList.add('css_icon_selector_item_head');

  // icon
  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_icon_selector_item_icon');
  iconElement.appendChild(getBlankIconElement());
  headElement.appendChild(iconElement);

  // name
  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_icon_selector_item_name');
  headElement.appendChild(nameElement);

  // capsule
  const capsuleElement = documentCreateDivElement();
  capsuleElement.classList.add('css_icon_selector_item_capsule');

  const mainElement = documentCreateDivElement();
  mainElement.classList.add('css_icon_selector_item_capsule_main');
  mainElement.textContent = '使用圖標';
  capsuleElement.appendChild(mainElement);

  const stretchElement = documentCreateDivElement();
  stretchElement.classList.add('css_icon_selector_item_capsule_stretch');
  stretchElement.appendChild(getIconElement('keyboard_arrow_down'));
  stretchElement.addEventListener('click', function () {
    stretchItemElement(element);
  });
  capsuleElement.appendChild(stretchElement);

  const separatorElement = documentCreateDivElement();
  separatorElement.classList.add('css_icon_selector_item_capsule_separator');
  capsuleElement.appendChild(separatorElement);

  headElement.appendChild(capsuleElement);

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
  tabDescriptionElement.addEventListener('click', function () {
    switchItemBodyElementTab(element, 0);
  });

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
  tabRelatedElement.addEventListener('click', function () {
    switchItemBodyElementTab(element, 1);
  });

  const tabRelatedIconElement = documentCreateDivElement();
  tabRelatedIconElement.classList.add('css_icon_selector_item_button_icon');
  tabRelatedIconElement.appendChild(getIconElement('category'));
  tabRelatedElement.appendChild(tabRelatedIconElement);
  tabRelatedElement.appendChild(document.createTextNode('相關'));
  buttonsElement.appendChild(tabRelatedElement);

  // Tab: Keywords
  const tabKeywordsElement = documentCreateDivElement();
  tabKeywordsElement.classList.add('css_icon_selector_item_button');
  tabKeywordsElement.setAttribute('highlighted', 'false');
  tabKeywordsElement.setAttribute('type', 'tab');
  tabKeywordsElement.addEventListener('click', function () {
    switchItemBodyElementTab(element, 2);
  });

  const tabKeywordsIconElement = documentCreateDivElement();
  tabKeywordsIconElement.classList.add('css_icon_selector_item_button_icon');
  tabKeywordsIconElement.appendChild(getIconElement('tag'));
  tabKeywordsElement.appendChild(tabKeywordsIconElement);
  tabKeywordsElement.appendChild(document.createTextNode('標籤'));
  buttonsElement.appendChild(tabKeywordsElement);

  bodyElement.appendChild(buttonsElement);

  // description
  const descriptionElement = documentCreateDivElement();
  descriptionElement.classList.add('css_icon_selector_item_description');
  descriptionElement.setAttribute('displayed', 'true');
  bodyElement.appendChild(descriptionElement);

  // related
  const relatedElement = documentCreateDivElement();
  relatedElement.classList.add('css_icon_selector_item_related');
  relatedElement.setAttribute('displayed', 'false');
  bodyElement.appendChild(relatedElement);

  // keywords
  const keywordsElement = documentCreateDivElement();
  keywordsElement.classList.add('css_icon_selector_item_keywords');
  keywordsElement.setAttribute('displayed', 'false');
  bodyElement.appendChild(keywordsElement);

  element.appendChild(headElement);
  element.appendChild(bodyElement);
  return element;
}

function generateElementOfRelatedItem(): HTMLElement {
  const element = documentCreateDivElement();
  element.classList.add('css_icon_selector_item_related_item');

  const headElement = documentCreateDivElement();
  headElement.classList.add('css_icon_selector_item_related_item_head');

  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_icon_selector_item_related_item_head_icon');
  iconElement.appendChild(getBlankIconElement());
  headElement.appendChild(iconElement);

  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_icon_selector_item_related_item_head_name');
  headElement.appendChild(nameElement);

  const actionsElement = documentCreateDivElement();
  actionsElement.classList.add('css_icon_selector_item_related_item_actions');

  const selectIconButtonElement = documentCreateDivElement();
  selectIconButtonElement.classList.add('css_icon_selector_item_related_item_action_button');
  selectIconButtonElement.textContent = '使用圖標';
  actionsElement.appendChild(selectIconButtonElement);

  const searchButtonElement = documentCreateDivElement();
  searchButtonElement.classList.add('css_icon_selector_item_related_item_action_button');
  searchButtonElement.textContent = '搜尋';
  actionsElement.appendChild(searchButtonElement);

  element.appendChild(headElement);
  element.appendChild(actionsElement);

  return element;
}

function generateElementOfKeywordItem(): HTMLElement {
  const element = documentCreateDivElement();
  element.classList.add('css_icon_selector_item_keywords_item');

  const headElement = documentCreateDivElement();
  headElement.classList.add('css_icon_selector_item_keywords_item_head');

  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_icon_selector_item_keywords_item_head_icon');
  iconElement.appendChild(getIconElement('tag'));
  headElement.appendChild(iconElement);

  const keywordElement = documentCreateDivElement();
  keywordElement.classList.add('css_icon_selector_item_keywords_item_head_keyword');
  headElement.appendChild(keywordElement);

  const actionsElement = documentCreateDivElement();
  actionsElement.classList.add('css_icon_selector_item_keywords_item_actions');

  const searchButtonElement = documentCreateDivElement();
  searchButtonElement.classList.add('css_icon_selector_item_keywords_item_action_button');
  searchButtonElement.textContent = '搜尋';
  actionsElement.appendChild(searchButtonElement);

  element.appendChild(headElement);
  element.appendChild(actionsElement);

  return element;
}

function updateIconSelectorField(integration: IntegratedMaterialSymbols, inputElement: HTMLInputElement, startIndex: number, skeletonScreen: boolean, animation: boolean): void {
  function updateItem(thisElement: HTMLElement, thisItem: IntegratedMaterialSymbolsItem, thisIndex: number, thisStretched: boolean, thisTabCode: number): void {
    function updateIcon(thisElement: HTMLElement, thisItem: IntegratedMaterialSymbolsItem): void {
      const headElement = elementQuerySelector(thisElement, '.css_icon_selector_item_head');
      const iconElement = elementQuerySelector(headElement, '.css_icon_selector_item_icon');
      setIcon(iconElement, thisItem.name);
    }

    function updateName(thisElement: HTMLElement, thisItem: IntegratedMaterialSymbolsItem): void {
      const headElement = elementQuerySelector(thisElement, '.css_icon_selector_item_head');
      const nameElement = elementQuerySelector(headElement, '.css_icon_selector_item_name');
      nameElement.textContent = thisItem.name;
    }

    function updateDescription(thisElement: HTMLElement, thisItem: IntegratedMaterialSymbolsItem): void {
      const bodyElement = elementQuerySelector(thisElement, '.css_icon_selector_item_body');
      const descriptionElement = elementQuerySelector(bodyElement, '.css_icon_selector_item_description');
      if (thisItem.description === false) {
        descriptionElement.setAttribute('empty', 'true');
        descriptionElement.textContent = '';
      } else {
        descriptionElement.setAttribute('empty', 'false');
        descriptionElement.textContent = thisItem.description;
      }
    }

    function updateRelated(thisElement: HTMLElement, thisItem: IntegratedMaterialSymbolsItem): void {
      const bodyElement = elementQuerySelector(thisElement, '.css_icon_selector_item_body');
      const relatedElement = elementQuerySelector(bodyElement, '.css_icon_selector_item_related');
      const length = thisItem.related.length;
      const relatedItemElements = Array.from(elementQuerySelectorAll(relatedElement, '.css_icon_selector_item_related_item'));
      const currentElementsLength = relatedItemElements.length;

      const difference = currentElementsLength - length;
      if (difference < 0) {
        const fragment = new DocumentFragment();
        for (let o = 0; o > difference; o--) {
          const newElement = generateElementOfRelatedItem();
          fragment.appendChild(newElement);
          relatedItemElements.push(newElement);
        }
        relatedElement.append(fragment);
      } else if (difference > 0) {
        for (let p = currentElementsLength - 1, q = currentElementsLength - difference - 1; p > q; p--) {
          relatedItemElements[p].remove();
          relatedItemElements.splice(p, 1);
        }
      }

      for (let i = 0; i < length; i++) {
        const thisName = thisItem.related[i];
        const relatedItemElement = relatedItemElements[i];
        const headElement = elementQuerySelector(relatedItemElement, '.css_icon_selector_item_related_item_head');
        const iconElement = elementQuerySelector(headElement, '.css_icon_selector_item_related_item_head_icon');
        const nameElement = elementQuerySelector(headElement, '.css_icon_selector_item_related_item_head_name');
        const actionsElement = elementQuerySelector(relatedItemElement, '.css_icon_selector_item_related_item_actions');
        const [selectIconButtonElement, searchButtonElement] = elementQuerySelectorAll(actionsElement, '.css_icon_selector_item_related_item_action_button');
        setIcon(iconElement, thisName);
        nameElement.textContent = thisName;
        selectIconButtonElement.onclick = function () {
          selectIcon(thisName, inputElement);
        };
        searchButtonElement.onclick = function () {
          openIconSelectorSearch(thisName, inputElement);
        };
      }

      relatedElement.setAttribute('empty', booleanToString(length === 0));
    }

    function updateKeywords(thisElement: HTMLElement, inputElement: HTMLInputElement, thisItem: IntegratedMaterialSymbolsItem): void {
      const bodyElement = elementQuerySelector(thisElement, '.css_icon_selector_item_body');
      const keywordsElement = elementQuerySelector(bodyElement, '.css_icon_selector_item_keywords');

      const length = thisItem.keywords.length;
      const keywordItemElements = Array.from(elementQuerySelectorAll(keywordsElement, '.css_icon_selector_item_keywords_item'));
      const currentElementsLength = keywordItemElements.length;

      const difference = currentElementsLength - length;
      if (difference < 0) {
        const fragment = new DocumentFragment();
        for (let o = 0; o > difference; o--) {
          const newElement = generateElementOfKeywordItem();
          fragment.appendChild(newElement);
          keywordItemElements.push(newElement);
        }
        keywordsElement.append(fragment);
      } else if (difference > 0) {
        for (let p = currentElementsLength - 1, q = currentElementsLength - difference - 1; p > q; p--) {
          keywordItemElements[p].remove();
          keywordItemElements.splice(p, 1);
        }
      }

      for (let i = 0; i < length; i++) {
        const thisKeyword = thisItem.keywords[i];
        const keywordItemElement = keywordItemElements[i];
        const headElement = elementQuerySelector(keywordItemElement, '.css_icon_selector_item_keywords_item_head');
        const keywordElement = elementQuerySelector(headElement, '.css_icon_selector_item_keywords_item_head_keyword');
        const actionsElement = elementQuerySelector(keywordItemElement, '.css_icon_selector_item_keywords_item_actions');
        const searchButtonElement = elementQuerySelector(actionsElement, '.css_icon_selector_item_keywords_item_action_button');
        keywordElement.textContent = thisKeyword;
        searchButtonElement.onclick = function () {
          openIconSelectorSearch(thisKeyword, inputElement);
        };
      }

      keywordsElement.setAttribute('empty', booleanToString(length === 0));
    }

    function updateCapsuleMainOnclick(thisElement: HTMLElement, inputElement: HTMLInputElement, thisItem: IntegratedMaterialSymbolsItem): void {
      const headElement = elementQuerySelector(thisElement, '.css_icon_selector_item_head');
      const capsuleElement = elementQuerySelector(headElement, '.css_icon_selector_item_capsule');
      const capsuleMainElement = elementQuerySelector(capsuleElement, '.css_icon_selector_item_capsule_main');
      capsuleMainElement.onclick = function () {
        selectIcon(thisItem.name, inputElement);
      };
    }

    function updateIndex(thisElement: HTMLElement, thisIndex: number): void {
      thisElement.setAttribute('index', thisIndex.toString());
    }

    function updateStretched(thisElement: HTMLElement, thisStretched: boolean): void {
      const bodyElement = elementQuerySelector(thisElement, '.css_icon_selector_item_body');
      thisElement.setAttribute('stretched', booleanToString(thisStretched));
      bodyElement.setAttribute('displayed', booleanToString(thisStretched));
    }

    function updateTab(thisElement: HTMLElement, thisIndex: number, thisTabCode: number): void {
      const buttonsElement = elementQuerySelector(thisElement, '.css_icon_selector_item_buttons');
      const buttonElements = elementQuerySelectorAll(buttonsElement, '.css_icon_selector_item_button');
      const tabElements = [elementQuerySelector(thisElement, '.css_icon_selector_item_description'), elementQuerySelector(thisElement, '.css_icon_selector_item_related'), elementQuerySelector(thisElement, '.css_icon_selector_item_keywords')];
      const state = new Array(3).fill('false');
      state[thisTabCode] = 'true';
      for (let i = 0; i < 3; i++) {
        buttonElements[i].setAttribute('highlighted', state[i]);
        tabElements[i].setAttribute('displayed', state[i]);
      }
      tabState.set(thisIndex, thisTabCode);
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
    updateRelated(thisElement, thisItem);
    updateKeywords(thisElement, inputElement, thisItem);
    updateCapsuleMainOnclick(thisElement, inputElement, thisItem);
    updateIndex(thisElement, thisIndex);
    updateStretched(thisElement, thisStretched);
    updateTab(thisElement, thisIndex, thisTabCode);

    if (skeletonScreen !== previosuSkeletonScreen) {
      updateSkeletonScreen(thisElement, skeletonScreen);
    }

    if (animation !== previousAnimation) {
      updateAnimation(thisElement, animation);
    }
  }

  const itemsLength = integration.length;
  if (currentItemsLength !== itemsLength) {
    stretchState.resize(itemsLength);
    tabState.resize(itemsLength);
    TrayElement.style.setProperty('--b-cssvar-icon-selector-tray-height', `${getTrayHeight()}px`);
  }

  if (previousInputElement !== inputElement) {
    HeadButtonRightElement.onclick = function () {
      openIconSelectorSearch('', inputElement);
    };
  }

  const itemElementsLength = itemElements.length;
  if (visibleElementsQuantity !== itemElementsLength) {
    const difference = itemElementsLength - visibleElementsQuantity;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newItemElement = generateElementOfItem();
        fragment.appendChild(newItemElement);
        itemElements.push(newItemElement);
      }
      ContentElement.append(fragment);
    } else if (difference > 0) {
      for (let p = itemElementsLength - 1, q = itemElementsLength - difference - 1; p > q; p--) {
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
      updateItem(thisElement, currentItem, index, stretchState.state[index] === 1 ? true : false, tabState.state[index]);
    }
  }

  currentItemsLength = itemsLength;
  previousInputElement = inputElement;
  previosuSkeletonScreen = skeletonScreen;
  previousAnimation = animation;
}

function setupIconSelectorFieldSkeleton(inputElement: HTMLInputElement): void {
  const playing_animation = getSettingOptionValue('playing_animation');
  const items: IntegratedMaterialSymbols = new Array(visibleElementsQuantity).fill({
    name: '',
    description: '',
    related: [],
    keywords: []
  });
  // reuse the object (assume readonly)
  updateIconSelectorField(items, inputElement, 0, true, playing_animation);
}

async function initializeIconSelectorField(inputElement: HTMLInputElement) {
  const playing_animation = getSettingOptionValue('playing_animation');

  initializeIconSelectorVirtualScroll();

  setupIconSelectorFieldSkeleton(inputElement);

  BodyElement.scrollTop = 0;

  const integration = await integrateMaterialSymbols(function () {});
  currentIntegration = integration;
  updateIconSelectorField(integration, inputElement, 0, false, playing_animation);
}

function selectIcon(symbol: string, inputElement: HTMLInputElement): void {
  inputElement.value = symbol;
  closeIconSelector();
}

export function showIconSelector(): void {
  Field.setAttribute('displayed', 'true');
}

export function hideIconSelector(): void {
  Field.setAttribute('displayed', 'false');
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
    stretchState.set(index, 0);
  } else {
    itemBodyElement.setAttribute('displayed', 'true');
    itemElement.setAttribute('stretched', 'true');
    stretchState.set(index, 1);
  }

  TrayElement.style.setProperty('--b-cssvar-icon-selector-tray-height', `${getTrayHeight()}px`);
}

function switchItemBodyElementTab(itemElement: HTMLElement, tabCode: number): void {
  const buttonsElement = elementQuerySelector(itemElement, '.css_icon_selector_item_buttons');
  const buttonElements = elementQuerySelectorAll(buttonsElement, '.css_icon_selector_item_button');
  const tabElements = [elementQuerySelector(itemElement, '.css_icon_selector_item_description'), elementQuerySelector(itemElement, '.css_icon_selector_item_related'), elementQuerySelector(itemElement, '.css_icon_selector_item_keywords')];
  const state = new Array(3).fill('false');
  state[tabCode] = 'true';
  for (let i = 0; i < 3; i++) {
    buttonElements[i].setAttribute('highlighted', state[i]);
    tabElements[i].setAttribute('displayed', state[i]);
  }
  const index = parseInt(itemElement.getAttribute('index') || '0', 10);
  tabState.set(index, tabCode);
}
