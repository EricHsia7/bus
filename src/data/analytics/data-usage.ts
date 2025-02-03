import { convertBytes } from '../../tools/convert';
import { segmentsToPath, simplifyPath } from '../../tools/path';
import { dateToString, TimeStampPeriod } from '../../tools/time';
import { lfSetItem, lfGetItem, lfListItemKeys, lfRemoveItem } from '../storage/index';

let incompleteRecords = {};

export async function recordRequest(requestID: string, data: object, incomplete: boolean) {
  if (!incompleteRecords.hasOwnProperty(requestID)) {
    incompleteRecords[requestID] = data;
  }
  incompleteRecords[requestID].end_time = data.end_time;
  incompleteRecords[requestID].content_length = incompleteRecords[requestID].content_length + data.content_length;

  if (!incomplete) {
    if (incompleteRecords.hasOwnProperty(requestID)) {
      await lfSetItem(2, requestID, JSON.stringify(incompleteRecords[requestID]));
      delete incompleteRecords[requestID];
    }
  }
}

export async function discardExpiredDataUsageRecords() {
  const keys = await lfListItemKeys(2);
  for (const key of keys) {
    const json = await lfGetItem(2, key);
    const object: object = JSON.parse(json);
    if (new Date().getTime() - object.timeStamp > 60 * 60 * 24 * 30 * 1000) {
      await lfRemoveItem(2, key);
    }
  }
}

export async function getDataUsageRecordsPeriod(): Promise<TimeStampPeriod> {
  const keys = await lfListItemKeys(2);
  let startTimeArray = [];
  let endTimeArray = [];
  for (const key of keys) {
    const json = await lfGetItem(2, key);
    const object = JSON.parse(json);
    startTimeArray.push(object.start_time);
    endTimeArray.push(object.end_time);
  }
  const minStartTime = new Date(Math.min(...startTimeArray));
  const maxEndTime = new Date(Math.max(...endTimeArray));

  return {
    start: minStartTime,
    end: maxEndTime
  };
}

export async function calculateTotalDataUsage(): Promise<string> {
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

export async function generateDataUsageGraph(aggregationPeriod: AggregationPeriod, width: number, height: number, padding: number): Promise<string | boolean> {
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
    const xAxisLabel = `<text x="${padding + width / 2}" y="${padding + height + padding}" text-anchor="middle" font-size="12" fill="var(--b-cssvar-333333)">時間</text>`;
    const yAxisLabel = `<text x="${padding / 2}" y="${padding + height / 2}" text-anchor="middle" font-size="12" fill="var(--b-cssvar-333333)" transform="rotate(-90, ${padding * 0.7}, ${padding + height / 2})">傳輸量</text>`;

    // Paths
    const simplifiedPath = simplifyPath(points, 1.1);
    const pathData = segmentsToPath(simplifiedPath, 1);
    const fillingPathData = `M${padding},${height + padding}${pathData}L${padding + width},${height + padding}L${padding},${height + padding}`;
    const path = `<path d="${pathData}" fill="none" stroke="var(--b-cssvar-main-color)" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round" opacity="1"></path>`;
    const fillingPath = `<path d="${fillingPathData}" stroke="none" stroke-width="0" fill="url(#grad1)"></path>`;
    const filling = `<linearGradient id="grad1" x1="50%" y1="0%" x2="50%" y2="100%"><stop offset="0%" style="stop-color:rgba(var(--b-cssvar-main-color-r), var(--b-cssvar-main-color-g), var(--b-cssvar-main-color-b), 0.3);" /><stop offset="73%" style="stop-color:rgba(var(--b-cssvar-main-color-r), var(--b-cssvar-main-color-g), var(--b-cssvar-main-color-b), 0.09);" /><stop offset="100%" style="stop-color:rgba(var(--b-cssvar-main-color-r), var(--b-cssvar-main-color-g), var(--b-cssvar-main-color-b), 0);" /></linearGradient>`;

    // SVG
    return /*html*/ `<svg xmlns="http://www.w3.org/2000/svg" width="${width + padding * 2}px" height="${height + padding * 2}px" viewBox="0 0 ${width + padding * 2} ${height + padding * 2}"><defs>${filling}</defs>${fillingPath}${path}${xAxis}${yAxis}${xAxisLabel}${yAxisLabel}</svg>`;
  } else {
    return false;
  }
}
