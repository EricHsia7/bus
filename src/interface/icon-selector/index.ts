import { getSettingOptionValue } from '../../data/settings/index';
import { IntegratedMaterialSymbols, IntegratedMaterialSymbolsItem, integrateMaterialSymbols } from '../../data/symbols';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/elements';
import { booleanToString, generateIdentifier } from '../../tools/index';
import { getBlankIconElement, getIconElement, setIcon } from '../icons/index';
import { hidePreviousPage, pushPageHistory, querySize, revokePageHistory, showPreviousPage } from '../index';

const iconSelectorField = documentQuerySelector('.css_icon_selector_field');
const bodyElement = elementQuerySelector(iconSelectorField, '.css_icon_selector_body');
const trayElement = elementQuerySelector(bodyElement, '.css_icon_selector_tray');
const contentElement = elementQuerySelector(trayElement, '.css_icon_selector_content');

let previousIntegration: IntegratedMaterialSymbols = [];
let previousAnimation: boolean = false;
let previosuSkeletonScreen: boolean = false;
let previousInputElement;

let windowWidth = 0;
let windowHeight = 0;
let visibleElementsQuantity = 0;

function generateElementOfItem(): HTMLElement {
  const element = documentCreateDivElement();
  element.classList.add('css_icon_selector_list_item');
  element.setAttribute('animation', 'false');
  element.setAttribute('skeleton-screen', 'false');
  element.setAttribute('stretched', 'false');
  element.setAttribute('stretching', 'false');

  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_icon_selector_item_icon');
  iconElement.appendChild(getBlankIconElement());

  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_icon_selector_list_item_name');

  const stretchElement = documentCreateDivElement();
  stretchElement.classList.add('css_icon_selector_list_item_stretch');
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

function updateIconSelectorField(integration: IntegratedMaterialSymbols, inputElement: HTMLInputElement, skeletonScreen: boolean, animation: boolean): void {
  function updateItem(thisElement: HTMLElement, thisItem: IntegratedMaterialSymbolsItem, previousSymbol: IntegratedMaterialSymbolsItem | null): void {
    function updateIcon(thisElement: HTMLElement, thisItem: IntegratedMaterialSymbolsItem): void {
      setIcon(thisElement, thisItem.name);
    }

    function updateName(thisElement: HTMLElement, thisItem: IntegratedMaterialSymbolsItem): void {
      const nameElement = elementQuerySelector(thisElement, '.css_icon_selector_list_item_name');
      nameElement.innerText = thisItem.name;
    }

    function updateOnclick(thisElement: HTMLElement, thisItem: IntegratedMaterialSymbolsItem, inputElement: HTMLInputElement): void {
      // thisElement.onclick = function () {
      //   selectIcon(thisItem.name, inputElement);
      // };
    }

    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      thisElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }

    function updateAnimation(thisElement: HTMLElement, animation: boolean): void {
      thisElement.setAttribute('animation', booleanToString(animation));
    }

    if (previousSymbol === null || previousSymbol === undefined) {
      updateIcon(thisElement, thisItem);
      updateName(thisElement, thisItem);
      updateOnclick(thisElement, thisItem, inputElement);
      updateSkeletonScreen(thisElement, skeletonScreen);
      updateAnimation(thisElement, animation);
    } else {
      if (previousSymbol.name !== thisItem.name) {
        updateIcon(thisElement, thisItem);
        updateName(thisElement, thisItem);
        updateOnclick(thisElement, thisItem, inputElement);
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

  const windowSize = querySize('window');
  windowWidth = windowSize.width;
  windowHeight = windowSize.height;

  const itemsLength = integration.length;
  const itemElements = Array.from(elementQuerySelectorAll(contentElement, '.css_icon_selector_item'));
  const currentItemElementsLength = itemElements.length;
  if (itemsLength !== currentItemElementsLength) {
    const difference = currentItemElementsLength - itemsLength;
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

  for (let i = 0; i < itemsLength; i++) {
    const previousItem = previousIntegration[i];
    const currentItem = integration[i];
    const thisElement = itemElements[i];
    if (previousItem) {
      updateItem(thisElement, currentItem, previousItem);
    } else {
      updateItem(thisElement, currentItem, null);
    }
  }

  previousIntegration = integration.slice();
  previousInputElement = inputElement;
  previosuSkeletonScreen = skeletonScreen;
  previousAnimation = animation;
}

function setupIconSelectorFieldSkeleton(inputElement: HTMLInputElement): void {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const WindowSize = querySize('window');
  const quantity = Math.floor(WindowSize.height / 50) + 3;
  const items: IntegratedMaterialSymbols = [];
  for (let i = 0; i < quantity; i++) {
    items.push({
      name: '',
      description: '',
      related: [],
      keywords: []
    });
  }
  updateIconSelectorField(items, inputElement, true, playing_animation);
}

async function initializeIconSelectorField(inputElement: HTMLInputElement) {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const requestID = generateIdentifier();
  setupIconSelectorFieldSkeleton(inputElement);

  const inetgration = await integrateMaterialSymbols(requestID);
  updateIconSelectorField(inetgration, inputElement, false, playing_animation);
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
