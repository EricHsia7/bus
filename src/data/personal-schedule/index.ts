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
  await lfSetItem(4, identifier, JSON.stringify(object));
  return true;
}

export async function getPersonalSchedule(personalScheduleID: string): Promise<PersonalSchedule> {
  const existingPersonalSchedule = await lfGetItem(4, personalScheduleID);
  if (existingPersonalSchedule) {
    const object = JSON.parse(existingPersonalSchedule);
    return object;
  }
}

export async function updatePersonalSchedule(personalSchedule: PersonalSchedule): Promise<boolean> {
  const thisPersonalSchedule = await getPersonalSchedule(personalSchedule.id);
  if (thisPersonalSchedule) {
    await lfSetItem(4, personalSchedule.id, JSON.stringify(personalSchedule));
  }
}

export async function listPersonalSchedules(): Promise<PersonalScheduleArray> {
  let result = [];
  const keys = await lfListItemKeys(4);
  for (const key of keys) {
    const existingPersonalSchedule = await lfGetItem(4, key);
    if (existingPersonalSchedule) {
      const existingPersonalScheduleObject = JSON.parse(existingPersonalSchedule);
      result.push(existingPersonalScheduleObject);
    }
  }
  return result;
}
