import { hasOwnProperty } from '../../tools/index';
import { pakoInflate } from '../../tools/pako-inflate/index';
import { timeStampToNumber } from '../../tools/time';
import { recordDataUsage } from '../analytics/data-usage/index';

type FetchTaskRequest = [resolve: Function, reject: Function, requestID: string, tag: string];

interface FetchTask {
  processing: boolean;
  requests: Array<FetchTaskRequest>;
  failed: boolean;
  timestamp: number;
  result: any;
}

type FetchTasks = { [url: string]: FetchTask };

const tasks: FetchTasks = {};

const TTL = 30000;
const FetchError = new Error('FetchError');

export async function fetchData(url: string, requestID: string, tag: string, fileType: 'json' | 'xml'): Promise<object> {
  // Check concurrency
  if (hasOwnProperty(tasks, url)) {
    if (tasks[url].processing) {
      return await new Promise((resolve, reject) => {
        tasks[url].requests.push([resolve, reject, requestID, tag]);
      });
    } else if (tasks[url].result !== null && new Date().getTime() <= tasks[url].timestamp) {
      setDataReceivingProgress(requestID, tag, 0, true);
      return tasks[url].result;
    }
  } else {
    tasks[url] = {
      processing: true,
      requests: [],
      failed: false,
      timestamp: -1,
      result: null
    };
  }

  // Fetch data
  const response = await fetch(url);
  if (!response.ok) {
    setDataReceivingProgress(requestID, tag, 0, true);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Read chunks
  const contentLength = parseInt(String(response.headers.get('content-length')));
  const reader = response.body.getReader();
  const chunks = [];
  let receivedLength = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
    receivedLength += value.length;
    const progress = receivedLength / contentLength;
    setDataReceivingProgress(requestID, tag, progress, false);
    if (hasOwnProperty(tasks, url)) {
      for (const request of tasks[url].requests) {
        setDataReceivingProgress(request[2], request[3], progress, false);
      }
    }
  }

  // Concatenate all the chunks into a single Uint8Array
  const uint8Array = new Uint8Array(receivedLength);
  let position = 0;
  for (const chunk of chunks) {
    uint8Array.set(chunk, position);
    position += chunk.length;
  }

  // Create a blob from the concatenated Uint8Array
  const blob = new Blob([uint8Array], { type: 'application/gzip' });
  const arrayBuffer = await blob.arrayBuffer();
  const inflatedData = await pakoInflate(arrayBuffer);

  let result;
  switch (fileType) {
    case 'json':
      if (/^<!doctype html>/.test(inflatedData)) {
        result = await fetchData(url.replace('https://tcgbusfs.blob.core.windows.net/', 'https://erichsia7.github.io/bus-alternative-static-apis/'), requestID, tag, fileType);
      } else {
        result = JSON.parse(inflatedData);
      }
      break;
    case 'xml':
      result = inflatedData;
      break;
    default:
      break;
  }

  // Record data usage
  const now = new Date();
  await recordDataUsage(contentLength, now);

  if (result) {
    // Resolve promises
    if (hasOwnProperty(tasks, url)) {
      const progress = receivedLength / contentLength;
      let request = tasks[url].requests.shift();
      while (request) {
        request[0](result);
        setDataReceivingProgress(request[2], request[3], progress, false);
        request = tasks[url].requests.shift();
      }
      tasks[url].result = result;
      tasks[url].timestamp = now.getTime() + TTL;
      tasks[url].processing = false;
    }
    discardExpiredFetchTasks();
    return result;
  } else {
    // Reject promises
    if (hasOwnProperty(tasks, url)) {
      let request = tasks[url].requests.shift();
      while (request) {
        request[1](FetchError);
        setDataReceivingProgress(request[2], request[3], 0, true);
        request = tasks[url].requests.shift();
      }
      tasks[url].failed = true;
    }
    discardExpiredFetchTasks();
    throw FetchError;
  }
}

