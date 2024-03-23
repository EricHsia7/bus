import { standardizeArray } from '../../tools/index.ts';
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

// Function to split data based on delta
function splitDataByDelta(data: []): [] {
  const result = [];
  let currentGroup = [];
  for (let i = 0; i < data.length; i++) {
    if (i === 0 || data[i][0] - data[i - 1][0] > 0) {
      if (currentGroup.length > 0) {
        result.push(currentGroup);
      }
      currentGroup = [data[i]];
    } else {
      currentGroup.push(data[i]);
    }
  }
  if (currentGroup.length > 0) {
    result.push(currentGroup);
  }
  return result;
}

// Function to calculate Pearson correlation coefficient
function pearsonCorrelation(x, y) {
  const n = x.length;
  if (n !== y.length) {
    throw new Error('Arrays must have the same length');
  }

  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXSquared = 0,
    sumYSquared = 0;

  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumXSquared += x[i] ** 2;
    sumYSquared += y[i] ** 2;
  }

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumXSquared - sumX ** 2) * (n * sumYSquared - sumY ** 2));

  if (denominator === 0) {
    return 0; // Correlation is undefined in this case
  }

  return numerator / denominator;
}

export async function processRecordedEstimateTime() {
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
      if (!(correlation === 0)) {
        total_correlation += correlation * firstColumn.length;
        total_weight += firstColumn.length;
      }
    }
  }
  weighted_average = total_correlation / total_weight;
  console.log(weighted_average);
  return weighted_average;
}
