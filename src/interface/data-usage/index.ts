import { documentQuerySelector } from '../../tools/query-selector';

const dataUsageField = documentQuerySelector('.css_data_usage_field');

export function openDataUsage(): void {
  dataUsageField.setAttribute('displayed', 'true');
}

export function closeDataUsage(): void {
  dataUsageField.setAttribute('displayed', 'false');
}
