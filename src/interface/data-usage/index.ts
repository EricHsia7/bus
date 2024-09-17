import { getDataUsageGraph } from '../../data/analytics/data-usage';
import { getHTMLVersionBranchName } from '../../data/settings/version';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { closePreviousPage, FieldSize, openPreviousPage, pushPageHistory } from '../index';

const dataUsageField = documentQuerySelector('.css_data_usage_field');
const dataUsageBodyElement = elementQuerySelector(dataUsageField, '.css_data_usage_body');
const graphElement = elementQuerySelector(dataUsageBodyElement, '.css_data_usage_graph');

function queryDataUsageFieldSize(): FieldSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

async function initializeDataUsage(): void {
  const size = queryDataUsageFieldSize();
  const graphWidth = size.width - 40;
  const graphHeight = (9 / 16) * graphWidth;
  const graph = await getDataUsageGraph(graphWidth, graphHeight, 'var(--b-cssvar-main-color)', 2);
  graphElement.innerHTML = graph;
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
