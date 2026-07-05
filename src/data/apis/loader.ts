import { hasOwnProperty } from '../../tools/index';
import { clamp } from '../../tools/math';
import { timeStampToNumber } from '../../tools/time';
import { recordDataUsage } from '../analytics/data-usage/index';

export interface LoaderMessageProgress {
  type: 'progress';
  id: number;
  loaded: number;
  total: number;
  percent: number;
}

export interface LoaderMessageData {
  type: 'data';
  id: number;
  chunk: Uint8Array;
  final: boolean;
}

export interface LoaderMessageDone {
  type: 'done';
  id: number;
  loaded: number;
  total: number;
}

export interface LoaderMessageError {
  type: 'error';
  id: number;
  error: Error['message'];
}

export type LoaderMessage = LoaderMessageProgress | LoaderMessageData | LoaderMessageDone | LoaderMessageError;

export interface LoaderJob {
  resolve: Function;
  reject: Function;
  onProgress: Function;
  chunks: Array<Uint8Array>;
}

const worker = new Worker(new URL('./loader-worker.ts', import.meta.url));

let nextId: number = 0;
const pending = new Map<number, LoaderJob>();

worker.onmessage = (event: MessageEvent) => {
  const msg = event.data as LoaderMessage;
  const job = pending.get(msg.id);
  if (!job) return;

  switch (msg.type) {
    case 'progress':
      job.onProgress?.(msg);
      break;
    case 'data':
      job.chunks.push(msg.chunk); // inflated Uint8Array
      break;
    case 'done':
      pending.delete(msg.id);
      recordDataUsage(msg.loaded, new Date());
      job.resolve(concatChunks(job.chunks));
      break;
    case 'error':
      pending.delete(msg.id);
      job.reject(new Error(msg.error));
      break;
  }
};

worker.onerror = (e) => console.error('Worker crashed:', e.message);

function concatChunks(chunks: Array<Uint8Array>): Uint8Array {
  const size = chunks.reduce((n, c) => n + c.length, 0);
  const result = new Uint8Array(size);
  let pos = 0;
  for (const chunk of chunks) {
    result.set(chunk, pos);
    pos += chunk.length;
  }
  return result;
}

/**
 * fetch a url, and inflate the response
 * @param url URL to fetch
 * @param onProgress function called on progress
 * @returns inflated Uint8Array
 */
export function fetchInflate(url: string, onProgress: (message: LoaderMessageProgress) => void): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject, onProgress, chunks: [] });
    worker.postMessage({ id, url });
  });
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
      const progress = clamp(received / total, 0, 1);
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

export function setDataUpdateTime(requestID: string, timestamp: string | number, timeZoneOffset: number): void {
  if (!hasOwnProperty(dataUpdateTime, requestID)) {
    dataUpdateTime[requestID] = 0;
  }
  let timeNumber = 0;
  if (typeof timestamp === 'string') {
    timeNumber = timeStampToNumber(timestamp, timeZoneOffset);
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
