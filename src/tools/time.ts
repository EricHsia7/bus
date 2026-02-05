export function getThisWeekOrigin(): Date {
  const today: Date = new Date();
  const dayOfToday: number = today.getDay();
  const originDate: number = today.getDate() - dayOfToday;
  const origin: Date = new Date();
  origin.setDate(originDate);
  origin.setHours(0);
  origin.setMinutes(0);
  origin.setSeconds(0);
  origin.setMilliseconds(0);
  return origin;
}

export function offsetDate(origin: Date, date: number, hours: number, minutes: number): Date {
  const duplicatedOrigin = new Date();
  duplicatedOrigin.setDate(1);
  duplicatedOrigin.setMonth(0);
  duplicatedOrigin.setHours(hours);
  duplicatedOrigin.setMinutes(minutes);
  duplicatedOrigin.setSeconds(0);
  duplicatedOrigin.setMilliseconds(0);
  duplicatedOrigin.setFullYear(origin.getFullYear());
  duplicatedOrigin.setMonth(origin.getMonth());
  duplicatedOrigin.setDate(origin.getDate());
  duplicatedOrigin.setDate(duplicatedOrigin.getDate() + date);
  return duplicatedOrigin;
}

export function timeStampToNumber(string: string, timeZoneOffset: number = 0): number {
  const regex = /[0-9\.]*/gm;
  const match = string.match(regex);
  if (match) {
    const localTimeZoneOffset = new Date().getTimezoneOffset();
    const year = parseInt(match[0]);
    const month = parseInt(match[2]);
    const date = parseInt(match[4]);
    const hours = parseInt(match[6]);
    const minutes = parseInt(match[8]);
    const seconds = parseInt(match[10]);
    const date_object = new Date();
    date_object.setDate(1);
    date_object.setMonth(0);
    date_object.setFullYear(year);
    date_object.setMonth(month - 1);
    date_object.setDate(date);
    date_object.setHours(hours);
    date_object.setMinutes(minutes + localTimeZoneOffset - timeZoneOffset);
    // UTC - local = local offset -> UTC = local + local offset
    // UTC - target = target offset -> target = UTC - target offset = (local + local offset) - target offset
    date_object.setSeconds(seconds);
    return date_object.getTime();
  }
  return 0;
}

export function dateToString(date: Date, template: string = 'YYYY-MM-DD hh:mm:ss'): string {
  const result = template
    .replaceAll(/Y{4,4}/g, date.getFullYear())
    .replaceAll(/M{2,2}/g, String(date.getMonth() + 1).padStart(2, '0'))
    .replaceAll(/D{2,2}/g, String(date.getDate()).padStart(2, '0'))
    .replaceAll(/h{2,2}/g, String(date.getHours()).padStart(2, '0'))
    .replaceAll(/m{2,2}/g, String(date.getMinutes()).padStart(2, '0'))
    .replaceAll(/s{2,2}/g, String(date.getSeconds()).padStart(2, '0'));
  return result;
}

export function dateToRelativeTime(date: Date): string {
  const time = date.getTime();
  const seconds = Math.floor((new Date().getTime() - time) / 1000);
  let interval = Math.floor(seconds / 31536000); // seconds in a year
  if (interval >= 1) {
    return `${interval}年前`;
  }
  interval = Math.floor(seconds / 2592000); // seconds in a month
  if (interval >= 1) {
    return `${interval}個月前`;
  }
  interval = Math.floor(seconds / 86400); // seconds in a day
  if (interval >= 1) {
    return `${interval}天前`;
  }
  interval = Math.floor(seconds / 3600); // seconds in an hour
  if (interval >= 1) {
    return `${interval}小時前`;
  }
  interval = Math.floor(seconds / 60); // seconds in a minute
  if (interval >= 1) {
    return `${interval}分鐘前`;
  }
  if (seconds > 0) {
    return `${seconds}秒前`;
  }
  return '現在';
}

