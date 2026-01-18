import { getDataUsageStats } from '../../data/analytics/data-usage/index';
import { convertBytes } from '../../tools/convert';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { dateToString } from '../../tools/time';
import { closePreviousPage, openPreviousPage, pushPageHistory, querySize } from '../index';

const dataUsageField = documentQuerySelector('.css_data_usage_field');
const dataUsageBodyElement = elementQuerySelector(dataUsageField, '.css_data_usage_body');
const chartElement = elementQuerySelector(dataUsageBodyElement, '.css_data_usage_chart');
const statisticsElement = elementQuerySelector(dataUsageBodyElement, '.css_data_usage_statistics');
const totalDataUsageElement = elementQuerySelector(statisticsElement, '.css_data_usage_statistics_item[name="total-data-usage"] .css_data_usage_statistics_item_value');
const startTimeElement = elementQuerySelector(statisticsElement, '.css_data_usage_statistics_item[name="start-time"] .css_data_usage_statistics_item_value');
const endTimeElement = elementQuerySelector(statisticsElement, '.css_data_usage_statistics_item[name="end-time"] .css_data_usage_statistics_item_value');

async function initializeDataUsage() {
  const WindowSize = querySize('window');
  const graphWidth = WindowSize.width;
  const graphHeight = Math.min((5 / 18) * graphWidth, WindowSize.height * 0.33);
  const stats = await getDataUsageStats(graphWidth, graphHeight, 20);
  totalDataUsageElement.innerText = convertBytes(stats.stats.sum);
  startTimeElement.innerText = dateToString(stats.period.start, 'YYYY-MM-DD');
  endTimeElement.innerText = dateToString(stats.period.end, 'YYYY-MM-DD');
  chartElement.innerHTML = stats.chart;
}

export function openDataUsage(): void {
  pushPageHistory('DataUsage');
  dataUsageField.setAttribute('displayed', 'true');
  initializeDataUsage();
  closePreviousPage();
}

export function closeDataUsage(): void {
  // revokePageHistory('DataUsage');
  dataUsageField.setAttribute('displayed', 'false');
  openPreviousPage();
}
