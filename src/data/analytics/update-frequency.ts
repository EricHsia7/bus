import { standardizeArray } from '../../tools/index.ts';
import { lfSetItem, lfGetItem, lfListItem } from '../storage/index.ts';

var md5 = require('md5');

var trackingUpdateFrequency = {
  trackedStops: [],
  trackID: null,
  tracking: false,
  sampleQuantity: 64
};

export async function recordEstimateTime(EstimateTime: object): void {
  if (!trackingUpdateFrequency.tracking) {
    trackingUpdateFrequency.tracking = true;
    trackingUpdateFrequency.trackID = `e_${md5(Math.random() + new Date().getTime())}`;
    var EstimateTimeLength = EstimateTime.length - 1;
    for (var i = 0; i < trackingUpdateFrequency.sampleQuantity; i++) {
      const randomIndex = Math.max(Math.min(Math.round(Math.random() * EstimateTimeLength), EstimateTimeLength), 0);
      var randomItem = EstimateTime[randomIndex];
      trackingUpdateFrequency.trackedStops.push(randomItem.StopID);
    }
  } else {
    const currentTimeStamp = Math.floor(new Date().getTime() / 1000);
    for (var item of EstimateTime) {
      if (trackingUpdateFrequency.trackedStops.indexOf(item.StopID) > -1) {
        var existingRecord = await lfGetItem(3, trackingUpdateFrequency.trackID);
        if (!existingRecord) {
          var existingRecordObject = {};
        } else {
          var existingRecordObject = JSON.parse(existingRecord);
        }
        if (!existingRecordObject.hasOwnProperty(`s_${item.StopID}`)) {
          existingRecordObject[`s_${item.StopID}`] = [{ EstimateTime: parseInt(item.EstimateTime), timeStamp: currentTimeStamp }];
        }
        var existingRecordObject = JSON.parse(existingRecord);
        console.log(existingRecordObject, item);
        existingRecordObject[`s_${item.StopID}`].push({ EstimateTime: parseInt(item.EstimateTime), timeStamp: currentTimeStamp });
        await lfSetItem(3, trackingUpdateFrequency.trackID, JSON.stringify(existingRecordObject));
      }
    }
  }
}

export async function listRecordedEstimateTime() {
  var keys = await lfListItem(3);
  for (var key of keys) {
    var json = await lfGetItem(3, key);
    var object = JSON.parse(json);
    for (var key2 in object) {
      console.log(key, object[key2].map((item) => `${item.EstimateTime}, ${item.timeStamp}`).join(`\n`));
    }
  }
}
