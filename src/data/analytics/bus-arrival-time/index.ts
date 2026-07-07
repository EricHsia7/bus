import { generateIdentifier, hasOwnProperty } from '../../../tools/index';
import { findGlobalExtrema } from '../../../tools/math';
import { WeekDayIndex, WeeklyArray } from '../../../tools/time';
import { EstimateTime } from '../../apis/getEstimateTime/index';
import { FolderContentStop, listAllFolderContent } from '../../folder/index';
import { isInPersonalSchedule, listPersonalSchedules, PersonalSchedule, PersonalScheduleArray } from '../../personal-schedule/index';
import { lfGetItem, lfListItemKeys, lfRemoveItem, lfSetItem } from '../../storage/index';
import { getBusArrivalTimeDataStats } from './getBusArrivalTimeDataStats';

const busArrivalTimeData_writeAheadLog_maxDataLength: number = 32;
let busArrivalTimeData_writeAheadLog_id: string = '';
let busArrivalTimeData_writeAheadLog_tracking: boolean = false;
let busArrivalTimeData_trackedStops: Array<number> = [];
let busArrivalTimeData_writeAheadLog_group: BusArrivalTimeDataWriteAheadLog = {
  data: {},
  timestamp: 0,
  id: ''
};
let busArrivalTimeData_writeAheadLog_currentDataLength: number = 0;

/**
 * stop-based record per day
 */
export interface BusArrivalTimeRecord {
  estimate: Int32Array; // estimate time (in seconds)
  time: Uint32Array; // time elapsed (in seconds)
  start: number; // timestamp in milliseconds representing the time when the record starts
  day: WeekDayIndex;
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
  artifact: Array<BusArrivalTimeStatsGroup>;
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
        job.resolve();
        break;
      case 'plot':
        pending.delete(message.id);
        job.resolve();
        break;
    }
  } else {
    pending.delete(message.id);
    job.reject(new Error(message.error));
  }
};

worker.onerror = (e) => console.error('Worker crashed:', e.message);

export async function initializeBusArrivalTime(): Promise<boolean> {
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

export async function plotBusArrivalTime(): Promise<BusArrivalTimes> {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject, type: 'plot' });
    worker.postMessage({ id, type: 'plot' } as BusArrivalTimeWorkerRequestPlot);
  });
}

export async function checkoutBusArrivalTime(): Promise<Array<BusArrivalTimeStatsGroup>> {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject, type: 'checkout' });
    worker.postMessage({ id, type: 'checkout' } as BusArrivalTimeWorkerRequestCheckout);
  });
}

export async function getBusArrivalTimes(chartWidth: number, chartHeight: number): Promise<BusArrivalTimes> {
  const personalSchedules = listPersonalSchedules();
  const busArrivalTimeDataGroups = await listBusArrivalTimeDataGroups();
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    worker.postMessage({ id, personalSchedules, busArrivalTimeDataGroups, chartWidth, chartHeight });
  });
}

export type BusArrivalTimeData = [estimateTime: number, timestamp: number]; // EstimateTime (seconds), timestamp (milliseconds)

export type BusArrivalTimeDataGroupStats = Array<number>;

export interface BusArrivalTimeDataGroup {
  stats: BusArrivalTimeDataGroupStats;
  day: WeekDayIndex;
  max: number;
  min: number;
  timestamp: number;
  id: number; // stop id
}

export type BusArrivalTimeDataGroupArray = Array<BusArrivalTimeDataGroup>;

