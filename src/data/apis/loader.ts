import { pakoInflate } from '../../tools/pako-inflate/index';
import { timeStampToNumber } from '../../tools/time';
import { recordDataUsage } from '../analytics/data-usage/index';

export async function fetchData(url: string, requestID: string, tag: string, fileType: 'json' | 'xml', connectionTimeoutDuration: number = 15 * 1000, loadingTimeoutDuration: number = 60 * 1000): Promise<object> {
  // Create a connection timeout promise
  const connectionTimeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timed out')), connectionTimeoutDuration));

  // Race between fetch and connection timeout
  const response = await Promise.race([fetch(url), connectionTimeoutPromise]).catch((error) => {
    // Handle connection timeout error
    setDataReceivingProgress(requestID, tag, 0, true);
    throw error;
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentLength = parseInt(String(response.headers.get('content-length')));
  let receivedLength = 0;
  const reader = response.body.getReader();
  const chunks = [];

  // A utility function to read chunks with loading timeout
  const readChunk = () => {
    return new Promise(async (resolve, reject) => {
      const loadingTimeout = setTimeout(() => {
        reject(new Error('Loading timed out'));
      }, loadingTimeoutDuration);

      const { done, value } = await reader.read();
      clearTimeout(loadingTimeout);

      if (done) {
        resolve({ done });
      } else {
        resolve({ done, value });
      }
    });
  };

  // Loop to read chunks with loading timeout for each chunk
  while (true) {
    const { done, value } = await readChunk().catch((error) => {
      // Handle loading timeout error
      setDataReceivingProgress(requestID, tag, receivedLength / contentLength, true);
      throw error;
    });

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

  const now = new Date();
  await recordDataUsage(contentLength, now);

  // Create a blob from the concatenated Uint8Array
  const blob = new Blob([uint8Array]);
  const gzip_blob = new Blob([blob.slice(0, blob.size)], { type: 'application/gzip' });
  const buffer = await gzip_blob.arrayBuffer();
  const inflatedData = await pakoInflate(buffer);

  if (fileType === 'json') {
    if (/^\<\!doctype html\>/.test(inflatedData)) {
      const alternativeData = await fetchData(url.replace('https://tcgbusfs.blob.core.windows.net/', 'https://erichsia7.github.io/bus-alternative-static-apis/'), requestID, tag, fileType, connectionTimeoutDuration, loadingTimeoutDuration);
      return alternativeData;
    } else {
      return JSON.parse(inflatedData);
    }
  }

  if (fileType === 'xml') {
    return inflatedData;
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

export let dataUpdateTime: DataUpdateTime = {};

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
