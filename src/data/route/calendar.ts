import { SimplifiedRouteItem } from '../apis/getRoute/index';
import { getSemiTimeTable } from '../apis/getSemiTimeTable/index';
import { getTimeTable } from '../apis/getTimeTable/index';
import { parseTimeCode, TimeMoment } from '../apis/index';
import { deleteDataReceivingProgress, deleteDataUpdateTime } from '../apis/loader';

export type integratedRouteCalendarEventTime = [start: number, end: number]; // hours * 60 + minutes
export type integratedRouteCalendarEventInterval = [min: number, max: number];
export type integratedRouteCalendarEventCount = [min: number, max: number];

export interface integratedRouteCalendarRepeatedEvent {
  type: 'repeated';
  time: integratedRouteCalendarEventTime;
  interval: integratedRouteCalendarEventInterval;
  count: integratedRouteCalendarEventCount;
  track: number; // zero-based
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export interface integratedRouteCalendarScheduledEvent {
  type: 'scheduled';
  time: integratedRouteCalendarEventTime;
  interval: integratedRouteCalendarEventInterval;
  count: integratedRouteCalendarEventCount;
  track: number; // zero-based
  date: [year: number, month: number, date: number];
}

export type integratedRouteCalendarDay = Array<integratedRouteCalendarRepeatedEvent>;

export interface integratedRouteCalendar {
  repeated: [sun: integratedRouteCalendarDay, mon: integratedRouteCalendarDay, tue: integratedRouteCalendarDay, wed: integratedRouteCalendarDay, thu: integratedRouteCalendarDay, fri: integratedRouteCalendarDay, sat: integratedRouteCalendarDay];
  scheduled: Array<integratedRouteCalendarScheduledEvent>;
  trackQuantity: [sun: number, mon: number, tue: number, wed: number, thu: number, fri: number, sat: number];
  timeZoneOffset: -480;
}

export async function integrateRouteCalendar(PathAttributeId: SimplifiedRouteItem['pid'], requestID: string): Promise<integratedRouteCalendar> {
  const [SemiTimeTable, TimeTable] = await Promise.all([getSemiTimeTable(requestID), getTimeTable(requestID)]);

  const result: integratedRouteCalendar = {
    repeated: [[], [], [], [], [], [], []],
    scheduled: [],
    trackQuantity: [1, 1, 1, 1, 1, 1, 1],
    timeZoneOffset: -480
  };

  const times: Array<Array<[number, 1 | -1]>> = [[], [], [], [], [], [], []];

  for (const item of SemiTimeTable) {
    if (PathAttributeId.indexOf(item.PathAttributeId) < 0) {
      continue;
    }

    const startTime = parseTimeCode(item.StartTime, 0) as TimeMoment;
    const endTime = parseTimeCode(item.EndTime, 0) as TimeMoment;
    let start = startTime.hours * 60 + startTime.minutes;
    let end = endTime.hours * 60 + endTime.minutes;
    if (end < start) {
      if (end === 0) {
        end = 24 * 60 - 1;
      } else {
        [start, end] = [end, start];
      }
    }
    if (end >= 60 * 24) {
      end = 60 * 24 - 1;
    }
    const longHeadway = parseInt(item.LongHeadway, 10);
    const lowHeadway = parseInt(item.LowHeadway, 10);

    if (item.DateType === '0') {
      const day = parseInt(item.DateValue, 10) - 1;
      const repeatedEvent: integratedRouteCalendarRepeatedEvent = {
        type: 'repeated',
        time: [start, end],
        interval: [longHeadway, lowHeadway],
        count: [Math.ceil((end - start) / lowHeadway), Math.floor((end - start) / longHeadway)],
        track: 0,
        day: day
      };
      result.repeated[day].push(repeatedEvent);
      times[day].push([start, 1], [end, -1]);
    } else if (item.DateType === '1') {
      const dateValue = item.DateValue;
      const scheduledEvent: integratedRouteCalendarScheduledEvent = {
        type: 'scheduled',
        time: [start, end],
        interval: [longHeadway, lowHeadway],
        count: [Math.ceil((end - start) / lowHeadway), Math.floor((end - start) / longHeadway)],
        track: 0,
        date: [parseInt(dateValue.slice(0, -4), 10), parseInt(dateValue.slice(-4, -2), 10), parseInt(dateValue.slice(-2), 10)]
      };
      result.scheduled.push(scheduledEvent);
    }
  }

  for (const item of TimeTable) {
    if (PathAttributeId.indexOf(item.PathAttributeId) < 0) {
      continue;
    }
    const assumedDuration = 30;
    const departureTime = parseTimeCode(item.DepartureTime, 0) as TimeMoment;
    const start = departureTime.hours * 60 + departureTime.minutes;
    const end = start + assumedDuration;
    if (item.DateType === '0') {
      const day = parseInt(item.DateValue, 10) - 1;
      const repeatedEvent: integratedRouteCalendarRepeatedEvent = {
        type: 'repeated',
        time: [start, end],
        interval: [assumedDuration, assumedDuration],
        count: [1, 1],
        track: 0,
        day: day
      };
      result.repeated[day].push(repeatedEvent);
      times[day].push([start, 1], [end, -1]);
    } else if (item.DateType === '1') {
      const dateValue = item.DateValue;
      const scheduledEvent: integratedRouteCalendarScheduledEvent = {
        type: 'scheduled',
        time: [start, end],
        interval: [assumedDuration, assumedDuration],
        count: [1, 1],
        track: 0,
        date: [parseInt(dateValue.slice(0, -4), 10), parseInt(dateValue.slice(-4, -2), 10), parseInt(dateValue.slice(-2), 10)]
      };
      result.scheduled.push(scheduledEvent);
    }
  }

  let currentCount = 0;
  let maxCount = 0;
  let lastEndTime = [0];
  let lastTrack = 0;
  for (let i = 0; i < 7; i++) {
    // Sort events by time
    result.repeated[i].sort(function (a, b) {
      return a.time[0] - b.time[0];
    });

    // Sort primarily by time, secondarily by type (-1 before +1)
    times[i].sort(function (a, b) {
      return a[0] === b[0] ? a[1] - b[1] : a[0] - b[0];
    });
    currentCount = 0;
    maxCount = 0;
    lastEndTime = [0];
    lastTrack = 0;

    for (const time of times[i]) {
      currentCount += time[1];
      maxCount = Math.max(maxCount, currentCount);
    }
    result.trackQuantity[i] = maxCount > 0 ? maxCount : 1;
    for (let j = 0, l = result.repeated[i].length; j < l; j++) {
      if (result.repeated[i][j].time[0] < lastEndTime[lastTrack]) {
        lastTrack++;
        lastEndTime.push(0);
      } else {
        lastTrack--;
      }
      if (result.repeated[i][j].time[1] > lastEndTime[lastTrack]) {
        lastEndTime[lastTrack] = result.repeated[i][j].time[1];
      }
      result.repeated[i][j].track = lastTrack;
    }
  }

  deleteDataUpdateTime(requestID);
  deleteDataReceivingProgress(requestID);

  return result;
}
