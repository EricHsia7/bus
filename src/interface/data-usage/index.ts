import { DataUsageStats, getDataUsageStats } from '../../data/analytics/data-usage/index';
import { convertBytes } from '../../tools/convert';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { dateToString } from '../../tools/time';
import { hidePreviousPage, pushPageHistory, querySize, revokePageHistory, showPreviousPage } from '../index';

const Field = documentQuerySelector('.css_data_usage_field');
const HeadElement = elementQuerySelector(Field, '.css_data_usage_head');
const HeadButtonLeftElement = elementQuerySelector(HeadElement, '.css_data_usage_button_left');
const BodyElement = elementQuerySelector(Field, '.css_data_usage_body');
const ChartElement = elementQuerySelector(BodyElement, '.css_data_usage_chart');
const StatisticsElement = elementQuerySelector(BodyElement, '.css_data_usage_statistics');
const TotalDataUsageElement = elementQuerySelector(StatisticsElement, '.css_data_usage_statistics_item[name="total-data-usage"] .css_data_usage_statistics_item_value');
const MaxDataUsagePerMinuteElement = elementQuerySelector(StatisticsElement, '.css_data_usage_statistics_item[name="max-data-usage-per-minute"] .css_data_usage_statistics_item_value');
const MinDataUsagePerMinuteElement = elementQuerySelector(StatisticsElement, '.css_data_usage_statistics_item[name="min-data-usage-per-minute"] .css_data_usage_statistics_item_value');
const StartTimeElement = elementQuerySelector(StatisticsElement, '.css_data_usage_statistics_item[name="start-time"] .css_data_usage_statistics_item_value');
const EndTimeElement = elementQuerySelector(StatisticsElement, '.css_data_usage_statistics_item[name="end-time"] .css_data_usage_statistics_item_value');

function updateDataUsageField(stats: DataUsageStats): void {
  TotalDataUsageElement.textContent = convertBytes(stats.stats.sum);
  MaxDataUsagePerMinuteElement.textContent = convertBytes(stats.stats.max);
  MinDataUsagePerMinuteElement.textContent = convertBytes(stats.stats.min);
  StartTimeElement.textContent = dateToString(stats.period.start, 'YYYY-MM-DD');
  EndTimeElement.textContent = dateToString(stats.period.end, 'YYYY-MM-DD');
  ChartElement.innerHTML = new TextDecoder().decode(stats.chart);
}

async function initializeDataUsageField() {
  HeadButtonLeftElement.onclick = closeDataUsage;
  const WindowSize = querySize('window');
  const graphWidth = WindowSize.width;
  const graphHeight = Math.min((5 / 18) * graphWidth, WindowSize.height * 0.33);
  const stats = await getDataUsageStats(graphWidth, graphHeight, 20);
  updateDataUsageField(stats);
}

export function showDataUsage(): void {
  Field.setAttribute('displayed', 'true');
}

export function hideDataUsage(): void {
  Field.setAttribute('displayed', 'false');
}

export function openDataUsage(): void {
  pushPageHistory('DataUsage');
  showDataUsage();
  initializeDataUsageField();
  hidePreviousPage();
}

export function closeDataUsage(): void {
  hideDataUsage();
  showPreviousPage();
  revokePageHistory('DataUsage');
}
