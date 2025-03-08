import { generateIdentifier } from '../../../tools/index';
import { createDateObjectFromDate, dateToString, offsetDate, TimeStampPeriod } from '../../../tools/time';
import { lfSetItem, lfGetItem, lfListItemKeys, lfRemoveItem } from '../../storage/index';

export interface DataUsageStatsChunk {
  date: [year: number, month: number, day: number];
  data: Array<number>;
  stats: {
    sum: number;
    max: number;
    min: number;
  };
}

export type DataUsageStatsChunkArray = Array<DataUsageStatsChunk>;

export interface DataUsageStats {
  stats: {
    sum: number;
    max: number;
    min: number;
  };
  period: TimeStampPeriod;
  chart: string;
}

export const DataUsagePeriod = 7; // days

export async function recordDataUsage(contentLength: number, date: Date) {
  const key = `d_${dateToString(date, 'YYYY_MM_DD')}`;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const index = hours * 60 + minutes;
  const existingDataUsageStatsChunkJSON = await lfGetItem(2, key);
  if (existingDataUsageStatsChunkJSON) {
    const existingDataUsageStatsChunkObject = JSON.parse(existingDataUsageStatsChunkJSON) as DataUsageStatsChunk;
    existingDataUsageStatsChunkObject.stats.sum += contentLength;
    existingDataUsageStatsChunkObject.data[index] += contentLength;
    const changedData = existingDataUsageStatsChunkObject.data[index];
    if (changedData > existingDataUsageStatsChunkObject.stats.max) {
      existingDataUsageStatsChunkObject.stats.max = changedData;
    }
    if (changedData < existingDataUsageStatsChunkObject.stats.min) {
      existingDataUsageStatsChunkObject.stats.min = changedData;
    }
    await lfSetItem(2, key, JSON.stringify(existingDataUsageStatsChunkObject));
  } else {
    const newDataUsageStatsChunk = {} as DataUsageStatsChunk;
    const data = new Uint32Array(60 * 24);
    data[index] += contentLength;
    newDataUsageStatsChunk.data = Array.from(data);
    newDataUsageStatsChunk.stats = {
      sum: contentLength,
      max: contentLength,
      min: 0
    };
    newDataUsageStatsChunk.date = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
    await lfSetItem(2, key, JSON.stringify(newDataUsageStatsChunk));
  }
}

export async function listDataUsageStatsChunks(): Promise<DataUsageStatsChunkArray> {
  const endDate = new Date();
  endDate.setHours(0);
  endDate.setMinutes(0);
  endDate.setSeconds(0);
  endDate.setMilliseconds(0);
  const startDate = offsetDate(endDate, -1 * DataUsagePeriod, 0, 0);
  const result: DataUsageStatsChunkArray = [];
  for (let i = 0; i < DataUsagePeriod; i++) {
    const date = offsetDate(startDate, i, 0, 0);
    const key = `d_${dateToString(date, 'YYYY_MM_DD')}`;
    const existingDataUsageStatsChunkJSON = await lfGetItem(2, key);
    if (existingDataUsageStatsChunkJSON) {
      const existingDataUsageStatsChunkObject = JSON.parse(existingDataUsageStatsChunkJSON) as DataUsageStatsChunk;
      result.push(existingDataUsageStatsChunkObject);
    } else {
      const blankDataUsageStatsChunk = {} as DataUsageStatsChunk;
      const data = new Uint32Array(60 * 24);
      blankDataUsageStatsChunk.data = Array.from(data);
      blankDataUsageStatsChunk.stats = {
        sum: 0,
        max: 0,
        min: 0
      };
      blankDataUsageStatsChunk.date = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
      result.push(blankDataUsageStatsChunk);
    }
  }
  return result;
}

export async function discardExpiredDataUsageRecords() {
  const millisecondsPerDay = 60 * 60 * 24 * 1000;
  const expirationPeriod = millisecondsPerDay * DataUsagePeriod;
  const now = new Date().getTime();
  const keys = await lfListItemKeys(2);
  for (const key of keys) {
    const json = await lfGetItem(2, key);
    const object = JSON.parse(json) as DataUsageStatsChunk;
    const date = createDateObjectFromDate(object.date[0], object.date[1], object.date[2]);
    if (now - date.getTime() > expirationPeriod) {
      await lfRemoveItem(2, key);
    }
  }
}

export async function getDataUsageStats(width: number, height: number, padding: number): Promise<DataUsageStats> {
  const worker = new Worker(new URL('./simplifyCarInfo-worker.ts', import.meta.url));
  const dataUsageStatsChunks = await listDataUsageStatsChunks();
  // Wrap worker communication in a promise
  const result = await new Promise((resolve, reject) => {
    worker.onmessage = function (e) {
      resolve(e.data); // Resolve the promise with the worker's result
      worker.terminate(); // Terminate the worker when done
    };
    worker.onerror = function (e) {
      reject(e.message); // Reject the promise on error
      worker.terminate(); // Terminate the worker if an error occurs
    };
    worker.postMessage([dataUsageStatsChunks, width, height, padding]); // Send data to the worker
  });
  return result;
}
