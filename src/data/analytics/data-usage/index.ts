import { convertBytes } from '../../../tools/convert';
import { segmentsToPath, simplifyPath } from '../../../tools/path';
import { dateToString, TimeStampPeriod } from '../../../tools/time';
import { lfSetItem, lfGetItem, lfListItemKeys, lfRemoveItem } from '../../storage/index';

export interface DataUsageStatsChunk {
  bytes: Array<number>;
  max_byte: number;
  min_byte: number;
  byte_sum: number;
  timestamp: number;
  id: string; // d_<YYYY>_<MM>_<DD>
}

const DataUsagePeriod = 7; // days

export async function recordDataUsage(contentLength: number, date: Date) {
  const key = `d_${dateToString(date, 'YYYY_MM_DD')}`;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const index = hours * 60 + minutes;
  const existingDataUsageStatsChunkJSON = await lfGetItem(2, key);
  if (existingDataUsageStatsChunkJSON) {
    const existingDataUsageStatsChunkObject = JSON.parse(existingDataUsageStatsChunkJSON) as DataUsageStatsChunk;
    if (contentLength > existingDataUsageStatsChunkObject.max_byte) {
      existingDataUsageStatsChunkObject.max_byte = contentLength;
    }
    if (contentLength < existingDataUsageStatsChunkObject.min_byte) {
      existingDataUsageStatsChunkObject.min_byte = contentLength;
    }
    existingDataUsageStatsChunkObject.byte_sum += contentLength;
    existingDataUsageStatsChunkObject.bytes[index] += contentLength;
    await lfSetItem(2, key, JSON.stringify(existingDataUsageStatsChunkObject));
  } else {
    const newDataUsageStatsChunk = {} as DataUsageStatsChunk;
    const bytes = new Uint32Array(60 * 24);
    bytes[index] += contentLength;
    newDataUsageStatsChunk.bytes = Array.from(bytes);
    newDataUsageStatsChunk.max_byte = contentLength;
    newDataUsageStatsChunk.min_byte = 0;
    newDataUsageStatsChunk.byte_sum = contentLength;
    newDataUsageStatsChunk.timestamp = date.getTime();
    newDataUsageStatsChunk.id = key;
    await lfSetItem(2, key, JSON.stringify(newDataUsageStatsChunk));
  }
}

export async function discardExpiredDataUsageRecords() {
  const now = new Date().getTime();
  const keys = await lfListItemKeys(2);
  for (const key of keys) {
    const json = await lfGetItem(2, key);
    const object = JSON.parse(json) as DataUsageStatsChunk;
    if (now - object.timestamp > 60 * 60 * 24 * 7 * 1000) {
      await lfRemoveItem(2, key);
    }
  }
}

export async function getDataUsageStatsPeriod(): Promise<TimeStampPeriod> {
  let minTimestamp = Infinity;
  let maxTimestamp = -Infinity;
  const keys = await lfListItemKeys(2);
  for (const key of keys) {
    const json = await lfGetItem(2, key);
    const object = JSON.parse(json) as DataUsageStatsChunk;
    const timestamp = object.timestamp;
    if (timestamp < minTimestamp) {
      minTimestamp = timestamp;
    }
    if (timestamp > maxTimestamp) {
      maxTimestamp = timestamp;
    }
  }

  if (minTimestamp === Infinity) {
    minTimestamp = 0;
  }
  if (maxTimestamp === -Infinity) {
    maxTimestamp = 0;
  }

  return {
    start: new Date(minTimestamp),
    end: new Date(maxTimestamp)
  };
}

export async function getTotalDataUsage(): Promise<string> {
  const keys = await lfListItemKeys(2);
  let totalContentLength: number = 0;
  for (const key of keys) {
    const json = await lfGetItem(2, key);
    const object = JSON.parse(json) as DataUsageStatsChunk;
    totalContentLength += object.byte_sum;
  }
  return convertBytes(totalContentLength);
}

export type AggregationPeriod = 'minutely' | 'hourly' | 'daily';

export async function generateDataUsageGraph(aggregationPeriod: AggregationPeriod, width: number, height: number, padding: number): Promise<string | boolean> {
  let increment: number = 0;
  switch (aggregationPeriod) {
    case 'minutely':
      increment = 1;
      break;
    case 'hourly':
      increment = 60;
      break;
    case 'daily':
      increment = 60 * 24;
      break;
    default:
      break;
  }

  const data: Array<DataUsageStatsChunk> = [];
  const keys = await lfListItemKeys(2);
  for (const key of keys) {
    const json = await lfGetItem(2, key);
    const object = JSON.parse(json) as DataUsageStatsChunk;
    data.push(object);
  }

  data.sort(function (a, b) {
    a.timestamp - b.timestamp;
  });

  const dataLength = data.length;

  const graphDataArray = new Uint32Array(dataLength * 60 * 24);
  for (let i = 0; i < dataLength; i++) {
    graphDataArray.set(data[i], i * 60 * 24);
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
