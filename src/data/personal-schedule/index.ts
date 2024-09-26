import { generateIdentifier } from '../../tools/index';
import { lfGetItem, lfSetItem } from '../storage/index';

interface PersonalSchedulePeriodTime {
  hours: number;
  minutes: number;
}

interface PersonalSchedulePeriod {
  start: PersonalSchedulePeriodTime;
  end: PersonalSchedulePeriodTime;
}

type PersonalScheduleDays = Array<0 | 1 | 2 | 3 | 4 | 5 | 6>;
// 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday

interface PersonalSchedule {
  name: string;
  period: PersonalSchedulePeriod;
  days: PersonalScheduleDays;
  id: string;
}

export async function createPersonalSchedule(name: string, startHours: number, startMinutes: number, endHours: number, endMinutes: number, days: Array<number>): Promise<boolean> {
  const identifier = generateIdentifier('s');
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
