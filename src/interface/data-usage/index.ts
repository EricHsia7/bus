import { AggregationPeriod, getDataUsageGraph } from '../../data/analytics/data-usage';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/query-selector';
import { closePreviousPage, FieldSize, openPreviousPage, pushPageHistory } from '../index';

const dataUsageField = documentQuerySelector('.css_data_usage_field');
const dataUsageBodyElement = elementQuerySelector(dataUsageField, '.css_data_usage_body');
const graphElement = elementQuerySelector(dataUsageBodyElement, '.css_data_usage_graph');
const graphSVGElement = elementQuerySelector(graphElement, '.css_data_usage_graph_svg');
const graphAggregationPeriodsElement = elementQuerySelector(graphElement, '.css_data_usage_graph_aggregation_periods');

function queryDataUsageFieldSize(): FieldSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

async function updateDataUsageGraph(aggregationPeriod: AggregationPeriod): void {
  const size = queryDataUsageFieldSize();
  const graphWidth = size.width;
  const graphHeight = (5 / 18) * graphWidth;
  const graph = await getDataUsageGraph(aggregationPeriod, graphWidth, graphHeight, 20, 'var(--b-cssvar-main-color)', 2);
  if (typeof graph === 'string') {
    graphSVGElement.innerHTML = graph;
  } else {
    if (graph === false) {
      graphSVGElement.innerText = '目前資料不足，無法描繪圖表。';
    }
  }
}

function initializeDataUsage(): void {
  switchDataUsageGraphAggregationPeriod('daily');
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
