import { WeekDayIndex, WeeklyArray } from '../../../tools/time';
import { EstimateTime } from '../../apis/getEstimateTime/index';
import { FolderContentStop, listAllFolderContent } from '../../folder/index';
import { isInPersonalSchedule, listPersonalSchedules, PersonalSchedule, PersonalScheduleArray } from '../../personal-schedule/index';
import { lfGetItem, lfListItemKeys, lfSetItem } from '../../storage/index';

/**
 * stop-based record per day
 */
export interface BusArrivalTimeRecord {
  estimate: Int32Array; // estimate time (in seconds)
  time: Uint32Array; // time elapsed (in seconds)
  start: number; // timestamp in milliseconds representing the time when the record starts
  id: number; // stop id
}

export type BusArrivalTimeTrackingList = Array<BusArrivalTimeRecord['id']>;

/**
 * a list of numbers representing the count of predictions per minute
 */
export type BusArrivalTimeStats = Uint32Array;

/**
 * stop-based record per week
 */
export interface BusArrivalTimeStatsGroup {
  stats: WeeklyArray<BusArrivalTimeStats>;
  max: WeeklyArray<number>;
  min: WeeklyArray<number>;
  id: number; // stop id
}

export interface BusArrivalTimeWorkerJob {
  resolve: Function;
  reject: Function;
  type: 'initialize' | 'record' | 'checkout' | 'plot';
}

export interface BusArrivalTimeWorkerRequestInitialize {
  type: 'initialize';
  id: number;
  schedules: PersonalScheduleArray;
  tracking: BusArrivalTimeTrackingList;
  existing: Array<BusArrivalTimeStatsGroup>;
}

export interface BusArrivalTimeWorkerRequestRecord {
  type: 'record';
  id: number;
  records: Array<BusArrivalTimeRecord>;
}

export interface BusArrivalTimeWorkerRequestCheckout {
  type: 'checkout';
  id: number;
}

export interface BusArrivalTimeWorkerRequestPlot {
  type: 'plot';
  id: number;
  width: number;
  height: number;
}

export type BusArrivalTimeWorkerRequest = BusArrivalTimeWorkerRequestInitialize | BusArrivalTimeWorkerRequestRecord | BusArrivalTimeWorkerRequestCheckout | BusArrivalTimeWorkerRequestPlot;

export interface BusArrivalTimeWorkerMessageDoneInitialize {
  type: 'done';
  id: number;
  job: 'initialize';
}

export interface BusArrivalTimeWorkerMessageDoneRecord {
  type: 'done';
  id: number;
  job: 'record';
}

export interface BusArrivalTimeWorkerMessageDoneCheckout {
  type: 'done';
  id: number;
  job: 'checkout';
  result: Array<BusArrivalTimeStatsGroup>;
}

export interface BusArrivalTimeWorkerMessageDonePlot {
  type: 'done';
  id: number;
  job: 'plot';
  result: BusArrivalTimes;
}

export interface BusArrivalTimeWorkerMessageError {
  type: 'error';
  id: number;
  error: Error['message'];
}

export type BusArrivalTimeWorkerMessage = BusArrivalTimeWorkerMessageDoneInitialize | BusArrivalTimeWorkerMessageDoneRecord | BusArrivalTimeWorkerMessageDoneCheckout | BusArrivalTimeWorkerMessageDonePlot | BusArrivalTimeWorkerMessageError;

const worker = new Worker(new URL('./worker.ts', import.meta.url));

let nextId: number = 0;
const pending = new Map<number, BusArrivalTimeWorkerJob>();

worker.onmessage = (event: MessageEvent) => {
  const message = event.data as BusArrivalTimeWorkerMessage;
  const job = pending.get(message.id);
  if (!job) return;
  if (message.type === 'done') {
    switch (message.job) {
      case 'initialize':
        pending.delete(message.id);
        job.resolve(true);
        break;
      case 'record':
        pending.delete(message.id);
        job.resolve(true);
        break;
      case 'checkout':
        pending.delete(message.id);
        job.resolve(message.result);
        break;
      case 'plot':
        pending.delete(message.id);
        job.resolve(message.result);
        break;
    }
  } else {
    pending.delete(message.id);
    job.reject(new Error(message.error));
  }
};

worker.onerror = (e) => console.error('Worker crashed:', e.message);

interface BusArrivalTimeCollection {
  estimate: Array<number>; // estimate time (in seconds)
  time: Array<number>; // time elapsed (in seconds)
  start: number; // timestamp representing the time when the record starts (in seconds)
  id: number; // stop id
}

const DataLength = 8;
const Count = 3;
const collections = new Map<number, BusArrivalTimeCollection>();
let currentDataLength = 0;
let currentCount = 0;

