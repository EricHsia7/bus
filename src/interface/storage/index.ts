import { getStoresSizeStatistics, StoreSize } from '../../data/analytics/storage-size';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { GeneratedElement } from '../index';

const StorageField = documentQuerySelector('.css_storage_field');
const StorageBodyElement = elementQuerySelector(StorageField, '.css_storage_body');
const statisticsElement = elementQuerySelector(StorageBodyElement, '.css_storage_statistics');

function generateElementOfItem(item: StoreSize): GeneratedElement {
  const element = document.createElement('div');
  element.classList.add('css_storage_statistics_item');
  element.innerHTML = `<div class="css_storage_statistics_item_name">${item.category.name}</div><div class="css_storage_statistics_item_value">${item.size}</div>`;
  return {
    element: element,
    id: null
  };
}

async function initializeStorageStatistics() {
  const statistics = await getStoresSizeStatistics();
  statisticsElement.innerHTML = '';
  for (const key in statistics) {
    const item = statistics[key];
    const itemElement = generateElementOfItem(item);
    statisticsElement.appendChild(itemElement.element);
  }
}

export function openStorage(): void {
  StorageField.setAttribute('displayed', 'true');
  initializeStorageStatistics();
}

export function closeStorage(): void {
  StorageField.setAttribute('displayed', 'false');
}
