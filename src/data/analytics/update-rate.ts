import { splitDataByDelta, pearsonCorrelation, md5, formatTime } from '../../tools/index.ts';
import { lfSetItem, lfGetItem, lfListItem } from '../storage/index.ts';

interface trackingUpdateRate {
  trackedStops: [];
  trackingID: null;
  tracking: boolean;
  sampleQuantity: number;
}

var trackingUpdateRate: trackingUpdateRate = {
  trackedStops: [],
  trackingID: null,
  tracking: false,
  sampleQuantity: 64,
  monitorTimes: 90
};

export async function recordEstimateTime(EstimateTime: object): void {
  var needToReset = false;
  if (!trackingUpdateRate.tracking) {
    trackingUpdateRate.tracking = true;
    trackingUpdateRate.trackedStops = [];
    var today: Date = new Date();
    trackingUpdateRate.trackingID = `e_${md5(Math.random() + new Date().getTime())}`;
    var EstimateTimeLength: number = EstimateTime.length - 1;
    for (var i = 0; i < trackingUpdateRate.sampleQuantity; i++) {
      const randomIndex: number = Math.max(Math.min(Math.round(Math.random() * EstimateTimeLength), EstimateTimeLength), 0);
      var randomItem: object = EstimateTime[randomIndex];
      trackingUpdateRate.trackedStops.push(randomItem.StopID);
    }
  }
  const currentTimeStamp: number = Math.floor(new Date().getTime() / 1000);
  var existingRecord = await lfGetItem(3, trackingUpdateRate.trackingID);
  if (!existingRecord) {
    var existingRecordObject: object = { trackingID: trackingUpdateRate.trackingID, timeStamp: new Date().getTime(), data: {} };
  } else {
    var existingRecordObject: object = JSON.parse(existingRecord);
  }
  for (var item of EstimateTime) {
    if (trackingUpdateRate.trackedStops.indexOf(item.StopID) > -1) {
      if (!existingRecordObject.data.hasOwnProperty(`s_${item.StopID}`)) {
        existingRecordObject.data[`s_${item.StopID}`] = [{ EstimateTime: parseInt(item.EstimateTime), timeStamp: currentTimeStamp }];
      }
      existingRecordObject.data[`s_${item.StopID}`].push({ EstimateTime: parseInt(item.EstimateTime), timeStamp: currentTimeStamp });
      if (existingRecordObject.data[`s_${item.StopID}`].length > trackingUpdateRate.monitorTimes) {
        needToReset = true;
      }
    }
  }
  await lfSetItem(3, trackingUpdateRate.trackingID, JSON.stringify(existingRecordObject));
  if (needToReset) {
    trackingUpdateRate.tracking = false;
  }
}

export async function listRecordedEstimateTime(): [] {
  var keys = await lfListItem(3);
  var result = [];
  for (var key of keys) {
    var json = await lfGetItem(3, key);
    var object: object = JSON.parse(json);
    if (!(new Date().getTime() - object.timeStamp > 60 * 60 * 24 * 7 * 1000)) {
      for (var key2 in object.data) {
        result.push(object.data[key2].map((item) => [item.EstimateTime, item.timeStamp]));
      }
    }
  }
  return result;
}

export async function getUpdateRate(): number {
  var weighted_average: number = 0;
  var total_correlation: number = 0;
  var total_weight: number = 0;
  var collection = await listRecordedEstimateTime();
  for (var dataSet of collection) {
    var groups = splitDataByDelta(dataSet);
    for (var group of groups) {
      const firstColumn: number[] = group.map((item) => item[0]);
      const secondColumn: number[] = group.map((item) => item[1]);
      const correlation: number = pearsonCorrelation(firstColumn, secondColumn);
      if (!(correlation === 0) && Math.abs(correlation) > 0.2) {
        total_correlation += correlation * firstColumn.length;
        total_weight += firstColumn.length;
      }
    }
  }
  weighted_average = total_correlation / total_weight;
  return isNaN(weighted_average) ? 0.8 : Math.abs(weighted_average);
}

export async function getUpdateRateInTime(): string {
  var total_weight: number = 0;
  var total_average_change: number = 0;
  var weighted_average_change: number = 0;
  var collection = await listRecordedEstimateTime();
  for (var dataSet of collection) {
    var groups = splitDataByDelta(dataSet);
    for (var group of groups) {
      const firstColumn: number[] = group.map((item) => item[0]);
      const secondColumn: number[] = group.map((item) => item[1]);
      const rowCount: number = firstColumn.length;
      var timeStampUponChanges: [] = [];
      for (var i = 1; i < rowCount; i++) {
        var change: number = Math.abs(firstColumn[i] - firstColumn[i - 1]);
        if (change > 0) {
          timeStampUponChanges.push(secondColumn[i]);
        }
      }
      var timeStampUponChangesLength :number= timeStampUponChanges.length;
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
  return isNaN(weighted_average_change) ? '!' : formatTime(weighted_average_change, 3);
}
