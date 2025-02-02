import { pakoInflate } from '../../tools/pako-inflate/index';
import { timeStampToNumber } from '../../tools/time';
import { recordRequest } from '../analytics/data-usage';

let dataReceivingProgress = {};

export type DataUpdateTime = { [key: string]: number };

export let dataUpdateTime: DataUpdateTime = {};

export async function fetchData(url: string, requestID: string, tag: string, fileType: 'json' | 'xml', connectionTimeoutDuration: number = 15 * 1000, loadingTimeoutDuration: number = 60 * 1000): Promise<object> {
  const startTimeStamp = new Date().getTime();

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

  const endTimeStamp = new Date().getTime();
  await recordRequest(requestID, { end_time: endTimeStamp, start_time: startTimeStamp, content_length: contentLength }, receivedLength < contentLength);

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

export function getDataReceivingProgress(requestID: string): number {
  if (dataReceivingProgress.hasOwnProperty(requestID)) {
    if (typeof dataReceivingProgress[requestID] === 'object') {
      var total = 0;
      var received = 0;
      for (var key in dataReceivingProgress[requestID]) {
        if (!dataReceivingProgress[requestID][key].expel) {
          total += dataReceivingProgress[requestID][key].total;
          received += dataReceivingProgress[requestID][key].progress;
        }
      }
      var progress = Math.min(Math.max(received / total, 0), 1);
      return progress === Infinity || isNaN(progress) ? 1 : progress;
    }
  }
  return 1;
}

export function setDataReceivingProgress(requestID: string, tag: string, progress: number, expel: boolean): void {
  if (!dataReceivingProgress.hasOwnProperty(requestID)) {
    dataReceivingProgress[requestID] = {};
  }
  const key = `u_${tag}`;
  if (dataReceivingProgress[requestID].hasOwnProperty(key)) {
    if (expel) {
      dataReceivingProgress[requestID][key].expel = true;
    } else {
      dataReceivingProgress[requestID][key].expel = false;
      dataReceivingProgress[requestID][key].progress = progress;
    }
  } else {
    dataReceivingProgress[requestID][key] = { expel: false, progress: progress, total: 1 };
  }
}

export function deleteDataReceivingProgress(requestID: string): void {
  if (dataReceivingProgress.hasOwnProperty(requestID)) {
    delete dataReceivingProgress[requestID];
  }
}

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