export function formatTime(time: number, mode: number): string {
  const roundedTime = time | 0;
  switch (mode) {
    case 0: {
      return `${roundedTime}秒`;
      break;
    }
    case 1: {
      const minutes = String((roundedTime - (roundedTime % 60)) / 60);
      const seconds = String(roundedTime % 60);
      return [minutes, seconds].map((u) => u.padStart(2, '0')).join(':');
      break;
    }
    case 2: {
      const minutes = (roundedTime / 60) | 0;
      return `${minutes}分`;
      break;
    }
    case 3: {
      if (roundedTime >= 60 * 60) {
        const hours = parseFloat((roundedTime / (60 * 60)).toFixed(1));
        return `${hours}時`;
      }
      if (60 <= roundedTime && roundedTime < 60 * 60) {
        const minutes = (roundedTime / 60) | 0;
        return `${minutes}分`;
      }
      if (roundedTime < 60) {
        return `${roundedTime}秒`;
      }
      break;
    }
    default: {
      return '--';
      break;
    }
  }
}

export type WeekDayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
// 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday

export type WeekDayIndexArray = Array<WeekDayIndex>;

export type WeekDayName = '日' | '一' | '二' | '三' | '四' | '五' | '六';

export interface WeekDay {
  name: WeekDayName;
  day: WeekDayIndex;
  code: string;
}

export function indexToDay(index: WeekDayIndex): WeekDay {
  const days = [
    {
      name: '日',
      day: 0,
      code: 'd_0'
    },
    {
      name: '一',
      day: 1,
      code: 'd_1'
    },
    {
      name: '二',
      day: 2,
      code: 'd_2'
    },
    {
      name: '三',
      day: 3,
      code: 'd_3'
    },
    {
      name: '四',
      day: 4,
      code: 'd_4'
    },
    {
      name: '五',
      day: 5,
      code: 'd_5'
    },
    {
      name: '六',
      day: 6,
      code: 'd_6'
    }
  ];
  return days[index];
}

export function dateValueToDayOfWeek(dateValue: string): WeekDay {
  const int = parseInt(dateValue);
  const index = int - 1;
  return indexToDay(index);
}

export interface TimeObject {
  hours: number;
  minutes: number;
}

export interface TimePeriod {
  start: TimeObject;
  end: TimeObject;
}

export interface TimeStampPeriod {
  start: Date;
  end: Date;
}

export function timeObjectToString(timeObject: TimeObject): string {
  return `${String(timeObject.hours).padStart(2, '0')}:${String(timeObject.minutes).padStart(2, '0')}`;
}

export function createDateObjectFromDate(year: number, month: number, date: number): Date {
  const dateObject = new Date();
  dateObject.setDate(1); // Set to the first day of the month to prevent date from being clamped
  dateObject.setMonth(0);
  dateObject.setFullYear(year);
  dateObject.setMonth(month - 1);
  dateObject.setDate(date);
  dateObject.setHours(0);
  dateObject.setMinutes(0);
  dateObject.setSeconds(0);
  dateObject.setMilliseconds(0);
  return dateObject;
}

export function maxConcurrency(periods: Array<TimePeriod>): number {
  let events: Array<[number, 1 | -1]> = [];

  // Convert periods into events
  for (let { start, end } of periods) {
    events.push([start.hours * 60 + start.minutes, 1]); // Start of a period
    events.push([end.hours * 60 + end.minutes, -1]); // End of a period
  }

  // Sort events: Primary by time, secondary by type (-1 before +1)
  events.sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));

  let maxCount = 0;
  let currentCount = 0;

  // Sweep through the events
  for (let [, type] of events) {
    currentCount += type;
    maxCount = Math.max(maxCount, currentCount);
  }

  return maxCount;
}

export function assignTracks(periods: Array<TimePeriod>): Array<Array<TimePeriod>> {
  if (periods.length === 0) return [];

  // Convert periods into events
  let events: Array<[number, number, number]> = [];
  let index = 0;
  for (let { start, end } of periods) {
    events.push([start.hours * 60 + start.minutes, end.hours * 60 + end.minutes, index]);
    index += 1;
  }

  // Sort intervals by start time
  events.sort((a, b) => a[0] - b[0]);

  let tracks = [];
  for (let [start, end, index] of events) {
    let assigned = false;
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i][tracks[i].length - 1][1] <= start) {
        tracks[i].push([start, end, index]);
        assigned = true;
        break;
      }
    }
    if (!assigned) {
      tracks.push([[start, end, index]]);
    }
  }

  let i = 0;
  for (const track of tracks) {
    let j = 0;
    for (const event of track) {
      tracks[i][j] = periods[event[2]];
      j += 1;
    }
    i += 1;
  }

  return tracks;
}
