import { getStoresSizeStatistics, StoreSize } from '../../data/analytics/storage-size';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { GeneratedElement } from '../index';

const StorageField = documentQuerySelector('.css_storage_field');
const StorageBodyElement = elementQuerySelector(StorageField, '.css_storage_body');
const StatisticsElement = elementQuerySelector(StorageBodyElement, '.css_storage_statistics');

function generateElementOfItem(item: StoreSize): GeneratedElement {
  // Create root element
  const statisticsItemElement = document.createElement('div');
  statisticsItemElement.classList.add('css_storage_statistics_item');

  // Create name element
  const nameElement = document.createElement('div');
  nameElement.classList.add('css_storage_statistics_item_name');
  nameElement.appendChild(document.createTextNode(item.category.name));

  // Create value element
  const valueElement = document.createElement('div');
  valueElement.classList.add('css_storage_statistics_item_value');
  valueElement.appendChild(document.createTextNode(String(item.size)));

  // Append children
  statisticsItemElement.appendChild(nameElement);
  statisticsItemElement.appendChild(valueElement);

  return {
    element: statisticsItemElement,
    id: ''
  };
}

async function initializeStorageStatistics() {
  const statistics = await getStoresSizeStatistics();
  StatisticsElement.innerHTML = '';
  const fragment = new DocumentFragment();
  for (const key in statistics.categorizedSizes) {
    const item = statistics.categorizedSizes[key];
    const newItemElement = generateElementOfItem(item);
    fragment.appendChild(newItemElement.element);
  }
  StatisticsElement.append(fragment);
}

export function openStorage(): void {
  StorageField.setAttribute('displayed', 'true');
  initializeStorageStatistics();
}

export function closeStorage(): void {
  StorageField.setAttribute('displayed', 'false');
}
