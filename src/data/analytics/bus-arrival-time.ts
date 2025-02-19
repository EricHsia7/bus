import { generateIdentifier } from '../../tools/index';
import { EstimateTime } from '../apis/getEstimateTime/index';
import { listAllFolderContent } from '../folder/index';
import { isInPersonalSchedule, PersonalSchedule } from '../personal-schedule/index';
import { lfGetItem, lfListItemKeys, lfSetItem, lfRemoveItem } from '../storage/index';

const busArrivalTimeData_writeAheadLog_maxDataLength: number = 32;
let busArrivalTimeData_writeAheadLog_id: string = '';
let busArrivalTimeData_writeAheadLog_tracking: boolean = false;
let busArrivalTimeData_trackedStops: Array<number> = [];
let busArrivalTimeData_writeAheadLog_group: BusArrivalTimeDataWriteAheadLog = {
  data: {},
  timestamp: 0,
  id: ''
};
let busArrivalTimeData_writeAheadLog_currentDataLength: number = 0;

interface EstimateTimeRecordForBusArrivalTime {
  EstimateTime: number;
  timeStamp: number;
}

export type BusArrivalTimeData = [number, number]; // EstimateTime (seconds), timestamp (milliseconds)

export type BusArrivalTimeDataGroupStats = Array<number>;

export interface BusArrivalTimeDataGroup {
  stats: BusArrivalTimeDataGroupStats;
  timestamp: number;
  id: number; // stop id
}

export interface BusArrivalTimeDataWriteAheadLog {
  data: {
    [key: string]: Array<BusArrivalTimeData>;
  };
  timestamp: number;
  id: string;
}

export interface AggregatedBusArrivalTime {
  time: string;
  personalSchedule: PersonalSchedule;
}

export interface BusArrivalTimes {
  [stopKey: string]: {
    [personalScheduleID: string]: {
      name: string;
      id: string;
      busArrivalTimes: Array<AggregatedBusArrivalTime>;
    };
  };
}

function getBusArrivalTimeDataStats(data: Array<BusArrivalTimeData>): BusArrivalTimeDataGroupStats {
  const statsArray = new Uint16Array(60 * 24); // one day in minutes
  const dataLength = data.length;
  for (let i = dataLength - 1; i >= 0; i--) {
    const item = data[i];
    let time = 0;
    let offset = 0;
    if (item[0] >= 0) {
      time = item[1] + item[0] * 1000;
      offset = 1;
    } else {
      time = item[1];
      offset = -1;
    }
    const date = new Date(time);
    const index = date.getHours() * 60 + date.getMinutes();
    statsArray[index] += offset;
  }
  return Array.from(statsArray);
}

function mergeBusArrivalTimeDataStats(targetStats: BusArrivalTimeDataGroupStats, sourceStats: BusArrivalTimeDataGroupStats): BusArrivalTimeDataGroupStats {
  const mergedArray = new Uint16Array(60 * 24);
  for (let i = 60 * 24 - 1; i >= 0; i--) {
    mergedArray[i] = targetStats[i] + sourceStats[i];
  }
  return Array.from(mergedArray);
}

export async function collectBusArrivalTimeData(EstimateTime: EstimateTime) {
  const now = new Date();
  const currentTimestamp: number = now.getTime();
  let needToReset = false;
  // Initialize
  if (!busArrivalTimeData_writeAheadLog_tracking) {
    busArrivalTimeData_writeAheadLog_tracking = true;
    busArrivalTimeData_writeAheadLog_id = generateIdentifier('b');
    busArrivalTimeData_writeAheadLog_group = {
      id: busArrivalTimeData_writeAheadLog_id,
      timestamp: currentTimestamp,
      data: {}
    };
    busArrivalTimeData_writeAheadLog_currentDataLength = 0;
    const allFolderContent = await listAllFolderContent(['stop']);
    busArrivalTimeData_trackedStops = allFolderContent.map((e) => e.id);
  }

  // Record EstimateTime
  if (isInPersonalSchedule(now)) {
    for (const item of EstimateTime) {
      const stopID = item.StopID;
      const stopKey = `s_${stopID}`;
      if (busArrivalTimeData_trackedStops.indexOf(stopID) > -1) {
        if (!busArrivalTimeData_writeAheadLog_group.data.hasOwnProperty(stopKey)) {
          busArrivalTimeData_writeAheadLog_group.data[stopKey] = [];
        }
        busArrivalTimeData_writeAheadLog_group.data[stopKey].push([parseInt(item.EstimateTime), currentTimestamp]);
        busArrivalTimeData_writeAheadLog_currentDataLength += 1;
        if (busArrivalTimeData_writeAheadLog_currentDataLength > busArrivalTimeData_writeAheadLog_maxDataLength) {
          needToReset = true;
        }
      }
    }
    if (needToReset || busArrivalTimeData_writeAheadLog_currentDataLength % 8 === 0) {
      await lfSetItem(5, busArrivalTimeData_writeAheadLog_id, JSON.stringify(busArrivalTimeData_writeAheadLog_group));
    }
    if (needToReset) {
      for (const stopID of busArrivalTimeData_trackedStops) {
        const stopKey = `s_${stopID}`;
        const data = busArrivalTimeData_writeAheadLog_group.data[stopKey];
        let dataGroup = {} as BusArrivalTimeDataGroup;
        const existingData = await lfGetItem(6, stopKey);
        if (existingData) {
          const existingDataObject = JSON.parse(existingData) as BusArrivalTimeDataGroup;
          dataGroup.stats = mergeBusArrivalTimeDataStats(existingDataObject.stats, getBusArrivalTimeDataStats(data));
          dataGroup.timestamp = existingDataObject.timestamp;
          dataGroup.id = stopID;
        } else {
          dataGroup.stats = getBusArrivalTimeDataStats(data);
          dataGroup.timestamp = currentTimestamp;
          dataGroup.id = stopID;
        }
        await lfSetItem(6, stopKey, JSON.stringify(dataGroup));
        await lfRemoveItem(5, busArrivalTimeData_writeAheadLog_id);
      }
      busArrivalTimeData_writeAheadLog_tracking = false;
    }
  }
}

