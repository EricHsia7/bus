import { splitDataByDelta, pearsonCorrelation, generateIdentifier } from '../../tools/index';
import { formatTime } from '../../tools/time';
import { lfSetItem, lfGetItem, lfListItemKeys, lfRemoveItem } from '../storage/index';
import { EstimateTime } from '../apis/getEstimateTime/index';

const trackingUpdateRate_sampleQuantity: number = 64;
const trackingUpdateRate_monitorTimes: number = 90;
let trackingUpdateRate_trackedStops: Array = [];
let trackingUpdateRate_trackingID: string = '';
let trackingUpdateRate_tracking: boolean = false;
let trackingUpdateRate_incompleteRecords = {};

export async function recordEstimateTimeForUpdateRate(EstimateTime: EstimateTime): void {
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
    const EstimateTimeLength: number = EstimateTime.length - 1;
    for (let i = 0; i < trackingUpdateRate_sampleQuantity; i++) {
      const randomIndex: number = Math.max(Math.min(Math.round(Math.random() * EstimateTimeLength), EstimateTimeLength), 0);
      var randomItem: object = EstimateTime[randomIndex];
      trackingUpdateRate_trackedStops.push(randomItem.StopID);
    }
  }
  for (const item of EstimateTime) {
    const stopID = item.StopID;
    const stopKey = `s_${stopID}`;
    if (trackingUpdateRate_trackedStops.indexOf(stopID) > -1) {
      if (!trackingUpdateRate_trackedStops.data.hasOwnProperty(stopKey)) {
        trackingUpdateRate_trackedStops.data[stopKey] = [];
      }
      trackingUpdateRate_trackedStops.data[stopKey].push({ EstimateTime: parseInt(item.EstimateTime), timeStamp: currentTimeStamp });
      if (trackingUpdateRate_trackedStops.data[stopKey].length > trackingUpdateRate_monitorTimes) {
        needToReset = true;
      }
    }
  }
  if (needToReset) {
    await lfSetItem(3, trackingUpdateRate_trackingID, JSON.stringify(trackingUpdateRate_incompleteRecords));
    trackingUpdateRate_tracking = false;
  }
}

async function listRecordedEstimateTimeForUpdateRate(): Promise<Array<[number, number]>> {
  const keys = await lfListItemKeys(3);
  var result = [];
  for (const key of keys) {
    const json = await lfGetItem(3, key);
    const object: object = JSON.parse(json);
    if (!(new Date().getTime() - object.timeStamp > 60 * 60 * 24 * 7 * 1000)) {
      for (const key2 in object.data) {
        result.push(object.data[key2].map((item) => [item.EstimateTime, item.timeStamp]));
      }
    }
  }
  return result;
}

export async function discardExpiredEstimateTimeRecordsForUpdateRate(): void {
  const keys = await listRecordedEstimateTimeForUpdateRate();
  for (const key of keys) {
    const json = await lfGetItem(3, key);
    const object: object = JSON.parse(json);
    if (new Date().getTime() - object.timeStamp > 60 * 60 * 24 * 7 * 1000) {
      await lfRemoveItem(3, key);
    }
  }
}

export async function getUpdateRate(): Promise<number> {
  let weightedAverage: number = 0;
  let totalCorrelation: number = 0;
  let totalWeight: number = 0;
  const collection = await listRecordedEstimateTimeForUpdateRate();
  for (const dataSet of collection) {
    const groups = splitDataByDelta(dataSet);
    for (const group of groups) {
      const firstColumn: Array<number> = group.map((item) => item[0]);
      const secondColumn: Array<number> = group.map((item) => item[1]);
      const correlation: number = pearsonCorrelation(firstColumn, secondColumn);
      if (!(correlation === 0) && Math.abs(correlation) > 0.2 && !isNaN(correlation)) {
        totalCorrelation += correlation * firstColumn.length;
        totalWeight += firstColumn.length;
      }
    }
  }
  weightedAverage = totalCorrelation / totalWeight;
  return isNaN(weightedAverage) ? 0.8 : Math.abs(weightedAverage);
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
      let timeStampUponChanges: Array = [];
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
