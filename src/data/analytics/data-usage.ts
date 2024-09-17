import { convertBytes, smoothArray } from '../../tools/index';
import { segmentsToPath, simplifyPath } from '../../tools/path';
import { dateToString } from '../../tools/time';
import { lfSetItem, lfGetItem, lfListItemKeys } from '../storage/index';

export async function recordRequest(requestID: string, data: object): void {
  var existingRecord = await lfGetItem(2, requestID);
  if (existingRecord) {
    var existingRecordObject = JSON.parse(existingRecord);
    existingRecordObject.end_time = existingRecordObject.end_time;
    existingRecordObject.content_length = existingRecordObject.content_length + data.content_length;
    await lfSetItem(2, requestID, JSON.stringify(existingRecordObject));
  } else {
    await lfSetItem(2, requestID, JSON.stringify(data));
  }
}

export async function calculateDataUsage(): Promise<number> {
  const keys = await lfListItemKeys(2);
  let totalContentLength = 0;
  for (const key of keys) {
    const json = await lfGetItem(2, key);
    const object = JSON.parse(json);
    totalContentLength += object.content_length;
  }
  return convertBytes(totalContentLength);
}

export async function generateSVGGraph(width: number, height: number): Promise<string> {
  const keys = await lfListItemKeys(2);
  let totalContentLength = 0;
  let graphData = {};
  for (const key of keys) {
    const json = await lfGetItem(2, key);
    const object = JSON.parse(json);
    const startDate = new Date(object.start_time);
    const graphDataKey = `d_${dateToString(startDate, 'YYYY_MM_DD')}`;
    if (!graphData.hasOwnProperty(graphDataKey)) {
      graphData[graphDataKey] = { start_time: object.start_time, end_time: object.end_time, content_length: 0 };
    }
    graphData[graphDataKey].content_length = graphData[graphDataKey].content_length + object.content_length;
    if (object.start_time < graphData[graphDataKey].start_time) {
      graphData[graphDataKey].start_time = object.start_time;
    }
    if (object.end_time > graphData[graphDataKey].end_time) {
      graphData[graphDataKey].end_time = object.end_time;
    }
    totalContentLength += object.content_length;
  }

  let graphDataArray = [];
  for (const graphDataKey of graphData) {
    const item = graphData[graphDataKey];
    graphDataArray.push(item);
  }
  graphDataArray.sort(function (a, b) {
    return a.start_time - b.start_time;
  });
  const startTimeArray = graphDataArray.map((e) => e.start_time);
  const minStartTime = Math.min(...startTimeArray);

  const endTimeArray = graphDataArray.map((e) => e.end_time);
  const maxEndTime = Math.max(...endTimeArray);

  const contentLengthArray = graphDataArray.map((e) => e.content_length);
  const maxContentLength = Math.max(...contentLengthArray);

  let path = [];
  for (const graphData of graphDataArray) {
    const point = {
      x: ((graphData.start_time - minStartTime) / (maxEndTime - minStartTime)) * width,
      y: (graphData.content_length / maxContentLength) * height
    };
    path.push(point);
  }

  const simplifiedPath = simplifyPath(path, 0.8);
  const svgPath = segmentsToPath(simplifiedPath);
  return svgPath;
}
