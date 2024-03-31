import { splitDataByDelta, pearsonCorrelation } from '../../tools/index.ts';
import { lfSetItem, lfGetItem, lfListItem } from '../storage/index.ts';

var md5 = require('md5');

var trackingUpdateRate = {
  trackedStops: [],
  trackingID: null,
  tracking: false,
  sampleQuantity: 64
};

export async function recordEstimateTime(EstimateTime: object): void {
  if (!trackingUpdateRate.tracking) {
    trackingUpdateRate.tracking = true;
    var today = new Date();
    trackingUpdateRate.trackingID = `e_${md5(Math.random() + new Date().getTime())}`;
    var EstimateTimeLength = EstimateTime.length - 1;
    for (var i = 0; i < trackingUpdateRate.sampleQuantity; i++) {
      const randomIndex = Math.max(Math.min(Math.round(Math.random() * EstimateTimeLength), EstimateTimeLength), 0);
      var randomItem = EstimateTime[randomIndex];
      trackingUpdateRate.trackedStops.push(randomItem.StopID);
    }
  }
  const currentTimeStamp = Math.floor(new Date().getTime() / 1000);
  var existingRecord = await lfGetItem(3, trackingUpdateRate.trackingID);
  if (!existingRecord) {
    var existingRecordObject = { trackingID: trackingUpdateRate.trackingID, timeStamp: new Date().getTime(), data: {} };
  } else {
    var existingRecordObject = JSON.parse(existingRecord);
  }
  for (var item of EstimateTime) {
    if (trackingUpdateRate.trackedStops.indexOf(item.StopID) > -1) {
      if (!existingRecordObject.data.hasOwnProperty(`s_${item.StopID}`)) {
        existingRecordObject.data[`s_${item.StopID}`] = [{ EstimateTime: parseInt(item.EstimateTime), timeStamp: currentTimeStamp }];
      }
      existingRecordObject.data[`s_${item.StopID}`].push({ EstimateTime: parseInt(item.EstimateTime), timeStamp: currentTimeStamp });
    }
  }
  await lfSetItem(3, trackingUpdateRate.trackingID, JSON.stringify(existingRecordObject));
}

export async function listRecordedEstimateTime(): [] {
  var keys = await lfListItem(3);
  var result = [];
  for (var key of keys) {
    var json = await lfGetItem(3, key);
    var object = JSON.parse(json);
    if (!(new Date().getTime() - object.timeStamp > 60 * 60 * 24 * 7 * 1000)) {
      for (var key2 in object.data) {
        result.push(object.data[key2].map((item) => [item.EstimateTime, item.timeStamp]));
      }
    }
  }
  return result;
}

export async function getUpdateRate(): number {
  var weighted_average = 0;
  var total_correlation = 0;
  var total_weight = 0;
  var collection = await listRecordedEstimateTime();
  for (var dataSet of collection) {
    var groups = splitDataByDelta(dataSet);
    for (var group of groups) {
      const firstColumn = group.map((item) => item[0]);
      const secondColumn = group.map((item) => item[1]);
      const correlation = pearsonCorrelation(firstColumn, secondColumn);
      if (!(correlation === 0) && Math.abs(correlation) > 0.2) {
        total_correlation += correlation * firstColumn.length;
        total_weight += firstColumn.length;
      }
    }
  }
  weighted_average = total_correlation / total_weight;
  return isNaN(weighted_average) ? 0.8 : Math.abs(weighted_average);
}
