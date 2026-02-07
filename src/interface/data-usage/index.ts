import { getDataUsageStats } from '../../data/analytics/data-usage/index';
import { convertBytes } from '../../tools/convert';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { dateToString } from '../../tools/time';
import { hidePreviousPage, pushPageHistory, querySize, revokePageHistory, showPreviousPage } from '../index';

const dataUsageField = documentQuerySelector('.css_data_usage_field');
const dataUsageBodyElement = elementQuerySelector(dataUsageField, '.css_data_usage_body');
const chartElement = elementQuerySelector(dataUsageBodyElement, '.css_data_usage_chart');
const statisticsElement = elementQuerySelector(dataUsageBodyElement, '.css_data_usage_statistics');
const totalDataUsageElement = elementQuerySelector(statisticsElement, '.css_data_usage_statistics_item[name="total-data-usage"] .css_data_usage_statistics_item_value');
const maxDataUsagePerMinuteElement = elementQuerySelector(statisticsElement, '.css_data_usage_statistics_item[name="max-data-usage-per-minute"] .css_data_usage_statistics_item_value');
const minDataUsagePerMinuteElement = elementQuerySelector(statisticsElement, '.css_data_usage_statistics_item[name="min-data-usage-per-minute"] .css_data_usage_statistics_item_value');
const startTimeElement = elementQuerySelector(statisticsElement, '.css_data_usage_statistics_item[name="start-time"] .css_data_usage_statistics_item_value');
const endTimeElement = elementQuerySelector(statisticsElement, '.css_data_usage_statistics_item[name="end-time"] .css_data_usage_statistics_item_value');

async function initializeDataUsage() {
  const WindowSize = querySize('window');
  const graphWidth = WindowSize.width;
  const graphHeight = Math.min((5 / 18) * graphWidth, WindowSize.height * 0.33);
  const stats = await getDataUsageStats(graphWidth, graphHeight, 20);
  totalDataUsageElement.innerText = convertBytes(stats.stats.sum);
  maxDataUsagePerMinuteElement.innerText = convertBytes(stats.stats.max);
  minDataUsagePerMinuteElement.innerText = convertBytes(stats.stats.min);
  startTimeElement.innerText = dateToString(stats.period.start, 'YYYY-MM-DD');
  endTimeElement.innerText = dateToString(stats.period.end, 'YYYY-MM-DD');
  chartElement.innerHTML = stats.chart;
}

export function showDataUsage(pageTransitionReverse: boolean): void {
  const className = pageTransitionReverse ? 'css_page_transition_slide_in_reverse' : 'css_page_transition_fade_in';
  dataUsageField.addEventListener(
    'animationend',
    function () {
      dataUsageField.classList.remove(className);
    },
    { once: true }
  );
  dataUsageField.classList.add(className);
  dataUsageField.setAttribute('displayed', 'true');
}

export function hideDataUsage(pageTransitionReverse: boolean): void {
  const className = pageTransitionReverse === 'ltr' ? 'css_page_transition_slide_out_reverse' : 'css_page_transition_fade_out';
  dataUsageField.addEventListener(
    'animationend',
    function () {
      dataUsageField.setAttribute('displayed', 'false');
      dataUsageField.classList.remove(className);
    },
    { once: true }
  );
  dataUsageField.classList.add(className);
}

export function openDataUsage(): void {
  pushPageHistory('DataUsage');
  showDataUsage('rtl');
  initializeDataUsage();
  hidePreviousPage();
}

export function closeDataUsage(): void {
  hideDataUsage('ltr');
  showPreviousPage();
  revokePageHistory('DataUsage');
}
