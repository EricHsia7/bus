import { convertBytes } from '../../../tools/convert';
import { generateIdentifier } from '../../../tools/index';
import { segmentsToPath, simplifyPath } from '../../../tools/path';
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
  const startDate = offsetDate(endDate, -DataUsagePeriod, 0, 0);
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

let workerResponses: {
  [key: string]: Function;
} = {};
var port;

// Check if SharedWorker is supported, and fall back to Worker if not
if (typeof SharedWorker !== 'undefined') {
  const getUpdateRateSharedWorker = new SharedWorker(new URL('./worker.ts', import.meta.url)); // Reusable shared worker
  port = getUpdateRateSharedWorker.port; // Access the port for communication
  port.start(); // Start the port (required by some browsers)
} else {
  const getUpdateRateWorker = new Worker(new URL('./worker.ts', import.meta.url)); // Fallback to standard worker
  port = getUpdateRateWorker; // Use Worker directly for communication
}

// Handle messages from the worker
port.onmessage = function (e) {
  const [result, taskID] = e.data;
  if (workerResponses[taskID]) {
    workerResponses[taskID](result); // Resolve the correct promise
    delete workerResponses[taskID]; // Clean up the response handler
  }
};

// Handle errors
port.onerror = function (e) {
  console.error(e.message);
};

export async function getDataUsageStats(width: number, height: number, padding: number): Promise<DataUsageStats> {
  const taskID = generateIdentifier('t');

  const dataUsageStatsChunks = await listDataUsageStatsChunks();

  const result = await new Promise((resolve, reject) => {
    workerResponses[taskID] = resolve; // Store the resolve function for this taskID
    port.onerror = function (e) {
      reject(e.message);
    };
    port.postMessage([dataUsageStatsChunks, width, height, padding, taskID]); // Send the task to the worker
  });

  return result;
}
