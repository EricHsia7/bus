import { splitDataByDelta, pearsonCorrelation, generateIdentifier } from '../../tools/index';
import { formatTime } from '../../tools/format-time';
import { lfSetItem, lfGetItem, lfListItemKeys, lfRemoveItem } from '../storage/index';
import { EstimateTime } from '../apis/getEstimateTime/index';

var trackingUpdateRate_trackedStops: Array = [];
var trackingUpdateRate_trackingID: string = '';
var trackingUpdateRate_tracking: boolean = false;
var trackingUpdateRate_sampleQuantity: number = 64;
var trackingUpdateRate_monitorTimes: number = 90;

export async function recordEstimateTime(EstimateTime: EstimateTime): void {
  var needToReset = false;
  if (!trackingUpdateRate_tracking) {
    trackingUpdateRate_tracking = true;
    trackingUpdateRate_trackedStops = [];
    trackingUpdateRate_trackingID = `e_${generateIdentifier()}`;
    var EstimateTimeLength: number = EstimateTime.length - 1;
    for (var i = 0; i < trackingUpdateRate_sampleQuantity; i++) {
      const randomIndex: number = Math.max(Math.min(Math.round(Math.random() * EstimateTimeLength), EstimateTimeLength), 0);
      var randomItem: object = EstimateTime[randomIndex];
      trackingUpdateRate_trackedStops.push(randomItem.StopID);
    }
  }
  const currentTimeStamp: number = Math.floor(new Date().getTime() / 1000);
  var existingRecord = await lfGetItem(3, trackingUpdateRate_trackingID);
  if (!existingRecord) {
    var existingRecordObject: object = { trackingID: trackingUpdateRate_trackingID, timeStamp: new Date().getTime(), data: {} };
  } else {
    var existingRecordObject: object = JSON.parse(existingRecord);
  }
  for (var item of EstimateTime) {
    if (trackingUpdateRate_trackedStops.indexOf(item.StopID) > -1) {
      if (!existingRecordObject.data.hasOwnProperty(`s_${item.StopID}`)) {
        existingRecordObject.data[`s_${item.StopID}`] = [{ EstimateTime: parseInt(item.EstimateTime), timeStamp: currentTimeStamp }];
      }
      existingRecordObject.data[`s_${item.StopID}`].push({ EstimateTime: parseInt(item.EstimateTime), timeStamp: currentTimeStamp });
      if (existingRecordObject.data[`s_${item.StopID}`].length > trackingUpdateRate_monitorTimes) {
        needToReset = true;
      }
    }
  }
  await lfSetItem(3, trackingUpdateRate_trackingID, JSON.stringify(existingRecordObject));
  if (needToReset) {
    trackingUpdateRate_tracking = false;
  }
}

export async function listRecordedEstimateTime(): Promise<Array<[number, number]>> {
  const keys = await lfListItemKeys(3);
  var result = [];
  for (const key of keys) {
    const json = await lfGetItem(3, key);
    const object: object = JSON.parse(json);
    if (!(new Date().getTime() - object.timeStamp > 60 * 60 * 24 * 7 * 1000)) {
      for (var key2 in object.data) {
        result.push(object.data[key2].map((item) => [item.EstimateTime, item.timeStamp]));
      }
    }
  }
  return result;
}

export async function discardExpiredEstimateTimeRecords(): void {
  const keys = await listRecordedEstimateTime();
  for (const key of keys) {
    const json = await lfGetItem(3, key);
    const object: object = JSON.parse(json);
    if (new Date().getTime() - object.timeStamp > 60 * 60 * 24 * 7 * 1000) {
      await lfRemoveItem(3, key);
    }
  }
}

export async function getUpdateRate(): Promise<number> {
  var weighted_average: number = 0;
  var total_correlation: number = 0;
  var total_weight: number = 0;
  var collection = await listRecordedEstimateTime();
  for (var dataSet of collection) {
    var groups = splitDataByDelta(dataSet);
    for (var group of groups) {
      const firstColumn: Array<number> = group.map((item) => item[0]);
      const secondColumn: Array<number> = group.map((item) => item[1]);
      const correlation: number = pearsonCorrelation(firstColumn, secondColumn);
      if (!(correlation === 0) && Math.abs(correlation) > 0.2 && !isNaN(correlation)) {
        total_correlation += correlation * firstColumn.length;
        total_weight += firstColumn.length;
      }
    }
  }
  weighted_average = total_correlation / total_weight;
  return isNaN(weighted_average) ? 0.8 : Math.abs(weighted_average);
}

export async function getUpdateRateInTime(): Promise<string> {
  var total_weight: number = 0;
  var total_average_change: number = 0;
  var weighted_average_change: number = 0;
  var collection = await listRecordedEstimateTime();
  for (var dataSet of collection) {
    var groups = splitDataByDelta(dataSet);
    for (var group of groups) {
      const firstColumn: Array<number> = group.map((item) => item[0]);
      const secondColumn: Array<number> = group.map((item) => item[1]);
      const rowCount: number = firstColumn.length;
      var timeStampUponChanges: Array = [];
      for (var i = 1; i < rowCount; i++) {
        var change: number = Math.abs(firstColumn[i] - firstColumn[i - 1]);
        if (change > 0) {
          timeStampUponChanges.push(secondColumn[i]);
        }
      }
      var timeStampUponChangesLength: number = timeStampUponChanges.length;
      var total_change: number = 0;
      var average: number = 0;
      for (var i = 1; i < timeStampUponChangesLength; i++) {
        var change: number = Math.abs(timeStampUponChanges[i] - timeStampUponChanges[i - 1]); // measured in seconds
        total_change += change;
      }
      average = total_change / (timeStampUponChangesLength - 1);
      total_average_change += isNaN(average) ? 0 : average * rowCount;
      total_weight += isNaN(average) ? 0 : rowCount;
    }
  }
  weighted_average_change = total_average_change / total_weight;
  return isNaN(weighted_average_change) ? '!' : formatTime(weighted_average_change, 0);
}
