import { generateIdentifier } from '../../tools/index';
import { dateToString, TimeObject, timeObjectToString } from '../../tools/time';
import { EstimateTime } from '../apis/getEstimateTime/index';
import { listFoldersWithContent } from '../folder/index';
import { isInPersonalSchedule, listPersonalSchedules } from '../personal-schedule/index';
import { lfGetItem, lfListItemKeys, lfSetItem } from '../storage/index';

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
      if (trackingBusArrivalTime_trackedStops.indexOf(item.StopID) > -1) {
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

export async function discardExpiredEstimateTimeRecordsForBusArrivalTime(): void {
  const keys = await listRecordedEstimateTimeForBusArrivalTime();
  for (const key of keys) {
    const json = await lfGetItem(4, key);
    const object: object = JSON.parse(json);
    if (new Date().getTime() - object.timeStamp > 60 * 60 * 24 * 30 * 1000) {
      await lfRemoveItem(4, key);
    }
  }
}

export async function getBusArrivalTimes(): Promise<object> {
  // Merge data by stops
  let recordsGroupedByStops = {};
  const keys = await lfListItemKeys(4);
  for (const key of keys) {
    const existingRecord = await lfGetItem(4, key);
    const existingRecordObject: EstimateTimeRecordForBusArrivalTimeObject = JSON.parse(existingRecord);
    for (const stopKey1 in existingRecordObject.data) {
      if (!recordsGroupedByStops.hasOwnProperty(stopKey1)) {
        recordsGroupedByStops[stopKey1] = [];
      }
      recordsGroupedByStops[stopKey1] = recordsGroupedByStops[stopKey1].concat(existingRecordObject.data[stopKey1]);
    }
  }

  // Extract Arrival Times
  let busArrivalTimesGroupedByStops = {};
  for (const stopKey2 in recordsGroupedByStops) {
    let recordsOfThisStop = recordsGroupedByStops[stopKey2];
    recordsOfThisStop.sort(function (a, b) {
      return a.timeStamp - b.timeStamp;
    });
    const recordsOfThisStopLength = recordsOfThisStop.length;
    let newPeriod = false;
    let EstimateTimeInThisPeriod = [];
    let busArrivalTimeInThisPeriod = [];
    for (let i = 0; i < recordsOfThisStopLength; i++) {
      const previousRecord = recordsOfThisStop[i - 1] || recordsOfThisStop[i];
      const currentRecord = recordsOfThisStop[i];
      const nextRecord = recordsOfThisStop[i + 1] || recordsOfThisStop[i];

      const previousRecordEstimateTime = previousRecord.EstimateTime;
      const currentRecordEstimateTime = currentRecord.EstimateTime;
      const nextRecordEstimateTime = nextRecord.EstimateTime;

      const deltaA = currentRecordEstimateTime - previousRecordEstimateTime;
      const deltaB = nextRecordEstimateTime - currentRecordEstimateTime;
      if (deltaA < 0 && deltaB > 0 && currentRecordEstimateTime >= 0) {
        // decreasing estimate time value
        EstimateTimeInThisPeriod.push(currentRecord);
      } else {
        newPeriod = true;
        EstimateTimeInThisPeriod.sort(function (a, b) {
          return a.EstimateTime - b.EstimateTime;
        });
        if (EstimateTimeInThisPeriod.length > 0) {
          const closestRecord = EstimateTimeInThisPeriod[0];
          busArrivalTimeInThisPeriod.push(new Date(closestRecord.timeStamp + closestRecord.EstimateTime * 1000));
        }
        EstimateTimeInThisPeriod = [];
      }
    }
    busArrivalTimesGroupedByStops[stopKey2] = busArrivalTimeInThisPeriod;
  }

  // Group bus arrival times by stops and personal schedules
  const personalSchedules = await listPersonalSchedules();
  let result = {};
  for (const personalSchedule of personalSchedules) {
    const personalScheduleID = personalSchedule.id;
    const personalScheduleName = personalSchedule.name;

    // Iterate over each stop in busArrivalTimesGroupedByStops
    for (const stopKey3 in busArrivalTimesGroupedByStops) {
      // Initialize the structure for each stop in the result
      if (!result.hasOwnProperty(stopKey3)) {
        result[stopKey3] = {};
      }

      if (!result[stopKey3].hasOwnProperty(personalScheduleID)) {
        result[stopKey3][personalScheduleID] = {
          name: personalScheduleName,
          id: personalScheduleID,
          busArrivalTimes: []
        };
      }

      let busArrivalTimes = [];
      for (const busArrivalTime of busArrivalTimesGroupedByStops[stopKey3]) {
        const busArrivalTimeDay = busArrivalTime.getDay();
        const busArrivalTimeHours = busArrivalTime.getHours();
        const busArrivalTimeMinutes = busArrivalTime.getMinutes();

        // Check if the personal schedule covers this day
        if (personalSchedule.days.indexOf(busArrivalTimeDay) > -1) {
          const totalMinutes = busArrivalTimeHours * 60 + busArrivalTimeMinutes;
          const scheduleTotalStartMinutes = personalSchedule.period.start.hours * 60 + personalSchedule.period.start.minutes;
          const scheduleTotalEndMinutes = personalSchedule.period.end.hours * 60 + personalSchedule.period.end.minutes;

          // Check if the bus time falls within the personal schedule's time period
          if (totalMinutes >= scheduleTotalStartMinutes && totalMinutes <= scheduleTotalEndMinutes) {
            // Add the bus arrival time to the result
            busArrivalTimes.push(busArrivalTime);
          }
        }
      }

      // Aggregate bus arrival times
      const aggregationInterval = 5; // 5 minutes
      let aggregatedBusArrivalTimesObject = {};
      for (const busArrivalTime of busArrivalTimes) {
        const busArrivalTimeHours = busArrivalTime.getHours();
        const busArrivalTimeMinutes = busArrivalTime.getMinutes();
        const busArrivalTimeTotalMinutes = busArrivalTimeHours * 60 + busArrivalTimeMinutes;
        const roundedTotalMinutes = Math.round(busArrivalTimeTotalMinutes / aggregationInterval) * aggregationInterval;
        const aggregationKey = `a_${roundedTotalMinutes}`;
        if (!aggregatedBusArrivalTimesObject.hasOwnProperty(aggregationKey)) {
          aggregatedBusArrivalTimesObject[aggregationKey] = {
            totalMinutes: 0,
            dataQuantity: 0
          };
        }
        aggregatedBusArrivalTimesObject[aggregationKey].totalMinutes += busArrivalTimeTotalMinutes;
        aggregatedBusArrivalTimesObject[aggregationKey].dataQuantity += 1;
      }

      let aggregatedBusArrivalTimes = [];
      for (const aggregationKey in aggregatedBusArrivalTimesObject) {
        const thisAggregation = aggregatedBusArrivalTimesObject[aggregationKey];
        const dataQuantity = thisAggregation.dataQuantity;
        const averageTotalMinutes = thisAggregation.totalMinutes / dataQuantity;
        const averageMinutes = averageTotalMinutes % 60;
        const averageHours = (averageTotalMinutes - averageMinutes) / 60;
        const timeObject: TimeObject = {
          hours: averageHours,
          minutes: averageMinutes
        };
        aggregatedBusArrivalTimes.push({
          time: timeObjectToString(timeObject),
          personalSchedule: personalSchedule,
          dataQuantity: dataQuantity
        });
      }

      result[stopKey3][personalScheduleID].busArrivalTimes = aggregatedBusArrivalTimes;
    }
  }

  return result;
}
