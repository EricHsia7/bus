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

export async function getDataUsageGraph(aggregationPeriod: AggregationPeriod, width: number, height: number, padding: number, stroke: string = '#000000', strokeWidth: number = 2): Promise<string | boolean> {
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
        x: padding + ((graphData.start_time - minStartTime) / (maxStartTime - minStartTime)) * width,
        y: padding + (1 - (graphData.content_length - minContentLength) / (maxContentLength - minContentLength)) * height
      };
      points.push(point);
    }

    const simplifiedPath = simplifyPath(points, 0.8);
    const svgPath = segmentsToPath(simplifiedPath, 1);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width + padding * 2}px" height="${height + padding * 2}px" viewBox="0 0 ${width + padding * 2} ${height + padding * 2}"><path d="${svgPath}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" opacity="1" /></svg>`;
  } else {
    return false;
  }
}
