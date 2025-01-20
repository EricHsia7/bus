import { AggregationPeriod, calculateTotalDataUsage, generateDataUsageGraph, getDataUsageRecordsPeriod } from '../../data/analytics/data-usage';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/query-selector';
import { dateToString } from '../../tools/time';
import { closePreviousPage, FieldSize, openPreviousPage, pushPageHistory } from '../index';

const dataUsageField = documentQuerySelector('.css_data_usage_field');

const dataUsageFieldBody = elementQuerySelector(dataUsageField, '.css_data_usage_field_body');

const graphComponent = elementQuerySelector(dataUsageFieldBody, '.css_data_usage_graph_component');
const graphContentElement = elementQuerySelector(graphComponent, '.css_data_usage_graph_component_content');
const aggregationPeriodsComponent = elementQuerySelector(graphComponent, '.css_data_usage_graph_component_aggregation_periods_component');

const statisticsComponent = elementQuerySelector(dataUsageFieldBody, '.css_data_usage_statistics_component');
const totalDataUsageItemValue = elementQuerySelector(statisticsComponent, '.css_data_usage_statistics_component_item[name="total-data-usage"] .css_data_usage_statistics_component_item_value');
const startTimeItemValue = elementQuerySelector(statisticsComponent, '.css_data_usage_statistics_component_item[name="start-time"] .css_data_usage_statistics_component_item_value');
const endTimeItemValue = elementQuerySelector(statisticsComponent, '.css_data_usage_statistics_component_item[name="end-time"] .css_data_usage_statistics_component_item_value');

function queryDataUsageFieldSize(): FieldSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

async function updateDataUsageGraph(aggregationPeriod: AggregationPeriod): void {
  const size = queryDataUsageFieldSize();
  const graphWidth = size.width;
  const graphHeight = Math.min((5 / 18) * graphWidth, size.height * 0.33);
  const graph = await generateDataUsageGraph(aggregationPeriod, graphWidth, graphHeight, 20);
  if (typeof graph === 'string') {
    graphContentElement.innerHTML = graph;
  } else {
    if (graph === false) {
      graphContentElement.innerText = '目前資料不足，無法描繪圖表。';
    }
  }
}

async function updateDataUsageStatistics(): void {
  const totalDataUsage = await calculateTotalDataUsage();
  const recordsPeriod = await getDataUsageRecordsPeriod();
  totalDataUsageItemValue.innerText = totalDataUsage;
  startTimeItemValue.innerText = dateToString(recordsPeriod.start, 'YYYY-MM-DD hh:mm:ss');
  endTimeItemValue.innerText = dateToString(recordsPeriod.end, 'YYYY-MM-DD hh:mm:ss');
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
  const elements = elementQuerySelectorAll(aggregationPeriodsComponent, '.css_data_usage_graph_aggregation_period');
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
