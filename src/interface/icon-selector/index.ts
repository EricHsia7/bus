import { getMaterialSymbolsSearchIndex } from '../../data/apis/getMaterialSymbolsSearchIndex/index';
import { deleteDataReceivingProgress } from '../../data/apis/loader';
import { prepareForMaterialSymbolsSearch, searchForMaterialSymbols } from '../../data/search/searchMaterialSymbols';
import { getSettingOptionValue } from '../../data/settings/index';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/elements';
import { booleanToString, generateIdentifier } from '../../tools/index';
import { containPhoneticSymbols } from '../../tools/text';
import { getBlankIconElement, setIcon } from '../icons/index';
import { MaterialSymbols } from '../icons/material-symbols-type';
import { pushPageHistory, querySize, revokePageHistory } from '../index';

const iconSelectorField = documentQuerySelector('.css_icon_selector_field');
const iconSelectorBodyElement = elementQuerySelector(iconSelectorField, '.css_icon_selector_body');
const symbolsElement = elementQuerySelector(iconSelectorBodyElement, '.css_icon_selector_material_symbols');

let currentSymbols: Array<MaterialSymbols> = [];

let previousSymbols: Array<MaterialSymbols> = [];
let previousAnimation: boolean = false;
let previosuSkeletonScreen: boolean = false;
let previousInputElement;

function generateElementOfSymbol(): HTMLElement {
  const element = documentCreateDivElement();
  element.classList.add('css_icon_selector_symbol');
  element.appendChild(getBlankIconElement());
  return element;
}

function updateIconSelectorField(symbols: Array<MaterialSymbols>, inputElement: HTMLInputElement, skeletonScreen: boolean, animation: boolean): void {
  function updateSymbol(thisSymbolElement: HTMLElement, thisSymbol: MaterialSymbols, previousSymbol: MaterialSymbols | null): void {
    function updateIcon(thisSymbolElement: HTMLElement, thisSymbol: MaterialSymbols): void {
      setIcon(thisSymbolElement, thisSymbol);
    }

    function updateOnclick(thisSymbolElement: HTMLElement, thisSymbol: MaterialSymbols, inputElement: HTMLInputElement): void {
      thisSymbolElement.onclick = function () {
        selectIcon(thisSymbol, inputElement);
      };
    }

    function updateSkeletonScreen(thisSymbolElement: HTMLElement, skeletonScreen: boolean): void {
      thisSymbolElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }

    function updateAnimation(thisSymbolElement: HTMLElement, animation: boolean): void {
      thisSymbolElement.setAttribute('animation', booleanToString(animation));
    }

    if (previousSymbol === null || previousSymbol === undefined) {
      updateIcon(thisSymbolElement, thisSymbol);
      updateOnclick(thisSymbolElement, thisSymbol, inputElement);
      updateSkeletonScreen(thisSymbolElement, skeletonScreen);
      updateAnimation(thisSymbolElement, animation);
    } else {
      if (previousSymbol !== thisSymbol) {
        updateIcon(thisSymbolElement, thisSymbol);
        updateOnclick(thisSymbolElement, thisSymbol, inputElement);
      } else if (previousInputElement !== inputElement) {
        updateOnclick(thisSymbolElement, thisSymbol, inputElement);
      }

      if (previosuSkeletonScreen !== skeletonScreen) {
        updateSkeletonScreen(thisSymbolElement, skeletonScreen);
      }

      if (previousAnimation !== animation) {
        updateAnimation(thisSymbolElement, animation);
      }
    }
  }

  const symbolsLength = symbols.length;
  const symbolElements = Array.from(elementQuerySelectorAll(symbolsElement, '.css_icon_selector_symbol'));
  const currentSymbolElementsLength = symbolElements.length;
  if (symbolsLength !== currentSymbolElementsLength) {
    const difference = currentSymbolElementsLength - symbolsLength;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newSymbolElement = generateElementOfSymbol();
        fragment.appendChild(newSymbolElement);
        symbolElements.push(newSymbolElement);
      }
      symbolsElement.append(fragment);
    } else if (difference > 0) {
      for (let p = currentSymbolElementsLength - 1, q = currentSymbolElementsLength - difference - 1; p > q; p--) {
        symbolElements[p].remove();
        symbolElements.splice(p, 1);
      }
    }
  }

  for (let i = 0; i < symbolsLength; i++) {
    const previousSymbol = previousSymbols[i];
    const currentSymbol = symbols[i];
    const thisSymbolElement = symbolElements[i];
    if (previousSymbol) {
      updateSymbol(thisSymbolElement, currentSymbol, previousSymbol);
    } else {
      updateSymbol(thisSymbolElement, currentSymbol, null);
    }
    // previousSymbols[i] = symbols[i];
  }

  previousSymbols = symbols.slice();
  previousInputElement = inputElement;
  previosuSkeletonScreen = skeletonScreen;
  previousAnimation = animation;
}

function setupIconSelectorFieldSkeleton(inputElement: HTMLInputElement) {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const WindowSize = querySize('window');
  const quantity = Math.floor(WindowSize.width / 50) * (Math.floor(WindowSize.height / 50) + 3);
  const symbols = [];
  for (let i = 0; i < quantity; i++) {
    symbols.push('');
  }
  updateIconSelectorField(symbols, inputElement, true, playing_animation);
}

async function initializeIconSelectorField(inputElement: HTMLInputElement) {
  setupIconSelectorFieldSkeleton(inputElement);
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const requestID = generateIdentifier();
  const materialSymbols = await getMaterialSymbolsSearchIndex(requestID);
  currentSymbols = [];
  for (const symbol in materialSymbols.symbols) {
    currentSymbols.push(symbol);
  }
  updateIconSelectorField(currentSymbols, inputElement, false, playing_animation);
  prepareForMaterialSymbolsSearch(materialSymbols);
  deleteDataReceivingProgress(requestID);
}

export function updateMaterialSymbolsSearchResult(query: string): void {
  if (!containPhoneticSymbols(query)) {
    const searchResults = searchForMaterialSymbols(query); // TODO: return name index
    for (let i = searchResults.length - 1; i >= 0; i--) {
      const item = searchResults[i].item;
      const currentIndex = currentSymbols.indexOf(item);
      console.log(0, item, currentIndex);
      if (!currentSymbols[i] || currentIndex < 0) continue;
      [currentSymbols[i], currentSymbols[currentIndex]] = [currentSymbols[currentIndex], currentSymbols[i]];
    }
    updateIconSelectorField(currentSymbols, previousInputElement, false, previousAnimation);
    console.log(1, previousSymbols);
    console.log(2, currentSymbols);
  }
}

function selectIcon(symbol: string, inputElement: HTMLInputElement): void {
  inputElement.value = symbol;
  closeIconSelector();
}

export function openIconSelector(inputElement: HTMLInputElement): void {
  pushPageHistory('IconSelector');
  iconSelectorField.setAttribute('displayed', 'true');
  initializeIconSelectorField(inputElement);
}

export function closeIconSelector(): void {
  revokePageHistory('IconSelector');
  iconSelectorField.setAttribute('displayed', 'false');
}
