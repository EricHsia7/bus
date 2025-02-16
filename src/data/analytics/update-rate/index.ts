import { generateIdentifier } from '../../../tools/index';
import { lfSetItem, lfGetItem, lfListItemKeys, lfRemoveItem } from '../../storage/index';
import { EstimateTime } from '../../apis/getEstimateTime/index';
import { mergePearsonCorrelation, mergeStandardDeviation } from '../../../tools/math';

export type UpdateRateData = [number, number]; // EstimateTime, timestamp

export interface UpdateRateDataGroupStats {
  estimate_time: {
    average: number;
    stdev: number;
  };
  timestamp: {
    average: number;
    stdev: number;
  };
  correlation: number;
  length: number;
}

export interface UpdateRateDataGroup {
  data: Array<UpdateRateData>;
  stats: UpdateRateDataGroupStats;
  flattened: boolean;
  timestamp: number;
  id: number; // stop id
}

export interface UpdateRateDataWriteAheadLogGroup {
  data: Array<UpdateRateData>;
  timestamp: number;
  id: string;
}

const updateRateData_sampleQuantity: number = 64;
let updateRateData_trackedStops: Array<number> = [];
let updateRateData_writeAheadLog_id: string = '';
let updateRateData_writeAheadLog_tracking: boolean = false;
let updateRateData_writeAheadLog_currentDataLength: number = 0;
const updateRateData_writeAheadLog_maxDataLength: number = 90;
let updateRateData_writeAheadLog_group: UpdateRateDataWriteAheadLogGroup = {
  data: {},
  timestamp: 0,
  id: ''
};

function getUpdateRateDataStats(data: Array<UpdateRateData>): UpdateRateDataGroupStats {
  let sumEstimateTime = 0;
  let sumEstimateTimeSquared = 0;
  let sumTimestamp = 0;
  let sumTimestampSquared = 0;
  let dataLength = 0;
  for (const item of data) {
    const estimateTime = item[0];
    const timestamp = item[1];
    dataLength += 1;
    sumEstimateTime += estimateTime;
    sumTimestamp += timestamp;
    sumEstimateTimeSquared += Math.pow(estimateTime, 2);
    sumTimestampSquared += Math.pow(timestamp, 2);
  }

  const averageEstimateTime = sumEstimateTime / dataLength;
  const averageTimestamp = sumTimestamp / dataLength;

  const estimateTimeVariance = sumEstimateTimeSquared / dataLength - Math.pow(averageEstimateTime, 2);
  const timestampVariance = sumTimestampSquared / dataLength - Math.pow(averageTimestamp, 2);

  const estimateTimeSTDEV = Math.sqrt(estimateTimeVariance);
  const timestampSTDEV = Math.sqrt(timestampVariance);

  let covariance = 0;
  for (const item2 of data) {
    const estimateTime = item2[0];
    const timestamp = item2[1];
    covariance += (estimateTime - averageEstimateTime) * (timestamp - averageTimestamp);
  }
  covariance /= dataLength;

  const correlation = covariance / (estimateTimeSTDEV * timestampSTDEV);

  const result: UpdateRateDataGroupStats = {
    estimate_time: {
      average: averageEstimateTime,
      stdev: estimateTimeSTDEV
    },
    timestamp: {
      average: averageTimestamp,
      stdev: timestampSTDEV
    },
    length: dataLength,
    correlation: correlation
  };
  return result;
}

function mergeUpdateRateDataStats(targetStats: UpdateRateDataGroupStats, sourceStats: UpdateRateDataGroupStats): UpdateRateDataGroupStats {
  const mergedDataLength = targetStats.length + sourceStats.length;

  const mergedAverageEstimateTime = (targetStats.estimate_time.average * targetStats.length + sourceStats.estimate_time.average * sourceStats.length) / mergedDataLength;
  const mergedAverageTimestamp = (targetStats.timestamp.average * targetStats.length + sourceStats.timestamp.average * sourceStats.length) / mergedDataLength;

  const mergedEstimateTimeSTDEV = mergeStandardDeviation(targetStats.estimate_time.average, targetStats.estimate_time.stdev, targetStats.length, sourceStats.estimate_time.average, sourceStats.estimate_time.stdev, sourceStats.length);
  const mergedTimestampSTDEV = mergeStandardDeviation(targetStats.timestamp.average, targetStats.timestamp.stdev, targetStats.length, sourceStats.timestamp.average, sourceStats.timestamp.stdev, sourceStats.length);

  const mergedCorrelation = mergePearsonCorrelation(targetStats.estimate_time.average, targetStats.timestamp.average, targetStats.estimate_time.stdev, targetStats.timestamp.stdev, targetStats.length, targetStats.correlation, sourceStats.estimate_time.average, sourceStats.timestamp.average, sourceStats.estimate_time.stdev, sourceStats.timestamp.stdev, sourceStats.length, sourceStats.correlation);

  const result: UpdateRateDataGroupStats = {
    estimate_time: {
      average: mergedAverageEstimateTime,
      stdev: mergedEstimateTimeSTDEV
    },
    timestamp: {
      average: mergedAverageTimestamp,
      stdev: mergedTimestampSTDEV
    },
    length: mergedDataLength,
    correlation: mergedCorrelation
  };
  return result;
}

