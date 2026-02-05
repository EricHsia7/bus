import { getStoresSizeStatistics, StoreSize, StoreSizeStatistics } from '../../data/analytics/storage-size';
import { getSettingOptionValue } from '../../data/settings/index';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/elements';
import { booleanToString } from '../../tools/index';
import { querySize } from '../index';

let previousCategories: Array<StoreSize> = [];
let previousAnimation: boolean = false;
let previousSkeletonScreen: boolean = false;

const StorageField = documentQuerySelector('.css_storage_field');
const StorageBodyElement = elementQuerySelector(StorageField, '.css_storage_body');
const StatisticsElement = elementQuerySelector(StorageBodyElement, '.css_storage_statistics');

function generateElementOfItem(): HTMLElement {
  // Create root element
  const statisticsItemElement = documentCreateDivElement();
  statisticsItemElement.classList.add('css_storage_statistics_item');

  // Create name element
  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_storage_statistics_item_name');

  // Create value element
  const valueElement = documentCreateDivElement();
  valueElement.classList.add('css_storage_statistics_item_value');

  // Append children
  statisticsItemElement.appendChild(nameElement);
  statisticsItemElement.appendChild(valueElement);

  return statisticsItemElement;
}

function updateStorageField(statistics: StoreSizeStatistics, skeletonScreen: boolean, animation: boolean): void {
  function updateItem(element: HTMLElement, currentItem: StoreSize, previousItem: StoreSize | null): void {
    function updateValue(element: HTMLElement, item: StoreSize): void {
      const typeElement = elementQuerySelector(element, '.css_storage_statistics_item_value');
      typeElement.innerText = item.size;
    }

    function updateName(element: HTMLElement, item: StoreSize): void {
      const nameElement = elementQuerySelector(element, '.css_storage_statistics_item_name');
      nameElement.innerText = item.category.name;
    }

    function updateAnimation(element: HTMLElement, animation: boolean): void {
      element.setAttribute('animation', booleanToString(animation));
    }

    function updateSkeletonScreen(element: HTMLElement, skeletonScreen: boolean): void {
      element.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }

    // compare the current item with the previous item
    if (previousItem) {
      if (currentItem.category.key !== previousItem.category.key) {
        updateName(element, currentItem);
        updateValue(element, currentItem);
      }

      if (currentItem.size !== previousItem.size) {
        updateValue(element, currentItem);
      }

      if (previousAnimation !== animation) {
        updateAnimation(element, animation);
      }

      if (previousSkeletonScreen !== skeletonScreen) {
        updateSkeletonScreen(element, skeletonScreen);
      }
    }
    // if the previous item is null, it means this is a new item
    else {
      updateValue(element, currentItem);
      updateName(element, currentItem);
      updateAnimation(element, animation);
      updateSkeletonScreen(element, skeletonScreen);
    }
  }

  const categories = [];
  for (const key in statistics.categorizedSizes) {
    const item = statistics.categorizedSizes[key];
    categories.push(item);
  }

  const categoriesQuantity = categories.length;
  const itemElements = Array.from(elementQuerySelectorAll(StatisticsElement, '.css_storage_statistics_item'));
  const currentItemElementsLength = itemElements.length;
  if (categoriesQuantity !== currentItemElementsLength) {
    const difference = currentItemElementsLength - categoriesQuantity;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newItemElement = generateElementOfItem();
        fragment.appendChild(newItemElement);
        itemElements.push(newItemElement);
      }
      StatisticsElement.appendChild(fragment);
    } else if (difference > 0) {
      for (let p = currentItemElementsLength - 1, q = currentItemElementsLength - difference - 1; p > q; p--) {
        itemElements[p].remove();
        itemElements.splice(p, 1);
      }
    }
  }

  for (let i = 0; i < categoriesQuantity; i++) {
    const previousItem = previousCategories[i];
    const currentItem = categories[i];
    const thisItemElement = itemElements[i];
    if (previousItem) {
      updateItem(thisItemElement, currentItem, previousItem);
    } else {
      updateItem(thisItemElement, currentItem, null);
    }
  }

  previousCategories = categories;
  previousSkeletonScreen = skeletonScreen;
  previousAnimation = animation;
}

function setupStorageFieldSkeletonScreen(): void {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const FieldSize = querySize('window');
  // const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;
  const defaultCategoriesQuantity = Math.min(7, Math.floor(FieldHeight / 55) + 2);
  const statistics: StoreSizeStatistics = {
    categorizedSizes: {},
    totalSize: 0
  };
  for (let i = 0; i < defaultCategoriesQuantity; i++) {
    const categoryKey = `store-${i}`;
    statistics.categorizedSizes[categoryKey] = {
      category: {
        name: '',
        key: categoryKey
      },
      size: `size-${i}`
    };
  }
  updateStorageField(statistics, true, playing_animation);
}

async function refreshStorageStatistics() {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  setupStorageFieldSkeletonScreen();
  const statistics = await getStoresSizeStatistics();
  updateStorageField(statistics, false, playing_animation);
}

export function openStorage(): void {
  StorageField.setAttribute('displayed', 'true');
  refreshStorageStatistics();
}

export function closeStorage(): void {
  StorageField.setAttribute('displayed', 'false');
}