export async function recoverBusArrivalTimeDataFromWriteAheadLog() {
  const keys = await lfListItemKeys(5);
  for (const key of keys) {
    const json = await lfGetItem(5, key);
    const object = JSON.parse(json) as BusArrivalTimeDataWriteAheadLog;
    const thisID = object.id;
    for (const stopKey in object) {
      const thisStopData = object[stopKey];
      let dataGroup = {} as BusArrivalTimeDataGroup;
      const existingData = await lfGetItem(6, stopKey);
      if (existingData) {
        const existingDataObject = JSON.parse(existingData) as BusArrivalTimeDataGroup;
        dataGroup.stats = mergeBusArrivalTimeDataStats(existingDataObject.stats, getBusArrivalTimeDataStats(thisStopData));
        dataGroup.timestamp = existingDataObject.timestamp;
        dataGroup.id = stopID;
      } else {
        dataGroup.stats = getBusArrivalTimeDataStats(thisStopData);
        dataGroup.timestamp = currentTimestamp;
        dataGroup.id = stopID;
      }
      await lfSetItem(6, stopKey, JSON.stringify(dataGroup));
      await lfRemoveItem(5, thisID);
    }
  }
}

export async function discardExpiredEstimateTimeRecordsForBusArrivalTime() {
  /*
  const keys = await lfListItemKeys(6);
  for (const key of keys) {
    const json = await lfGetItem(6, key);
    const object: object = JSON.parse(json);
    if (new Date().getTime() - object.timeStamp > 60 * 60 * 24 * 30 * 1000) {
      await lfRemoveItem(6, key);
    }
  }
  */
}

export async function getBusArrivalTimes(): Promise<BusArrivalTimes> {
  /*
  // Merge data by stops
  let recordsGroupedByStops = {};
  const keys = await lfListItemKeys(5);
  for (const key of keys) {
    const existingRecord = await lfGetItem(5, key);
    const existingRecordObject: BusArrivalTimeDataWriteAheadLog = JSON.parse(existingRecord);
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
    let EstimateTimeInThisPeriod = [];
    let busArrivalTimeInThisPeriod = [];
    for (let i = 0; i < recordsOfThisStopLength; i++) {
      const currentRecord = recordsOfThisStop[i];
      const nextRecord = recordsOfThisStop[i + 1] || recordsOfThisStop[i];

      const currentRecordEstimateTime = currentRecord.EstimateTime;
      const nextRecordEstimateTime = nextRecord.EstimateTime;

      const delta = nextRecordEstimateTime - currentRecordEstimateTime;
      if (delta < 0 && currentRecordEstimateTime >= 0) {
        // decreasing estimate time value
        EstimateTimeInThisPeriod.push(currentRecord);
      } else {
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
            busArrivalTimes.push(totalMinutes);
          }
        }
      }

      // Aggregate bus arrival times
      const aggregatedBusArrivalTimes = aggregateNumbers(aggregateNumbers(busArrivalTimes, 1.355), 1.65);

      let aggregatedBusArrivalTimeObjects = [];
      for (const aggregatedBusArrivalTime of aggregatedBusArrivalTimes) {
        const totalMinutes = Math.floor(aggregatedBusArrivalTime);
        const minutes = totalMinutes % 60;
        const hours = (totalMinutes - minutes) / 60;
        const timeObject: TimeObject = {
          hours: hours,
          minutes: minutes
        };
        aggregatedBusArrivalTimeObjects.push({
          time: timeObjectToString(timeObject),
          personalSchedule: personalSchedule
        });
      }

      result[stopKey3][personalScheduleID].busArrivalTimes = aggregatedBusArrivalTimeObjects;
    }
  }

  return result;
  */
}

export async function generateBusArrivalTimeGraphs() {}