export async function collectUpdateRateData(EstimateTime: EstimateTime) {
  const now = new Date();
  const currentTimestamp: number = now.getTime();
  let needToReset = false;
  // Initialize
  if (!updateRateData_writeAheadLog_tracking) {
    updateRateData_writeAheadLog_tracking = true;
    updateRateData_trackedStops = [];
    updateRateData_writeAheadLog_id = generateIdentifier('u');
    updateRateData_writeAheadLog_group = {
      data: {},
      timestamp: currentTimestamp,
      id: updateRateData_writeAheadLog_id
    };
    updateRateData_writeAheadLog_currentDataLength = 0;
    const EstimateTimeLength1: number = EstimateTime.length - 1;
    for (let i = 0; i < updateRateData_sampleQuantity; i++) {
      const randomIndex: number = Math.floor(Math.random() * EstimateTimeLength1);
      const randomItem = EstimateTime[randomIndex];
      updateRateData_trackedStops.push(randomItem.StopID);
    }
  }

  // Record EstimateTime
  for (const item of EstimateTime) {
    const stopID = item.StopID;
    const stopKey = `s_${stopID}`;
    if (updateRateData_trackedStops.indexOf(stopID) > -1) {
      if (!updateRateData_writeAheadLog_group.data.hasOwnProperty(stopKey)) {
        updateRateData_writeAheadLog_group.data[stopKey] = [];
      }
      updateRateData_writeAheadLog_group.data[stopKey].push([parseInt(item.EstimateTime), Math.floor((currentTimestamp - updateRateData_writeAheadLog_group.timestamp) / 1000)]);
      updateRateData_writeAheadLog_currentDataLength += 1;
      if (updateRateData_writeAheadLog_currentDataLength > updateRateData_writeAheadLog_maxDataLength) {
        needToReset = true;
      }
    }
  }

  if (updateRateData_writeAheadLog_currentDataLength % 15 === 0) {
    await lfSetItem(4, updateRateData_writeAheadLog_id, JSON.stringify(updateRateData_writeAheadLog_group));
  }

  if (needToReset) {
    for (const stopID of updateRateData_trackedStops) {
      const stopKey = `s_${stopID}`;
      const data = updateRateData_writeAheadLog_group.data[stopKey];
      let dataGroup = {} as UpdateRateDataGroup;
      const existingData = await lfGetItem(3, stopKey);
      if (existingData) {
        const existingDataObject = JSON.parse(existingData) as UpdateRateDataGroup;
        dataGroup.data = existingDataObject.data.concat(data);
        dataGroup.stats = mergeUpdateRateDataStats(existingDataObject.stats, getUpdateRateDataStats(data));
        dataGroup.flattened = existingDataObject.flattened;
        dataGroup.timestamp = existingDataObject.timestamp;
        dataGroup.id = stopID;
      } else {
        dataGroup.data = data;
        dataGroup.stats = getUpdateRateDataStats(data);
        dataGroup.flattened = false;
        dataGroup.timestamp = currentTimestamp;
        dataGroup.id = stopID;
      }
      await lfSetItem(3, stopKey, JSON.stringify(dataGroup));
      await lfRemoveItem(4, updateRateData_writeAheadLog_id);
    }

    updateRateData_writeAheadLog_tracking = false;
  }
}

export async function recoverUpdateRateDataFromWriteAheadLog() {
  const now = new Date().getTime();
  const oneWeekAgo = now - 60 * 60 * 7 * 1000;
  const keys = await lfListItemKeys(4);
  for (const key of keys) {
    const json = await lfGetItem(4, key);
    const object = JSON.parse(json) as UpdateRateDataWriteAheadLogGroup;
    const thisTimestamp = object.timestamp;
    const thisID = object.id;
    if (thisTimestamp > oneWeekAgo) {
      for (const stopKey in object) {
        const thisStopData = object[stopKey];
        let dataGroup = {} as UpdateRateDataGroup;
        const existingData = await lfGetItem(3, stopKey);
        if (existingData) {
          const existingDataObject = JSON.parse(existingData) as UpdateRateDataGroup;
          dataGroup.data = existingDataObject.data.concat(thisStopData);
          dataGroup.stats = mergeUpdateRateDataStats(existingDataObject.stats, getUpdateRateDataStats(thisStopData));
          dataGroup.flattened = existingDataObject.flattened;
          dataGroup.timestamp = existingDataObject.timestamp;
          dataGroup.id = stopID;
        } else {
          dataGroup.data = thisStopData;
          dataGroup.stats = getUpdateRateDataStats(thisStopData);
          dataGroup.flattened = false;
          dataGroup.timestamp = currentTimestamp;
          dataGroup.id = stopID;
        }
        await lfSetItem(3, stopKey, JSON.stringify(dataGroup));
        await lfRemoveItem(4, thisID);
      }
    }
  }
}

