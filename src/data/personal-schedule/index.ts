import { IntervalArray, union } from '../../tools/array';
import { generateIdentifier, hasOwnProperty } from '../../tools/index';
import { TimePeriod, WeekDayIndexArray } from '../../tools/time';
import { lfGetItem, lfListItemKeys, lfRemoveItem, lfSetItem } from '../storage/index';

export interface PersonalSchedule {
  name: string;
  period: TimePeriod;
  days: WeekDayIndexArray;
  id: string;
}

export type PersonalScheduleArray = Array<PersonalSchedule>;

export type MergedPersonalScheduleTimeline = { [key: string]: Array<TimePeriod> };

const PersonalSchedules: { [key: string]: PersonalSchedule } = {};
const PersonalSchedulesTimeline: [sun: IntervalArray, mon: IntervalArray, tue: IntervalArray, wed: IntervalArray, thu: IntervalArray, fri: IntervalArray, sat: IntervalArray] = [[], [], [], [], [], [], []];

export async function initializePersonalSchedules() {
  const keys = await lfListItemKeys(7);
  for (const key of keys) {
    const thisPersonalScheduleJSON = await lfGetItem(7, key);
    if (thisPersonalScheduleJSON) {
      const thisPersonalScheduleObject = JSON.parse(thisPersonalScheduleJSON) as PersonalSchedule;
      if (!hasOwnProperty(PersonalSchedules, key)) {
        PersonalSchedules[key] = thisPersonalScheduleObject;
      }
    }
  }
}

export function initializePersonalSchedulesTimeline(): void {
  const personalSchedules = listPersonalSchedules();
  const timeline: [sun: IntervalArray, mon: IntervalArray, tue: IntervalArray, wed: IntervalArray, thu: IntervalArray, fri: IntervalArray, sat: IntervalArray] = ([[], [], [], [], [], [], []] = [[], [], [], [], [], [], []]);
  for (const personalSchedule of personalSchedules) {
    for (const day of personalSchedule.days) {
      timeline[day].push([personalSchedule.period.start.hours * 60 + personalSchedule.period.start.minutes, personalSchedule.period.end.hours * 60 + personalSchedule.period.end.minutes]);
    }
  }
  for (let i = 0; i < 7; i++) {
    PersonalSchedulesTimeline[i] = union(timeline[i]);
  }
}

export async function createPersonalSchedule(name: string, startHours: number, startMinutes: number, endHours: number, endMinutes: number, days: WeekDayIndexArray): Promise<boolean> {
  const identifier = generateIdentifier();

  if (hasOwnProperty(PersonalSchedules, identifier)) {
    return false;
  }

  const existence = await lfGetItem(7, identifier);
  if (existence) {
    return false;
  }

  if (startHours < 0 || startHours > 23 || startMinutes < 0 || startMinutes > 59 || endHours < 0 || endHours > 23 || endMinutes < 0 || endMinutes > 59) {
    return false;
  }

  if (!Number.isInteger(startHours) || !Number.isInteger(startMinutes) || !Number.isInteger(endHours) || !Number.isInteger(endMinutes)) {
    return false;
  }

  if (days.length > 7) {
    return false;
  }

  for (const day of days) {
    if (typeof day === 'number') {
      if (day < 0 || day > 6 || !Number.isInteger(day)) {
        return false;
      }
    }
  }

  const object: PersonalSchedule = {
    name: name,
    period: {
      start: {
        hours: startHours,
        minutes: startMinutes
      },
      end: {
        hours: endHours,
        minutes: endMinutes
      }
    },
    days: days,
    id: identifier
  };
  await lfSetItem(7, identifier, JSON.stringify(object));
  PersonalSchedules[identifier] = object;
  initializePersonalSchedulesTimeline();

  return true;
}

export function getPersonalSchedule(personalScheduleID: PersonalSchedule['id']): PersonalSchedule | false {
  if (hasOwnProperty(PersonalSchedules, personalScheduleID)) {
    const object: PersonalSchedule = {
      name: PersonalSchedules[personalScheduleID].name,
      period: PersonalSchedules[personalScheduleID].period,
      days: PersonalSchedules[personalScheduleID].days,
      id: PersonalSchedules[personalScheduleID].id
    };
    return object;
  }
  return false;
}