export async function collectBusArrivalTimeData(EstimateTime: EstimateTime) {
  const now = new Date();
  const currentTime = Math.floor(now.getTime() / 1000);
  if (isInPersonalSchedule(now)) {
    for (const item of EstimateTime) {
      const id = item.StopID;
      if (collections.has(id)) {
        const collection = collections.get(id) as BusArrivalTimeCollection;
        collection.estimate.push(parseInt(item.EstimateTime, 10));
        collection.time.push(currentTime - collection.start);
      }
    }
    currentDataLength++;
  }

  if (currentDataLength >= DataLength) {
    const records: Array<BusArrivalTimeRecord> = [];
    for (const collection of collections.values()) {
      records.push({
        estimate: new Int32Array(collection.estimate),
        time: new Uint32Array(collection.time),
        start: collection.start,
        id: collection.id
      });
    }
    await recordBusArrivalTime(records);
    for (const key of collections.keys()) {
      collections.set(key, {
        estimate: [],
        time: [],
        start: currentTime,
        id: key
      });
    }
    currentDataLength = 0;
    currentCount++;
  }

  if (currentCount >= Count) {
    const groups = await checkoutBusArrivalTime();
    await saveBusArrivalTimeStatsGroups(groups);
    currentCount = 0;
  }
}

export async function initializeBusArrivalTime(): Promise<boolean> {
  const now = new Date();
  const currentTime = Math.floor(now.getTime() / 1000);
  const schedules = listPersonalSchedules();
  const stops = (await listAllFolderContent(['stop'])) as Array<FolderContentStop>;
  const tracking = stops.map((e) => e.id);
  const existing = await listBusArrivalTimeStatsGroups();
  const transfer: Array<ArrayBuffer> = [];
  const existingLength = existing.length;
  for (let i = 0; i < existingLength; i++) {
    for (let j = 0; j < 7; j++) {
      transfer.push(existing[i].stats[j].buffer as ArrayBuffer);
    }
  }
  for (const id of tracking) {
    collections.set(id, {
      estimate: [],
      time: [],
      start: currentTime,
      id: id
    });
  }
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject, type: 'initialize' });
    worker.postMessage({ id, type: 'initialize', schedules: schedules, tracking, existing } as BusArrivalTimeWorkerRequestInitialize, transfer);
  });
}

export async function recordBusArrivalTime(records: Array<BusArrivalTimeRecord>): Promise<boolean> {
  const transfer: Array<ArrayBuffer> = [];
  const recordsLength = records.length;
  for (let i = 0; i < recordsLength; i++) {
    transfer.push(records[i].estimate.buffer as ArrayBuffer, records[i].time.buffer as ArrayBuffer);
  }
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject, type: 'record' });
    worker.postMessage({ id, type: 'record', records } as BusArrivalTimeWorkerRequestRecord, transfer);
  });
}

export async function plotBusArrivalTime(width: number, height: number): Promise<BusArrivalTimes> {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject, type: 'plot' });
    worker.postMessage({ id, type: 'plot', width, height } as BusArrivalTimeWorkerRequestPlot);
  });
}

export async function checkoutBusArrivalTime(): Promise<Array<BusArrivalTimeStatsGroup>> {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject, type: 'checkout' });
    worker.postMessage({ id, type: 'checkout' } as BusArrivalTimeWorkerRequestCheckout);
  });
}

export interface BusArrivalTime {
  personalSchedule: PersonalSchedule;
  chart: Uint8Array; // encoded svg string
  state: Int32Array; // deterministic array representing the state of the chart
  day: WeekDayIndex;
}

export interface BusArrivalTimes {
  [stopKey: string]: Array<BusArrivalTime>;
}

export async function listBusArrivalTimeStatsGroups(): Promise<Array<BusArrivalTimeStatsGroup>> {
  const keys = await lfListItemKeys(6);
  const result: Array<BusArrivalTimeStatsGroup> = [];
  for (const key of keys) {
    const json = await lfGetItem(6, key);
    if (json) {
      const object = JSON.parse(json) as BusArrivalTimeStatsGroup;
      for (let i = 0; i < 7; i++) {
        object.stats.splice(i, 1, new Uint32Array(object.stats[i])); // convert to typed array
      }
      result.push(object);
    }
  }
  return result;
}

export async function saveBusArrivalTimeStatsGroups(groups: Array<BusArrivalTimeStatsGroup>) {
  for (const group of groups) {
    for (let i = 0; i < 7; i++) {
      group.stats.splice(i, 1, Array.from(group.stats[i])); // convert to standard array
    }
    await lfSetItem(6, `stop_${group.id}`, JSON.stringify(group));
  }
}
