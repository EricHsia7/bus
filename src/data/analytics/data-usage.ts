import { standardizeArray } from '../../tools/index.ts';
import { lfSetItem, lfGetItem } from '../storage/index.ts';

export async function recordRequest(requestID: string, data: object): void {
  var existingRecord = await lfGetItem(2, requestID);
  if (existingRecord) {
    var existingRecordObject = JSON.parse(existingRecord);
    existingRecordObject.time = existingRecordObject.time + data.time;
    existingRecordObject.content_length = existingRecordObject.content_length + data.content_length;
    await lfSetItem(2, requestID, existingRecordObject);
  } else {
    await lfSetItem(2, requestID, data);
  }
  console.log(requestID, data);
}
