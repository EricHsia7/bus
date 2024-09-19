import { convertBytes } from '../../tools/index';
import { segmentsToPath, simplifyPath } from '../../tools/path';
import { dateToString } from '../../tools/time';
import { lfSetItem, lfGetItem, lfListItemKeys } from '../storage/index';

export async function recordRequest(requestID: string, data: object): void {
  var existingRecord = await lfGetItem(2, requestID);
  if (existingRecord) {
    var existingRecordObject = JSON.parse(existingRecord);
    existingRecordObject.end_time = existingRecordObject.end_time;
    existingRecordObject.content_length = existingRecordObject.content_length + data.content_length;
    await lfSetItem(2, requestID, JSON.stringify(existingRecordObject));
  } else {
    await lfSetItem(2, requestID, JSON.stringify(data));
  }
}

export async function calculateDataUsage(): Promise<number> {
  const keys = await lfListItemKeys(2);
  let totalContentLength = 0;
  for (const key of keys) {
    const json = await lfGetItem(2, key);
    const object = JSON.parse(json);
    totalContentLength += object.content_length;
  }
  return convertBytes(totalContentLength);
}

export type AggregationPeriod = 'minutely' | 'hourly' | 'daily';

export async function getDataUsageGraph(aggregationPeriod: AggregationPeriod, width: number, height: number, padding: number): Promise<string | boolean> {
  const keys = await lfListItemKeys(2);
  let dateToStringTemplate = 'YYYY_MM_DD_hh_mm_ss';
  switch (aggregationPeriod) {
    case 'minutely':
      dateToStringTemplate = 'YYYY_MM_DD_hh_mm';
      break;
    case 'hourly':
      dateToStringTemplate = 'YYYY_MM_DD_hh';
      break;
    case 'daily':
      dateToStringTemplate = 'YYYY_MM_DD';
      break;
    default:
      break;
  }

  let aggregatedData = {};
  for (const key of keys) {
    const json = await lfGetItem(2, key);
    const object = JSON.parse(json);
    const startDate = new Date(object.start_time);
    const graphDataKey = `d_${dateToString(startDate, dateToStringTemplate)}`;
    if (!aggregatedData.hasOwnProperty(graphDataKey)) {
      aggregatedData[graphDataKey] = { start_time: object.start_time, end_time: object.end_time, content_length: 0 };
    }
    aggregatedData[graphDataKey].content_length = aggregatedData[graphDataKey].content_length + object.content_length;
    if (object.start_time < aggregatedData[graphDataKey].start_time) {
      aggregatedData[graphDataKey].start_time = object.start_time;
    }
    if (object.end_time > aggregatedData[graphDataKey].end_time) {
      aggregatedData[graphDataKey].end_time = object.end_time;
    }
  }

  let graphDataArray = [];
  for (const graphDataKey in aggregatedData) {
    const item = aggregatedData[graphDataKey];
    graphDataArray.push(item);
  }

  if (graphDataArray.length > 3) {
    graphDataArray.sort(function (a, b) {
      return a.start_time - b.start_time;
    });
    const startTimeArray = graphDataArray.map((e) => e.start_time);
    const minStartTime = Math.min(...startTimeArray);
    const maxStartTime = Math.max(...startTimeArray);

    const contentLengthArray = graphDataArray.map((e) => e.content_length);
    const minContentLength = Math.min(...contentLengthArray);
    const maxContentLength = Math.max(...contentLengthArray);

    let points = [];
    for (const graphData of graphDataArray) {
      const point = {
        x: Math.round(padding + ((graphData.start_time - minStartTime) / (maxStartTime - minStartTime)) * width),
        y: Math.round(padding + (1 - (graphData.content_length - minContentLength) / (maxContentLength - minContentLength)) * height)
      };
      points.push(point);
    }

    // X-axis (horizontal)
    const xAxis = `<line x1="${padding}" y1="${height + padding}" x2="${padding + width}" y2="${height + padding}" stroke="var(--b-cssvar-333333)" stroke-width="1" />`;

    // Y-axis (vertical)
    const yAxis = `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height + padding}" stroke="var(--b-cssvar-333333)" stroke-width="1" />`;

    // Axis Labels
    const xAxisLabel = `<text x="${padding + width / 2}" y="${height + padding * 1.5}" text-anchor="middle" font-size="12" fill="var(--b-cssvar-333333)">時間</text>`;
    const yAxisLabel = `<text x="${padding / 2}" y="${padding + height / 2}" text-anchor="middle" font-size="12" fill="var(--b-cssvar-333333)" transform="rotate(-90, ${padding / 2}, ${padding + height / 2})">傳輸量</text>`;

    // Paths
    const simplifiedPath = simplifyPath(points, 1.1);
    const pathData = segmentsToPath(simplifiedPath, 1);
    const fillingPathData = `M${padding},${height + padding}${pathData}L${padding + width},${height + padding}L${padding},${height + padding}`;
    const path = `<path d="${pathData}" fill="none" stroke="var(--b-cssvar-main-color)" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round" opacity="1"></path>`;
    const fillingPath = `<path d="${fillingPathData}" stroke="none" stroke-width="0" fill="url(#grad1)"></path>`;
    const filling = `<linearGradient id="grad1" x1="50%" y1="0%" x2="50%" y2="100%"><stop offset="0%" style="stop-color:rgba(var(--b-cssvar-main-color-r), var(--b-cssvar-main-color-g), var(--b-cssvar-main-color-b), 0.3);" /><stop offset="73%" style="stop-color:rgba(var(--b-cssvar-main-color-r), var(--b-cssvar-main-color-g), var(--b-cssvar-main-color-b), 0.09);" /><stop offset="100%" style="stop-color:rgba(var(--b-cssvar-main-color-r), var(--b-cssvar-main-color-g), var(--b-cssvar-main-color-b), 0);" /></linearGradient>`;

    // SVG
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width + padding * 2}px" height="${height + padding * 2}px" viewBox="0 0 ${width + padding * 2} ${height + padding * 2}"><defs>${filling}</defs>${xAxis}${yAxis}${xAxisLabel}${yAxisLabel}${fillingPath}${path}</svg>`;
  } else {
    return false;
  }
}