async function listUpdateRateDataGroups(): Promise<Array<UpdateRateDataGroup>> {
  const now = new Date().getTime();
  const oneWeekAgo = now - 60 * 60 * 7 * 1000;
  const keys = await lfListItemKeys(3);
  let result: Array<UpdateRateDataGroup> = [];
  for (const key of keys) {
    const json = await lfGetItem(3, key);
    const object = JSON.parse(json) as UpdateRateDataGroup;
    const thisTimestamp = object.timestamp;
    if (thisTimestamp > oneWeekAgo) {
      result.push(object);
    }
  }
  return result;
}

export async function discardExpiredUpdateRateDataGroups() {
  const now = new Date().getTime();
  const oneWeekAgo = now - 60 * 60 * 7 * 1000;
  const keys = await lfListItemKeys(3);
  for (const key of keys) {
    const json = await lfGetItem(3, key);
    const object = JSON.parse(json) as UpdateRateDataGroup;
    const thisTimestamp = object.timestamp;
    if (thisTimestamp <= oneWeekAgo) {
      await lfRemoveItem(3, key);
    }
  }
}

let getUpdateRateWorkerResponses = {};
var port;

// Check if SharedWorker is supported, and fall back to Worker if not
if (typeof SharedWorker !== 'undefined') {
  const getUpdateRateSharedWorker = new SharedWorker(new URL('./getUpdateRate_worker.ts', import.meta.url)); // Reusable shared worker
  port = getUpdateRateSharedWorker.port; // Access the port for communication
  port.start(); // Start the port (required by some browsers)
} else {
  const getUpdateRateWorker = new Worker(new URL('./getUpdateRate_worker.ts', import.meta.url)); // Fallback to standard worker
  port = getUpdateRateWorker; // Use Worker directly for communication
}

// Handle messages from the worker
port.onmessage = function (e) {
  const [result, taskID] = e.data;
  if (getUpdateRateWorkerResponses[taskID]) {
    getUpdateRateWorkerResponses[taskID](result); // Resolve the correct promise
    delete getUpdateRateWorkerResponses[taskID]; // Clean up the response handler
  }
};

// Handle errors
port.onerror = function (e) {
  console.error(e.message);
};

export async function getUpdateRate(): Promise<number> {
  const dataGroups = await listUpdateRateDataGroups();
  const taskID = generateIdentifier('t');

  const result = await new Promise((resolve, reject) => {
    getUpdateRateWorkerResponses[taskID] = resolve; // Store the resolve function for this taskID

    port.onerror = function (e) {
      reject(e.message);
    };

    port.postMessage([dataGroups, taskID]); // Send the task to the worker
  });

  return result;
}

/*
export async function getUpdateRateInTime(): Promise<string> {
  let totalWeight: number = 0;
  let totalAverageChange: number = 0;
  let weightedAverageChange: number = 0;
  const dataGroup = await listUpdateRateDataGroups();
  for (const dataSet of dataGroup) {
    const groups = splitDataByDelta(dataSet);
    for (const group of groups) {
      const firstColumn: Array<number> = group.map((item) => item[0]);
      const secondColumn: Array<number> = group.map((item) => item[1]);
      const rowCount: number = firstColumn.length;
      let timeStampUponChanges: Array<number> = [];
      for (let i = 1; i < rowCount; i++) {
        const change: number = Math.abs(firstColumn[i] - firstColumn[i - 1]);
        if (change > 0) {
          timeStampUponChanges.push(secondColumn[i]);
        }
      }
      const timeStampUponChangesLength: number = timeStampUponChanges.length;
      let totalChange: number = 0;
      let average: number = 0;
      for (let i = 1; i < timeStampUponChangesLength; i++) {
        const change: number = Math.abs(timeStampUponChanges[i] - timeStampUponChanges[i - 1]); // measured in seconds
        totalChange += change;
      }
      average = totalChange / (timeStampUponChangesLength - 1);
      totalAverageChange += isNaN(average) ? 0 : average * rowCount;
      totalWeight += isNaN(average) ? 0 : rowCount;
    }
  }
  weightedAverageChange = totalAverageChange / totalWeight;
  return isNaN(weightedAverageChange) ? '!' : formatTime(weightedAverageChange, 0);
}
*/
