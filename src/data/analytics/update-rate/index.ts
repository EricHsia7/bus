import { generateIdentifier } from '../../../tools/index';
import { splitDataByDelta } from '../../../tools/array';
import { formatTime } from '../../../tools/time';
import { lfSetItem, lfGetItem, lfListItemKeys, lfRemoveItem } from '../../storage/index';
import { EstimateTime } from '../../apis/getEstimateTime/index';

interface IncompleteRecords {
  trackingID: string;
  timeStamp: number;
  data: {
    [key: string]: { EstimateTime: number; timeStamp: number }[];
  };
}

const trackingUpdateRate_sampleQuantity: number = 64;
const trackingUpdateRate_monitorTimes: number = 90;
let trackingUpdateRate_trackedStops: Array<number> = [];
let trackingUpdateRate_trackingID: string = '';
let trackingUpdateRate_tracking: boolean = false;
let trackingUpdateRate_incompleteRecords: IncompleteRecords = {
  trackingID: '',
  timeStamp: 0,
  data: {}
};
let trackingUpdateRate_currentDataLength: number = 0;

export async function recordEstimateTimeForUpdateRate(EstimateTime: EstimateTime) {
  const now = new Date();
  const currentTimeStamp: number = Math.floor(now.getTime() / 1000);
  let needToReset = false;
  if (!trackingUpdateRate_tracking) {
    trackingUpdateRate_tracking = true;
    trackingUpdateRate_trackedStops = [];
    trackingUpdateRate_trackingID = generateIdentifier('e');
    trackingUpdateRate_incompleteRecords = {
      trackingID: trackingUpdateRate_trackingID,
      timeStamp: new Date().getTime(),
      data: {}
    };
    trackingUpdateRate_currentDataLength = 0;
    const EstimateTimeLength: number = EstimateTime.length - 1;
    for (let i = 0; i < trackingUpdateRate_sampleQuantity; i++) {
      const randomIndex: number = Math.max(Math.min(Math.round(Math.random() * EstimateTimeLength), EstimateTimeLength), 0);
      const randomItem = EstimateTime[randomIndex];
      trackingUpdateRate_trackedStops.push(randomItem.StopID);
    }
  }
  for (const item of EstimateTime) {
    const stopID = item.StopID;
    const stopKey = `s_${stopID}`;
    if (trackingUpdateRate_trackedStops.indexOf(stopID) > -1) {
      if (!trackingUpdateRate_incompleteRecords.data.hasOwnProperty(stopKey)) {
        trackingUpdateRate_incompleteRecords.data[stopKey] = [];
      }
      trackingUpdateRate_incompleteRecords.data[stopKey].push({ EstimateTime: parseInt(item.EstimateTime), timeStamp: currentTimeStamp });
      trackingUpdateRate_currentDataLength += 1;
      if (trackingUpdateRate_currentDataLength > trackingUpdateRate_monitorTimes) {
        needToReset = true;
      }
    }
  }
  if (needToReset || trackingUpdateRate_currentDataLength % 15 === 0) {
    await lfSetItem(3, trackingUpdateRate_trackingID, JSON.stringify(trackingUpdateRate_incompleteRecords));
  }
  if (needToReset) {
    trackingUpdateRate_tracking = false;
  }
}

async function listRecordedEstimateTimeForUpdateRate(): Promise<Array<[number, number]>> {
  const keys = await lfListItemKeys(3);
  let result: Array<[number, number]> = [];
  for (const key of keys) {
    const json = await lfGetItem(3, key);
    const object: IncompleteRecords = JSON.parse(json);
    if (!(new Date().getTime() - object.timeStamp > 60 * 60 * 24 * 7 * 1000)) {
      for (const key2 in object.data) {
        result.push(...object.data[key2].map((item) => [item.EstimateTime, item.timeStamp]));
      }
    }
  }
  return result;
}

export async function discardExpiredEstimateTimeRecordsForUpdateRate() {
  const keys = await lfListItemKeys(3);
  for (const key of keys) {
    const json = await lfGetItem(3, key);
    const object = JSON.parse(json) as IncompleteRecords;
    if (new Date().getTime() - object.timeStamp > 60 * 60 * 24 * 7 * 1000) {
      await lfRemoveItem(3, key);
    }
  }
}

let getUpdateRateWorkerResponses = {};
let port;

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
  const collection = await listRecordedEstimateTimeForUpdateRate();
  const taskID = generateIdentifier('t');

  const result = await new Promise((resolve, reject) => {
    getUpdateRateWorkerResponses[taskID] = resolve; // Store the resolve function for this taskID

    port.onerror = function (e) {
      reject(e.message);
    };

    port.postMessage([collection, taskID]); // Send the task to the worker
  });

  return result;
}

export async function getUpdateRateInTime(): Promise<string> {
  let totalWeight: number = 0;
  let totalAverageChange: number = 0;
  let weightedAverageChange: number = 0;
  const collection = await listRecordedEstimateTimeForUpdateRate();
  for (const dataSet of collection) {
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
