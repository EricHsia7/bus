import { createPersonalSchedule } from '../../data/personal-schedule/index';
import { booleanToString } from '../../tools';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/elements';
import { WeekDayIndex, WeekDayIndexArray } from '../../tools/time';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';
import { initializePersonalScheduleManagerField } from '../personal-schedule-manager/index';
import { promptMessage } from '../prompt/index';

const Field = documentQuerySelector('.css_personal_schedule_creator_field');
const BodyElement = elementQuerySelector(Field, '.css_personal_schedule_creator_body');
const GroupsElement = elementQuerySelector(BodyElement, '.css_personal_schedule_creator_groups');

const ScheduleNameGroupElement = elementQuerySelector(GroupsElement, '.css_personal_schedule_creator_group[group="schedule-name"]');
const ScheduleNameGroupBodyElement = elementQuerySelector(ScheduleNameGroupElement, '.css_personal_schedule_creator_group_body');
const ScheduleNameInputElement = elementQuerySelector(ScheduleNameGroupBodyElement, 'input') as HTMLInputElement;

const ScheduleStartTimeGroupElement = elementQuerySelector(GroupsElement, '.css_personal_schedule_creator_group[group="schedule-start-time"]');
const ScheduleStartTimeGroupBodyElement = elementQuerySelector(ScheduleStartTimeGroupElement, '.css_personal_schedule_creator_group_body');
const ScheduleStartTimeInputElement = elementQuerySelector(ScheduleStartTimeGroupBodyElement, 'input') as HTMLInputElement;

const ScheduleEndTimeGroupElement = elementQuerySelector(GroupsElement, '.css_personal_schedule_creator_group[group="schedule-end-time"]');
const ScheduleEndTimeGroupBodyElement = elementQuerySelector(ScheduleEndTimeGroupElement, '.css_personal_schedule_creator_group_body');
const ScheduleEndTimeInputElement = elementQuerySelector(ScheduleEndTimeGroupBodyElement, 'input') as HTMLInputElement;

const ScheduleDaysGroupElement = elementQuerySelector(GroupsElement, '.css_personal_schedule_creator_group[group="schedule-days"]');
const ScheduleDaysGroupBodyElement = elementQuerySelector(ScheduleDaysGroupElement, '.css_personal_schedule_creator_group_body');
const ScheduleDayElements = elementQuerySelectorAll(ScheduleDaysGroupBodyElement, '.css_personal_schedule_creator_day');

export async function createFormulatedPersonalSchedule() {
  const name = ScheduleNameInputElement.value;
  const startTime = ScheduleStartTimeInputElement.value;
  const endTime = ScheduleEndTimeInputElement.value;

  const [startHours, startMinutes] = String(startTime)
    .split(':')
    .map((e) => parseInt(e, 10));
  const [endHours, endMinutes] = String(endTime)
    .split(':')
    .map((e) => parseInt(e, 10));

  const days: WeekDayIndexArray = [];
  for (let i = 0; i < 7; i++) {
    const thisDayElement = ScheduleDayElements[i];
    const highlighted = thisDayElement.getAttribute('highlighted');
    if (highlighted === 'true') {
      days.push(i as WeekDayIndex);
    }
  }

  const creation = await createPersonalSchedule(name, startHours, startMinutes, endHours, endMinutes, days);
  if (creation) {
    closePersonalScheduleCreator();
    promptMessage('calendar_view_day', '已建立個人化行程');
    // callback
    initializePersonalScheduleManagerField();
  } else {
    promptMessage('error', '無法建立個人化行程');
  }
}

export function showPersonalScheduleCreator(): void {
  Field.setAttribute('displayed', 'true');
}

export function hidePersonalScheduleCreator(): void {
  Field.setAttribute('displayed', 'false');
}

export function openPersonalScheduleCreator(): void {
  pushPageHistory('PersonalScheduleCreator');
  showPersonalScheduleCreator();
  hidePreviousPage();
}

export function closePersonalScheduleCreator(): void {
  hidePersonalScheduleCreator();
  showPreviousPage();
  revokePageHistory('PersonalScheduleCreator');
}

export function switchPersonalScheduleCreatorDay(day: WeekDayIndex): void {
  const thisDayElement = ScheduleDayElements[day];
  const highlighted = thisDayElement.getAttribute('highlighted') === 'true';
  thisDayElement.setAttribute('highlighted', booleanToString(!highlighted));
}
