import { getDataUsageStats } from '../../data/analytics/data-usage/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/query-selector';
import { dateToString } from '../../tools/time';
import { closePreviousPage, openPreviousPage, pushPageHistory, querySize } from '../index';

const dataUsageField = documentQuerySelector('.css_data_usage_field');

const dataUsageBodyElement = elementQuerySelector(dataUsageField, '.css_data_usage_body');

const graphElement = elementQuerySelector(dataUsageBodyElement, '.css_data_usage_graph');
const graphSVGElement = elementQuerySelector(graphElement, '.css_data_usage_graph_svg');
const graphAggregationPeriodsElement = elementQuerySelector(graphElement, '.css_data_usage_graph_aggregation_periods');

const statisticsElement = elementQuerySelector(dataUsageBodyElement, '.css_data_usage_statistics');
const totalDataUsageElement = elementQuerySelector(statisticsElement, '.css_data_usage_statistics_item[name="total-data-usage"] .css_data_usage_statistics_item_value');
const startTimeElement = elementQuerySelector(statisticsElement, '.css_data_usage_statistics_item[name="start-time"] .css_data_usage_statistics_item_value');
const endTimeElement = elementQuerySelector(statisticsElement, '.css_data_usage_statistics_item[name="end-time"] .css_data_usage_statistics_item_value');

async function updateDataUsageGraph(aggregationPeriod: AggregationPeriod) {
  const WindowSize = querySize('window');
  const graphWidth = WindowSize.width;
  const graphHeight = Math.min((5 / 18) * graphWidth, WindowSize.height * 0.33);
  const graph = await generateDataUsageGraph(aggregationPeriod, graphWidth, graphHeight, 20);
  if (typeof graph === 'string') {
    graphSVGElement.innerHTML = graph;
  } else {
    if (graph === false) {
      graphSVGElement.innerText = '目前資料不足，無法描繪圖表。';
    }
  }
}

async function updateDataUsageStatistics() {
  const totalDataUsage = await getTotalDataUsage();
  const recordsPeriod = await getDataUsageStatsPeriod();
  totalDataUsageElement.innerText = totalDataUsage;
  startTimeElement.innerText = dateToString(recordsPeriod.start, 'YYYY-MM-DD hh:mm:ss');
  endTimeElement.innerText = dateToString(recordsPeriod.end, 'YYYY-MM-DD hh:mm:ss');
}

function initializeDataUsage(): void {
  switchDataUsageGraphAggregationPeriod('daily');
  updateDataUsageStatistics();
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

export function switchDataUsageGraphAggregationPeriod(aggregationPeriod: AggregationPeriod): void {
  const elements = elementQuerySelectorAll(graphAggregationPeriodsElement, '.css_data_usage_graph_aggregation_period');
  for (const element of elements) {
    const period = element.getAttribute('period');
    if (period === aggregationPeriod) {
      element.setAttribute('highlighted', 'true');
    } else {
      element.setAttribute('highlighted', 'false');
    }
  }
  updateDataUsageGraph(aggregationPeriod);
}