export async function updatePersonalSchedule(personalSchedule: PersonalSchedule): Promise<boolean> {
  if (!hasOwnProperty(PersonalSchedules, personalSchedule.id)) {
    return false;
  }

  await lfSetItem(7, personalSchedule.id, JSON.stringify(personalSchedule));
  PersonalSchedules[personalSchedule.id].name = personalSchedule.name;
  PersonalSchedules[personalSchedule.id].days = personalSchedule.days;
  PersonalSchedules[personalSchedule.id].period = personalSchedule.period;
  initializePersonalSchedulesTimeline();

  return true;
}

export async function removePersonalSchedule(personalScheduleID: PersonalSchedule['id']): Promise<boolean> {
  if (!hasOwnProperty(PersonalSchedules, personalScheduleID)) {
    return false;
  }

  const existence = await lfGetItem(7, personalScheduleID);
  if (!existence) {
    return false;
  }

  await lfRemoveItem(7, personalScheduleID);
  delete PersonalSchedules[personalScheduleID];
  initializePersonalSchedulesTimeline();

  return true;
}

export function listPersonalSchedules(): PersonalScheduleArray {
  const result: PersonalScheduleArray = [];
  for (const key in PersonalSchedules) {
    result.push({
      name: PersonalSchedules[key].name,
      period: PersonalSchedules[key].period,
      days: PersonalSchedules[key].days,
      id: PersonalSchedules[key].id
    } as PersonalSchedule);
  }

  result.sort(function (a, b) {
    return a.period.end.hours * 60 + a.period.end.minutes - (b.period.end.hours * 60 + b.period.end.minutes);
  });

  result.sort(function (a, b) {
    return a.period.start.hours * 60 + a.period.start.minutes - (b.period.start.hours * 60 + b.period.start.minutes);
  });

  return result;
}

/*
export function getMergedPersonalScheduleTimeline(): MergedPersonalScheduleTimeline {
  const personalSchedules = listPersonalSchedules();

  const result: MergedPersonalScheduleTimeline = {};

  for (const personalSchedule of personalSchedules) {
    for (const day of personalSchedule.days) {
      const dayKey = `d_${day}`;
      if (!hasOwnProperty(result, dayKey)) {
        result[dayKey] = [];
      }
      const object = {
        start: personalSchedule.period.start,
        end: personalSchedule.period.end
      };
      result[dayKey].push(object);
    }
  }

  for (const dayKey in result) {
    const personalSchedulesOfThisDay = result[dayKey];
    const personalSchedulesOfThisDayLength = personalSchedulesOfThisDay.length;
    const mergedPersonalSchedulesOfThisDay = [];
    for (let i = 0; i < personalSchedulesOfThisDayLength; i++) {
      const previousPersonalScheduleOfThisDay = personalSchedulesOfThisDay[i - 1] || personalSchedulesOfThisDay[i];
      const currentPersonalScheduleOfThisDay = personalSchedulesOfThisDay[i];
      if (mergedPersonalSchedulesOfThisDay.length === 0) {
        mergedPersonalSchedulesOfThisDay.push(currentPersonalScheduleOfThisDay);
      } else {
        // Check whether the current is after the previous and  the current is before the previous's end
        if (currentPersonalScheduleOfThisDay.start.hours * 60 + currentPersonalScheduleOfThisDay.start.minutes >= previousPersonalScheduleOfThisDay.start.hours * 60 + previousPersonalScheduleOfThisDay.start.minutes && currentPersonalScheduleOfThisDay.start.hours * 60 + currentPersonalScheduleOfThisDay.start.minutes <= previousPersonalScheduleOfThisDay.end.hours * 60 + previousPersonalScheduleOfThisDay.end.minutes) {
          mergedPersonalSchedulesOfThisDay[mergedPersonalSchedulesOfThisDay.length - 1].end.hours = currentPersonalScheduleOfThisDay.end.hours;
          mergedPersonalSchedulesOfThisDay[mergedPersonalSchedulesOfThisDay.length - 1].end.minutes = currentPersonalScheduleOfThisDay.end.minutes;
        } else {
          mergedPersonalSchedulesOfThisDay.push(currentPersonalScheduleOfThisDay);
        }
      }
    }
    result[dayKey] = mergedPersonalSchedulesOfThisDay;
  }

  return result;
}
*/

export function isInPersonalSchedule(date: Date): boolean {
  const day = date.getDay();
  const time = date.getHours() * 60 + date.getMinutes();
  for (const interval of PersonalSchedulesTimeline[day]) {
    if (time >= interval[0] && time <= interval[1]) {
      return true;
    }
  }
  return false;
}
