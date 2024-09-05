import { timeStampToNumber } from '../../tools/time';
import { recordRequest } from '../analytics/data-usage';

let dataReceivingProgress = {};
export let dataUpdateTime = {};

async function pakoInflate(buffer: any): Promise<string> {
  const sharedWorker = new SharedWorker(new URL('./pakoInflate-shared-worker.ts', import.meta.url));

  // Wrap worker communication in a promise
  const result = await new Promise((resolve, reject) => {
    // Open communication with the worker
    sharedWorker.port.start();

    // Listen for the result from the worker
    sharedWorker.port.onmessage = function (event) {
      resolve(event.data); // Resolve the promise with the worker's result

      // Close the port once the result is received
      worker.port.close();
    };

    // Send data to the worker
    sharedWorker.port.postMessage(buffer);
  });

  return result;
}

export async function fetchData(url: string, requestID: string, tag: string, fileType: 'json' | 'xml'): Promise<object> {
  const startTimeStamp = new Date().getTime();
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const contentLength = parseInt(String(response.headers.get('content-length')));
  let receivedLength = 0;
  const reader = response.body.getReader();
  const chunks = [];
  while (true) {
    var { done, value } = await reader.read();
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
  await recordRequest(requestID, { time: endTimeStamp - startTimeStamp, content_length: contentLength });

  // Create a blob from the concatenated Uint8Array
  const blob = new Blob([uint8Array]);
  const gzip_blob = new Blob([blob.slice(0, blob.size)], { type: 'application/gzip' });
  const buffer = await gzip_blob.arrayBuffer();
  const inflatedData = pakoInflate(buffer); // Inflate and convert to string using pako
  if (fileType === 'json') {
    return JSON.parse(inflatedData);
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
  var key = `u_${tag}`;
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
  var timeNumber = 0;
  if (typeof timeStamp === 'string') {
    timeNumber = timeStampToNumber(timeStamp);
  }
  if (timeNumber > dataUpdateTime[requestID]) {
    dataUpdateTime[requestID] = timeNumber;
  }
}

export function deleteDataUpdateTime(requestID: string): void {
  if (dataUpdateTime.hasOwnProperty(requestID)) {
    delete dataUpdateTime[requestID];
  }
}