function discardExpiredFetchTasks(): void {
  const now = new Date().getTime();
  for (const url in tasks) {
    if (hasOwnProperty(tasks, url)) {
      if (!tasks[url].processing) {
        if (now > tasks[url].timestamp) {
          delete tasks[url];
          continue;
        }
      }
      if (tasks[url].failed) {
        delete tasks[url];
        continue;
      }
    }
  }
}

export type DataReceivingProgress = {
  [requestID: string]: {
    [tag: string]: {
      expel: boolean;
      progress: number;
      total: number;
    };
  };
};

const dataReceivingProgress: DataReceivingProgress = {};

export function setDataReceivingProgress(requestID: string, tag: string, progress: number, expel: boolean): void {
  if (!hasOwnProperty(dataReceivingProgress, requestID)) {
    dataReceivingProgress[requestID] = {};
  }
  if (hasOwnProperty(dataReceivingProgress[requestID], tag)) {
    if (expel) {
      dataReceivingProgress[requestID][tag].expel = true;
    } else {
      dataReceivingProgress[requestID][tag].expel = false;
      dataReceivingProgress[requestID][tag].progress = progress;
    }
    broadcastDataReceivingProgress(requestID, 'run');
  } else {
    dataReceivingProgress[requestID][tag] = { expel: false, progress: progress, total: 1 };
    broadcastDataReceivingProgress(requestID, 'start');
  }
}

export function getDataReceivingProgress(requestID: string): number {
  if (hasOwnProperty(dataReceivingProgress, requestID)) {
    if (typeof dataReceivingProgress[requestID] === 'object') {
      let total: number = 0;
      let received: number = 0;
      for (const key in dataReceivingProgress[requestID]) {
        if (!dataReceivingProgress[requestID][key].expel) {
          total += dataReceivingProgress[requestID][key].total;
          received += dataReceivingProgress[requestID][key].progress;
        }
      }
      const progress = Math.min(Math.max(received / total, 0), 1);
      return progress === Infinity || isNaN(progress) ? 1 : progress;
    }
  }
  return 1;
}

export function deleteDataReceivingProgress(requestID: string): void {
  if (hasOwnProperty(dataReceivingProgress, requestID)) {
    delete dataReceivingProgress[requestID];
    broadcastDataReceivingProgress(requestID, 'end');
  }
}

export interface DataReceivingProgressEventDict {
  target: string;
  stage: 'start' | 'run' | 'end';
  progress: number;
}

export type DataReceivingProgressEvent = CustomEvent<DataReceivingProgressEventDict>;

export function broadcastDataReceivingProgress(requestID: string, stage: DataReceivingProgressEventDict['stage']): void {
  const eventDict: DataReceivingProgressEventDict = {
    target: requestID,
    stage: stage,
    progress: getDataReceivingProgress(requestID)
  };
  const event = new CustomEvent(requestID, { detail: eventDict });
  document.dispatchEvent(event);
}

export type DataUpdateTime = { [key: string]: number };

export const dataUpdateTime: DataUpdateTime = {};

export function setDataUpdateTime(requestID: string, timestamp: string | number): void {
  if (!hasOwnProperty(dataUpdateTime, requestID)) {
    dataUpdateTime[requestID] = 0;
  }
  let timeNumber = 0;
  if (typeof timestamp === 'string') {
    timeNumber = timeStampToNumber(timestamp);
  }
  if (timeNumber > dataUpdateTime[requestID]) {
    dataUpdateTime[requestID] = timeNumber;
  }
}

export function getDataUpdateTime(requestID: string): number {
  if (hasOwnProperty(dataUpdateTime, requestID)) {
    return dataUpdateTime[requestID] * 1;
  } else {
    return 0;
  }
}

export function deleteDataUpdateTime(requestID: string): void {
  if (hasOwnProperty(dataUpdateTime, requestID)) {
    delete dataUpdateTime[requestID];
  }
}
