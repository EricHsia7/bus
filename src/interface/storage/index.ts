import { getStoresSizeStatistics, StoreSize } from '../../data/analytics/storage-size';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { GeneratedElement } from '../index';

const StorageField = documentQuerySelector('.css_storage_field');
const StorageBodyElement = elementQuerySelector(StorageField, '.css_storage_body');
const StatisticsElement = elementQuerySelector(StorageBodyElement, '.css_storage_statistics');

function generateElementOfItem(item: StoreSize): GeneratedElement {
  const element = document.createElement('div');
  element.classList.add('css_storage_statistics_item');
  element.innerHTML = /*html*/ `<div class="css_storage_statistics_item_name">${item.category.name}</div><div class="css_storage_statistics_item_value">${item.size}</div>`;
  return {
    element: element,
    id: ''
  };
}

async function initializeStorageStatistics(): void {
  const statistics = await getStoresSizeStatistics();
  StatisticsElement.innerHTML = '';
  for (const key in statistics.categorizedSizes) {
    const item = statistics.categorizedSizes[key];
    const itemElement = generateElementOfItem(item);
    StatisticsElement.appendChild(itemElement.element);
  }
}

export function openStorage(): void {
  StorageField.setAttribute('displayed', 'true');
  initializeStorageStatistics();
}

export function closeStorage(): void {
  StorageField.setAttribute('displayed', 'false');
}
