import { documentQuerySelector } from '../../tools/elements';

let initialized: boolean = false;

const iconSelectorSearchField = documentQuerySelector('css_icon_selector_search_field');

export function showIconSelectorSearch(): void {
  iconSelectorSearchField.setAttribute('displayed', 'true');
}

export function hideIconSelectorSearch(): void {
  iconSelectorSearchField.setAttribute('displayed', 'false');
}

export function initializeIconSelectorSearchInput(): void {
  if (initialized) return;

  // searchInputElement.addEventListener('paste', function () {
  //   updateMaterialSymbolsSearchResult();
  // });
  // searchInputElement.addEventListener('cut', function () {
  //   updateMaterialSymbolsSearchResult();
  // });
  // searchInputElement.addEventListener('selectionchange', function () {
  //   updateMaterialSymbolsSearchResult();
  // });
  // document.addEventListener('selectionchange', function () {
  //   updateMaterialSymbolsSearchResult();
  // });
  // searchInputElement.addEventListener('keyup', function () {
  //   updateMaterialSymbolsSearchResult();
  // });
}

export function updateMaterialSymbolsSearchResult(): void {
  // const query = searchInputElement.value;
  // if (!containPhoneticSymbols(query)) {
  //   const searchResults = searchForMaterialSymbols(query); // TODO: return name index
  //   for (let i = searchResults.length - 1; i >= 0; i--) {
  //     const item = searchResults[i].item;
  //     const currentIndex = currentSymbols.indexOf(item);
  //     if (!currentSymbols[i] || currentIndex < 0) continue;
  //     [currentSymbols[i], currentSymbols[currentIndex]] = [currentSymbols[currentIndex], currentSymbols[i]];
  //   }
  //   updateIconSelectorField(currentSymbols, previousInputElement, false, previousAnimation);
  // }
}
