import { generateIdentifier } from '../../../tools/index';
import { findGlobalExtremum } from '../../../tools/math';
import { WeekDayIndex } from '../../../tools/time';
import { EstimateTime } from '../../apis/getEstimateTime/index';
import { listAllFolderContent } from '../../folder/index';
import { isInPersonalSchedule, listPersonalSchedules, PersonalSchedule } from '../../personal-schedule/index';
import { lfGetItem, lfListItemKeys, lfRemoveItem, lfSetItem } from '../../storage/index';

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
  chart: string; // svg
  day: WeekDayIndex;
}

export interface BusArrivalTimes {
  [stopKey: string]: Array<BusArrivalTime>;
}

const getBusArrivalTimeDataStatsWorkerResponses = {};
let getBusArrivalTimeDataStatsPort;

// Check if SharedWorker is supported, and fall back to Worker if not
if (typeof SharedWorker !== 'undefined') {
  const getBusArrivalTimeDataStatsWorker = new SharedWorker(new URL('./getBusArrivalTimeDataStats-worker.ts', import.meta.url)); // Reusable shared worker
  getBusArrivalTimeDataStatsPort = getBusArrivalTimeDataStatsWorker.port; // Access the port for communication
  getBusArrivalTimeDataStatsPort.start(); // Start the port (required by some browsers)
} else {
  const getBusArrivalTimeDataStatsWorker = new Worker(new URL('./getBusArrivalTimeDataStats-worker.ts', import.meta.url)); // Fallback to standard worker
  getBusArrivalTimeDataStatsPort = getBusArrivalTimeDataStatsWorker; // Use Worker directly for communication
}

// Handle messages from the worker
getBusArrivalTimeDataStatsPort.onmessage = function (e) {
  const [result, taskID] = e.data;
  if (getBusArrivalTimeDataStatsWorkerResponses[taskID]) {
    getBusArrivalTimeDataStatsWorkerResponses[taskID](result); // Resolve the correct promise
    delete getBusArrivalTimeDataStatsWorkerResponses[taskID]; // Clean up the response handler
  }
};

// Handle errors
getBusArrivalTimeDataStatsPort.onerror = function (e) {
  console.error(e.message);
};

async function getBusArrivalTimeDataStats(data: Array<BusArrivalTimeData>): Promise<BusArrivalTimeDataGroupStats> {
  const taskID = generateIdentifier();

  const result = await new Promise((resolve, reject) => {
    getBusArrivalTimeDataStatsWorkerResponses[taskID] = resolve; // Store the resolve function for this taskID
    getBusArrivalTimeDataStatsPort.onerror = function (e) {
      reject(e.message);
    };
    getBusArrivalTimeDataStatsPort.postMessage([data, taskID]); // Send the task to the worker
  });
  return result;
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
        if (!busArrivalTimeData_writeAheadLog_group.data.hasOwnProperty(stopKey)) {
          busArrivalTimeData_writeAheadLog_group.data[stopKey] = [];
        }
        busArrivalTimeData_writeAheadLog_group.data[stopKey].push([parseInt(item.EstimateTime), currentTimestamp]);
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
          const newStats = getBusArrivalTimeDataStats(data);
          const mergedStats = mergeBusArrivalTimeDataStats(existingDataObject.stats, newStats);
          dataGroup.stats = mergedStats;
          const mergedExtremum = findGlobalExtremum(mergedStats);
          dataGroup.min = mergedExtremum[0];
          dataGroup.max = mergedExtremum[1];
          dataGroup.day = currentDay;
          dataGroup.timestamp = existingDataObject.timestamp;
          dataGroup.id = stopID;
        } else {
          const newStats = getBusArrivalTimeDataStats(data);
          dataGroup.stats = newStats;
          const newExtremum = findGlobalExtremum(newStats);
          dataGroup.min = newExtremum[0];
          dataGroup.max = newExtremum[1];
          dataGroup.day = currentDay;
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
  const now = new Date();
  const currentTimestamp = now.getTime();
  const currentDay = now.getDay();
  const keys = await lfListItemKeys(5);
  for (const key of keys) {
    const json = await lfGetItem(5, key);
    const object = JSON.parse(json) as BusArrivalTimeDataWriteAheadLog;
    const thisID = object.id;
    for (const stopKey in object.data) {
      const thisStopData = object.data[stopKey];
      const dataGroup = {} as BusArrivalTimeDataGroup;
      const existingData = await lfGetItem(6, stopKey);
      const stopID = parseInt(stopKey.split('_')[1]);
      if (existingData) {
        const existingDataObject = JSON.parse(existingData) as BusArrivalTimeDataGroup;
        const newStats = getBusArrivalTimeDataStats(thisStopData);
        const mergedStats = mergeBusArrivalTimeDataStats(existingDataObject.stats, newStats);
        dataGroup.stats = mergedStats;
        const newExtremum = findGlobalExtremum(mergedStats);
        dataGroup.min = newExtremum[0];
        dataGroup.max = newExtremum[1];
        dataGroup.day = existingDataObject.day;
        dataGroup.timestamp = existingDataObject.timestamp;
        dataGroup.id = stopID;
      } else {
        const newStats = getBusArrivalTimeDataStats(thisStopData);
        dataGroup.stats = newStats;
        const newExtremum = findGlobalExtremum(newStats);
        dataGroup.min = newExtremum[0];
        dataGroup.max = newExtremum[1];
        dataGroup.day = currentDay;
        dataGroup.timestamp = currentTimestamp;
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
      const object = JSON.parse(json) as BusArrivalTimeDataGroup;
      result.push(object);
    }
  }
  return result;
}

const getBusArrivalTimesWorkerResponses = {};
let getBusArrivalTimesPort;

// Check if SharedWorker is supported, and fall back to Worker if not
if (typeof SharedWorker !== 'undefined') {
  const getUpdateRateSharedWorker = new SharedWorker(new URL('./getBusArrivalTimes-worker.ts', import.meta.url)); // Reusable shared worker
  getBusArrivalTimesPort = getUpdateRateSharedWorker.port; // Access the port for communication
  getBusArrivalTimesPort.start(); // Start the port (required by some browsers)
} else {
  const getUpdateRateWorker = new Worker(new URL('./getBusArrivalTimes-worker.ts', import.meta.url)); // Fallback to standard worker
  getBusArrivalTimesPort = getUpdateRateWorker; // Use Worker directly for communication
}

// Handle messages from the worker
getBusArrivalTimesPort.onmessage = function (e) {
  const [result, taskID] = e.data;
  if (getBusArrivalTimesWorkerResponses[taskID]) {
    getBusArrivalTimesWorkerResponses[taskID](result); // Resolve the correct promise
    delete getBusArrivalTimesWorkerResponses[taskID]; // Clean up the response handler
  }
};

// Handle errors
getBusArrivalTimesPort.onerror = function (e) {
  console.error(e.message);
};

export async function getBusArrivalTimes(chartWidth: number, chartHeight: number): Promise<BusArrivalTimes> {
  const taskID = generateIdentifier();

  const personalSchedules = await listPersonalSchedules();
  const busArrivalTimeDataGroups = await listBusArrivalTimeDataGroups();

  const result = await new Promise((resolve, reject) => {
    getBusArrivalTimesWorkerResponses[taskID] = resolve; // Store the resolve function for this taskID
    getBusArrivalTimesPort.onerror = function (e) {
      reject(e.message);
    };
    getBusArrivalTimesPort.postMessage([personalSchedules, busArrivalTimeDataGroups, chartWidth, chartHeight, taskID]); // Send the task to the worker
  });
  return result;
}
