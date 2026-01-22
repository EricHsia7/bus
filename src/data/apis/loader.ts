import { pakoInflate } from '../../tools/pako-inflate/index';
import { timeStampToNumber } from '../../tools/time';
import { recordDataUsage } from '../analytics/data-usage/index';

const tasks: {
  [url: string]: {
    processing: boolean;
    resolves: Array<Function>;
    rejects: Array<Function>;
  };
} = {};

async function fetchData(url: string) {
  if (tasks.hasOwnProperty(url)) {
    if (tasks[url].processing) {
      return await new Promise((resolve, reject) => {
        tasks[url].resolves.push(resolve);
        tasks[url].rejects.push(reject);
      });
    }
  } else {
    tasks[url] = {
      processing: true,
      resolves: [],
      rejects: []
    };
  }

  // fetch data

  // if successful
  const result = {};
  if (tasks.hasOwnProperty(url)) {
    let resolve = tasks[url].resolves.shift();
    while (resolve) {
      resolve(result);
      resolve = tasks[url].resolves.shift();
    }
    tasks[url].processing = false;
  }
  // return result;
  // else
  if (tasks.hasOwnProperty(url)) {
    for (const reject of tasks[url].rejects) {
      reject(false);
    }
  }

  return false;
}

export async function fetchData(url: string, requestID: string, tag: string, fileType: 'json' | 'xml'): Promise<object> {
  const FetchError = new Error('FetchError');
  const now = new Date();

  // Check concurrency
  if (tasks.hasOwnProperty(url)) {
    if (tasks[url].processing) {
      return await new Promise((resolve, reject) => {
        tasks[url].resolves.push(resolve);
        tasks[url].rejects.push(reject);
      });
    }
  } else {
    tasks[url] = {
      processing: true,
      resolves: [],
      rejects: []
    };
  }

  // Fetch data
  const response = await fetch(url);
  if (!response.ok) {
    setDataReceivingProgress(requestID, tag, 0, true);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentLength = parseInt(String(response.headers.get('content-length')));
  const reader = response.body.getReader();
  const chunks = [];

  // Loop to read chunks
  let receivedLength = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
    receivedLength += value.length;
    setDataReceivingProgress(requestID, tag, receivedLength / contentLength, false);
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
  await recordDataUsage(contentLength, now);
  if (result) {
    if (tasks.hasOwnProperty(url)) {
      let resolve = tasks[url].resolves.shift();
      while (resolve) {
        resolve(result);
        resolve = tasks[url].resolves.shift();
      }
      delete tasks[url];
    }
    return result;
  } else {
    if (tasks.hasOwnProperty(url)) {
      let reject = tasks[url].rejects.shift();
      while (reject) {
        reject(FetchError);
        reject = tasks[url].rejects.shift();
      }
      delete tasks[url];
    }
    throw FetchError;
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
  if (!dataReceivingProgress.hasOwnProperty(requestID)) {
    dataReceivingProgress[requestID] = {};
  }
  const tagKey = `t_${tag}`;
  if (dataReceivingProgress[requestID].hasOwnProperty(tagKey)) {
    if (expel) {
      dataReceivingProgress[requestID][tagKey].expel = true;
    } else {
      dataReceivingProgress[requestID][tagKey].expel = false;
      dataReceivingProgress[requestID][tagKey].progress = progress;
    }
    broadcastDataReceivingProgress(requestID, 'run');
  } else {
    dataReceivingProgress[requestID][tagKey] = { expel: false, progress: progress, total: 1 };
    broadcastDataReceivingProgress(requestID, 'start');
  }
}

export function getDataReceivingProgress(requestID: string): number {
  if (dataReceivingProgress.hasOwnProperty(requestID)) {
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
  if (dataReceivingProgress.hasOwnProperty(requestID)) {
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

export function setDataUpdateTime(requestID: string, timeStamp: string | number): void {
  if (!dataUpdateTime.hasOwnProperty(requestID)) {
    dataUpdateTime[requestID] = 0;
  }
  let timeNumber = 0;
  if (typeof timeStamp === 'string') {
    timeNumber = timeStampToNumber(timeStamp);
  }
  if (timeNumber > dataUpdateTime[requestID]) {
    dataUpdateTime[requestID] = timeNumber;
  }
}

export function getDataUpdateTime(requestID: string): number {
  if (dataUpdateTime.hasOwnProperty(requestID)) {
    return dataUpdateTime[requestID] * 1;
  } else {
    return 0;
  }
}

export function deleteDataUpdateTime(requestID: string): void {
  if (dataUpdateTime.hasOwnProperty(requestID)) {
    delete dataUpdateTime[requestID];
  }
}
