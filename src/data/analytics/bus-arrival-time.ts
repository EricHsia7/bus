import { generateIdentifier } from '../../tools/index';
import { EstimateTime } from '../apis/getEstimateTime/index';
import { listFoldersWithContent } from '../folder/index';
import { isInPersonalSchedule } from '../personal-schedule/index';
import { lfSetItem } from '../storage/index';

let trackingBusArrivalTime_trackingID: string = '';
let trackingBusArrivalTime_tracking: boolean = false;
let trackingBusArrivalTime_trackedStops: Array = [];
const trackingBusArrivalTime_monitorTimes: number = 128;

interface EstimateTimeRecordForBusArrivalTime {
  EstimateTime: number;
  timeStamp: number;
}

interface EstimateTimeRecordForBusArrivalTimeObject {
  trackingID: string;
  timeStamp: number;
  data: { [key: string]: Array<EstimateTimeRecordForBusArrivalTime> };
}

export async function recordEstimateTimeForBusArrivalTime(EstimateTime: EstimateTime): void {
  let needToReset = false;
  if (!trackingBusArrivalTime_tracking) {
    trackingBusArrivalTime_tracking = true;
    trackingBusArrivalTime_trackingID = generateIdentifier('b');
    trackingBusArrivalTime_trackedStops = [];
    const foldersWithContent = await listFoldersWithContent();
    for (const folderWithContent1 of foldersWithContent) {
      trackingBusArrivalTime_trackedStops = trackingBusArrivalTime_trackedStops.concat(
        folderWithContent1.content
          .filter((m) => {
            return m.type === 'stop' ? true : false;
          })
          .map((e) => e.id)
      );
    }
  }
  const now = new Date();
  if (isInPersonalSchedule(now)) {
    const currentTimeStamp: number = now.getTime();

    const existingRecord = await lfGetItem(4, trackingBusArrivalTime_trackingID);

    let existingRecordObject = {};
    if (!existingRecord) {
      existingRecordObject = { trackingID: trackingBusArrivalTime_trackingID, timeStamp: currentTimeStamp, data: {} };
    } else {
      existingRecordObject = JSON.parse(existingRecord);
    }

    for (var item of EstimateTime) {
      if (trackingUpdateRate_trackedStops.indexOf(item.StopID) > -1) {
        if (!existingRecordObject.data.hasOwnProperty(`s_${item.StopID}`)) {
          existingRecordObject.data[`s_${item.StopID}`] = [{ EstimateTime: parseInt(item.EstimateTime), timeStamp: currentTimeStamp }];
        }
        existingRecordObject.data[`s_${item.StopID}`].push({ EstimateTime: parseInt(item.EstimateTime), timeStamp: currentTimeStamp });

        if (existingRecordObject.data[`s_${item.StopID}`].length > trackingBusArrivalTime_monitorTimes) {
          needToReset = true;
        }
      }
    }
    await lfSetItem(4, trackingBusArrivalTime_trackingID, JSON.stringify(existingRecordObject));
    if (needToReset) {
      trackingBusArrivalTime_tracking = false;
    }
  }
}
