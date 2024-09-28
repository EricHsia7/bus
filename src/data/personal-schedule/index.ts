import { generateIdentifier } from '../../tools/index';
import { TimePeriod, WeekDayArray } from '../../tools/time';
import { lfGetItem, lfListItemKeys, lfSetItem } from '../storage/index';

export interface PersonalSchedule {
  name: string;
  period: TimePeriod;
  days: WeekDayArray;
  id: string;
}

export type PersonalScheduleArray = Array<PersonalSchedule>;

export type MergedPersonalScheduleTimeline = { [key: string]: Array<TimePeriod> };

export async function createPersonalSchedule(name: string, startHours: number, startMinutes: number, endHours: number, endMinutes: number, days: Array<number>): Promise<boolean> {
  const identifier = generateIdentifier('s');
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
  await lfSetItem(5, identifier, JSON.stringify(object));
  return true;
}

export async function getPersonalSchedule(personalScheduleID: string): Promise<PersonalSchedule> {
  const existingPersonalSchedule = await lfGetItem(5, personalScheduleID);
  if (existingPersonalSchedule) {
    const object = JSON.parse(existingPersonalSchedule);
    return object;
  }
}

export async function updatePersonalSchedule(personalSchedule: PersonalSchedule): Promise<boolean> {
  const thisPersonalSchedule = await getPersonalSchedule(personalSchedule.id);
  if (thisPersonalSchedule) {
    await lfSetItem(5, personalSchedule.id, JSON.stringify(personalSchedule));
  }
}

export async function listPersonalSchedules(): Promise<PersonalScheduleArray> {
  let result: PersonalScheduleArray = [];
  const keys = await lfListItemKeys(5);
  for (const key of keys) {
    const existingPersonalSchedule = await lfGetItem(5, key);
    if (existingPersonalSchedule) {
      const existingPersonalScheduleObject = JSON.parse(existingPersonalSchedule);
      result.push(existingPersonalScheduleObject);
    }
  }

  result.sort(function (a, b) {
    return a.period.start.hours * 60 + a.period.start.minutes - (b.period.end.hours * 60 + b.period.end.minutes);
  });

  return result;
}

export async function getMergedPersonalScheduleTimeline(): Promise<MergedPersonalScheduleTimeline> {
  const personalSchedules = await listPersonalSchedules();

  let result: MergedPersonalScheduleTimeline = {};

  for (const personalSchedule of personalSchedules) {
    for (const day of personalSchedule.days) {
      const dayKey = `d_${day}`;
      if (!result.hasOwnProperty(dayKey)) {
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
    let mergedPersonalSchedulesOfThisDay = [];
    for (let i = 0; i < personalSchedulesOfThisDayLength; i++) {
      const previousPersonalScheduleOfThisDay = personalSchedulesOfThisDay[i - 1] || personalSchedulesOfThisDay[i];
      const currentPersonalScheduleOfThisDay = personalSchedulesOfThisDay[i];
      if (personalSchedulesOfThisDayLength === 0) {
        mergedPersonalSchedulesOfThisDay.push(currentPersonalScheduleOfThisDay);
      } else {
        // Check whether the current is after the previous
        if (currentPersonalScheduleOfThisDay.start.hours * 60 + currentPersonalScheduleOfThisDay.start.minutes > previousPersonalScheduleOfThisDay.start.hours * 60 + previousPersonalScheduleOfThisDay.start.minutes) {
          // Check whether the current is before the previous's end
          if (currentPersonalScheduleOfThisDay.start.hours * 60 + currentPersonalScheduleOfThisDay.start.minutes < previousPersonalScheduleOfThisDay.end.hours * 60 + previousPersonalScheduleOfThisDay.end.minutes) {
            mergedPersonalSchedulesOfThisDay[personalSchedulesOfThisDayLength - 1].end.hours = currentPersonalScheduleOfThisDay.end.hours;
            mergedPersonalSchedulesOfThisDay[personalSchedulesOfThisDayLength - 1].end.minutes = currentPersonalScheduleOfThisDay.end.minutes;
          }
        }
      }
    }
    result[dayKey] = mergedPersonalSchedulesOfThisDay;
  }

  return result;
}
