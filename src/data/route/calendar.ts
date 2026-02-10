import { SimplifiedRouteItem } from '../apis/getRoute/index';
import { getSemiTimeTable } from '../apis/getSemiTimeTable/index';
import { parseTimeCode, TimeMoment } from '../apis/index';
import { deleteDataReceivingProgress, deleteDataUpdateTime } from '../apis/loader';

export type integratedRouteCalendarEventTime = [start: number, end: number]; // hours * 60 + minutes
export type integratedRouteCalendarEventInterval = [min: number, max: number];

export interface integratedRouteCalendarRepeatedEvent {
  type: 'repeated';
  time: integratedRouteCalendarEventTime;
  interval: integratedRouteCalendarEventInterval;
  day: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

export interface integratedRouteCalendarScheduledEvent {
  type: 'scheduled';
  time: integratedRouteCalendarEventTime;
  interval: integratedRouteCalendarEventInterval;
  date: [year: number, month: number, date: number];
}

export type integratedRouteCalendarDay = Array<integratedRouteCalendarRepeatedEvent>;

export interface integratedRouteCalendar {
  repeated: [mon: integratedRouteCalendarDay, tue: integratedRouteCalendarDay, wed: integratedRouteCalendarDay, thu: integratedRouteCalendarDay, fri: integratedRouteCalendarDay, sun: integratedRouteCalendarDay, sat: integratedRouteCalendarDay];
  scheduled: Array<integratedRouteCalendarScheduledEvent>;
}

export async function integrateRouteCalendar(PathAttributeId: SimplifiedRouteItem['pid'], requestID: string): Promise<integratedRouteCalendar> {
  const SemiTimeTable = await getSemiTimeTable(requestID);

  const result: integratedRouteCalendar = {
    repeated: [[], [], [], [], [], [], []],
    scheduled: []
  };

  for (const item of SemiTimeTable) {
    if (PathAttributeId.indexOf(item.PathAttributeId) < 0) {
      continue;
    }

    if (item.DateType === '0') {
      const day = parseInt(item.DateValue, 10);
      const startTime = parseTimeCode(item.StartTime, 0) as TimeMoment;
      const endTime = parseTimeCode(item.EndTime, 0) as TimeMoment;
      const repeatedEvent: integratedRouteCalendarRepeatedEvent = {
        type: 'repeated',
        time: [startTime.hours * 60 + startTime.minutes, endTime.hours * 60 + endTime.minutes],
        interval: [parseInt(item.LowHeadway, 10), parseInt(item.LongHeadway, 10)],
        day: day
      };
      result.repeated[day - 1].push(repeatedEvent);
    } else if (item.DateType === '1') {
      const dateValue = item.DateValue;
      const startTime = parseTimeCode(item.StartTime, 0) as TimeMoment;
      const endTime = parseTimeCode(item.EndTime, 0) as TimeMoment;
      const scheduledEvent: integratedRouteCalendarScheduledEvent = {
        type: 'scheduled',
        time: [startTime.hours * 60 + startTime.minutes, endTime.hours * 60 + endTime.minutes],
        interval: [parseInt(item.LowHeadway, 10), parseInt(item.LongHeadway, 10)],
        date: [parseInt(dateValue.slice(0, -4), 10), parseInt(dateValue.slice(-4, -2), 10), parseInt(dateValue.slice(-2), 10)]
      };
      result.scheduled.push(scheduledEvent);
    }
  }

  for (let i = 0; i < 7; i++) {
    result.repeated[i].sort(function (a, b) {
      return a.time[0] - b.time[0];
    });
  }

  deleteDataUpdateTime(requestID);
  deleteDataReceivingProgress(requestID);
  
  return result;
}