export interface BusArrivalTimeDataWriteAheadLog {
  data: {
    [key: string]: Array<BusArrivalTimeData>;
  };
  timestamp: number;
  id: string;
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

function mergeBusArrivalTimeDataStats(targetStats: BusArrivalTimeDataGroupStats, sourceStats: BusArrivalTimeDataGroupStats): BusArrivalTimeDataGroupStats {
  const mergedArray = new Uint32Array(60 * 24);
  for (let i = 60 * 24 - 1; i >= 0; i--) {
    mergedArray[i] = targetStats[i] + sourceStats[i];
  }
  return Array.from(mergedArray);
}

export async function collectBusArrivalTimeData(EstimateTime: EstimateTime) {
  const now = new Date();
  const currentTimestamp: number = now.getTime();
  const currentDay = now.getDay();
  let needToReset = false;
  // Initialize
  if (!busArrivalTimeData_writeAheadLog_tracking) {
    busArrivalTimeData_writeAheadLog_tracking = true;
    busArrivalTimeData_writeAheadLog_id = generateIdentifier();
    busArrivalTimeData_writeAheadLog_group = {
      id: busArrivalTimeData_writeAheadLog_id,
      timestamp: currentTimestamp,
      data: {}
    };
    busArrivalTimeData_writeAheadLog_currentDataLength = 0;
    const allFolderContent = await listAllFolderContent(['stop']);
    busArrivalTimeData_trackedStops = allFolderContent.map((e) => e.id);
  }

  // Record EstimateTime
  if (isInPersonalSchedule(now)) {
    for (const item of EstimateTime) {
      const stopID = item.StopID;
      const stopKey = `s_${stopID}_${currentDay}`;
      if (busArrivalTimeData_trackedStops.indexOf(stopID) > -1) {
        if (!hasOwnProperty(busArrivalTimeData_writeAheadLog_group.data, stopKey)) {
          busArrivalTimeData_writeAheadLog_group.data[stopKey] = [];
        }
        busArrivalTimeData_writeAheadLog_group.data[stopKey].push([parseInt(item.EstimateTime, 10), currentTimestamp]);
      }
    }

    busArrivalTimeData_writeAheadLog_currentDataLength += 1;
    if (busArrivalTimeData_writeAheadLog_currentDataLength > busArrivalTimeData_writeAheadLog_maxDataLength) {
      needToReset = true;
    }

    if (needToReset || busArrivalTimeData_writeAheadLog_currentDataLength % 8 === 0) {
      await lfSetItem(5, busArrivalTimeData_writeAheadLog_id, JSON.stringify(busArrivalTimeData_writeAheadLog_group));
    }

    if (needToReset) {
      for (const stopID of busArrivalTimeData_trackedStops) {
        const stopKey = `s_${stopID}_${currentDay}`;
        const data = busArrivalTimeData_writeAheadLog_group.data[stopKey];
        const dataGroup = {} as BusArrivalTimeDataGroup;
        const existingData = await lfGetItem(6, stopKey);
        if (existingData) {
          const existingDataObject = JSON.parse(existingData) as BusArrivalTimeDataGroup;
          const newStats = await getBusArrivalTimeDataStats(data);
          const mergedStats = mergeBusArrivalTimeDataStats(existingDataObject.stats, newStats);
          dataGroup.stats = mergedStats;
          const mergedExtrema = findGlobalExtrema(mergedStats);
          dataGroup.min = mergedExtrema[0];
          dataGroup.max = mergedExtrema[1];
          dataGroup.day = currentDay as WeekDayIndex;
          dataGroup.timestamp = existingDataObject.timestamp;
          dataGroup.id = stopID;
        } else {
          const newStats = await getBusArrivalTimeDataStats(data);
          dataGroup.stats = newStats;
          const newExtrema = findGlobalExtrema(newStats);
          dataGroup.min = newExtrema[0];
          dataGroup.max = newExtrema[1];
          dataGroup.day = currentDay as WeekDayIndex;
          dataGroup.timestamp = currentTimestamp;
          dataGroup.id = stopID;
        }
        await lfSetItem(6, stopKey, JSON.stringify(dataGroup));
        await lfRemoveItem(5, busArrivalTimeData_writeAheadLog_id);
      }
      busArrivalTimeData_writeAheadLog_tracking = false;
    }
  }
}

export async function recoverBusArrivalTimeDataFromWriteAheadLog() {
  const keys = await lfListItemKeys(5);
  for (const key of keys) {
    const json = await lfGetItem(5, key);
    const object = JSON.parse(json) as BusArrivalTimeDataWriteAheadLog;
    const thisID = object.id;
    for (const stopKey in object.data) {
      const thisStopData = object.data[stopKey];
      const dataGroup = {} as BusArrivalTimeDataGroup;
      const existingData = await lfGetItem(6, stopKey);
      const stopKeyComponents = stopKey.split('_');
      const stopID = parseInt(stopKeyComponents[1], 10);
      const day = parseInt(stopKeyComponents[2], 10);
      if (existingData) {
        const existingDataObject = JSON.parse(existingData) as BusArrivalTimeDataGroup;
        const newStats = await getBusArrivalTimeDataStats(thisStopData);
        const mergedStats = mergeBusArrivalTimeDataStats(existingDataObject.stats, newStats);
        dataGroup.stats = mergedStats;
        const newExtremum = findGlobalExtrema(mergedStats);
        dataGroup.min = newExtremum[0];
        dataGroup.max = newExtremum[1];
        dataGroup.day = existingDataObject.day;
        dataGroup.timestamp = existingDataObject.timestamp;
        dataGroup.id = stopID;
      } else {
        const newStats = await getBusArrivalTimeDataStats(thisStopData);
        dataGroup.stats = newStats;
        const newExtremum = findGlobalExtrema(newStats);
        dataGroup.min = newExtremum[0];
        dataGroup.max = newExtremum[1];
        dataGroup.day = day as WeekDayIndex;
        dataGroup.timestamp = object.timestamp;
        dataGroup.id = stopID;
      }
      await lfSetItem(6, stopKey, JSON.stringify(dataGroup));
    }
    await lfRemoveItem(5, thisID);
  }
}

export async function listBusArrivalTimeDataGroups(): Promise<BusArrivalTimeDataGroupArray> {
  const keys = await lfListItemKeys(6);
  const result: BusArrivalTimeDataGroupArray = [];
  for (const key of keys) {
    const json = await lfGetItem(6, key);
    if (json) {
      result.push(JSON.parse(json) as BusArrivalTimeDataGroup);
    }
  }
  return result;
}

export async function listBusArrivalTimeStatsGroups(): Promise<Array<BusArrivalTimeStatsGroup>> {
  const keys = await lfListItemKeys(6);
  const result: Array<BusArrivalTimeStatsGroup> = [];
  for (const key of keys) {
    if (key.startsWith('stop_')) {
      // TODO: create new database
      const json = await lfGetItem(6, key);
      if (json) {
        const object = JSON.parse(json) as BusArrivalTimeStatsGroup;
        for (let i = 0; i < 7; i++) {
          object.stats[i] = new Uint32Array(object.stats[i]); // convert to typed array
        }
        result.push(object);
      }
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
