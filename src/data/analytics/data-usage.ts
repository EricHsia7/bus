import { convertBytes } from '../../tools/index';
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
  var keys = await lfListItemKeys(2);
  var total_content_length = 0;
  for (var key of keys) {
    var json = await lfGetItem(2, key);
    var object = JSON.parse(json);
    total_content_length += object.content_length;
  }
  return convertBytes(total_content_length);
}
