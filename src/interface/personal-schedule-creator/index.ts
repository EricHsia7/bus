import { createPersonalSchedule } from '../../data/personal-schedule/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/elements';
import { WeekDayIndex } from '../../tools/time';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';
import { initializePersonalScheduleManagerField } from '../personal-schedule-manager/index';
import { promptMessage } from '../prompt/index';

const PersonalScheduleCreatorField = documentQuerySelector('.css_personal_schedule_creator_field');
const PersonalScheduleCreatorBodyElement = elementQuerySelector(PersonalScheduleCreatorField, '.css_personal_schedule_creator_body');
const PersonalScheduleCreatorGroups = elementQuerySelector(PersonalScheduleCreatorBodyElement, '.css_personal_schedule_creator_groups');
const nameInputElement = elementQuerySelector(PersonalScheduleCreatorGroups, '.css_personal_schedule_creator_group[group="schedule-name"] .css_personal_schedule_creator_group_body input');
const startTimeInputElement = elementQuerySelector(PersonalScheduleCreatorGroups, '.css_personal_schedule_creator_group[group="schedule-start-time"] .css_personal_schedule_creator_group_body input');
const endTimeInputElement = elementQuerySelector(PersonalScheduleCreatorGroups, '.css_personal_schedule_creator_group[group="schedule-end-time"] .css_personal_schedule_creator_group_body input');
const dayGroupBodyElement = elementQuerySelector(PersonalScheduleCreatorGroups, '.css_personal_schedule_creator_group[group="schedule-days"] .css_personal_schedule_creator_group_body');
const dayElements = elementQuerySelectorAll(dayGroupBodyElement, '.css_personal_schedule_creator_day');

export async function createFormulatedPersonalSchedule(): void {
  const name = nameInputElement.value;
  const startTime = startTimeInputElement.value;
  const endTime = endTimeInputElement.value;

  const [startHours, startMinutes] = String(startTime)
    .split(':')
    .map((e) => parseInt(e));
  const [endHours, endMinutes] = String(endTime)
    .split(':')
    .map((e) => parseInt(e));

  let days = [];
  for (let i = 0; i < 7; i++) {
    const thisDayElement = dayElements[i];
    const highlighted = thisDayElement.getAttribute('highlighted');
    const day = parseInt(thisDayElement.getAttribute('day'));
    if (highlighted === 'true') {
      days.push(day);
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
  PersonalScheduleCreatorField.setAttribute('displayed', 'true');
}

export function hidePersonalScheduleCreator(): void {
  PersonalScheduleCreatorField.setAttribute('displayed', 'false');
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
  const thisDayElement = elementQuerySelector(dayGroupBodyElement, `.css_personal_schedule_creator_day[day="${day}"]`);
  const highlighted = thisDayElement.getAttribute('highlighted');
  if (highlighted === 'true') {
    thisDayElement.setAttribute('highlighted', 'false');
  } else {
    thisDayElement.setAttribute('highlighted', 'true');
  }
}
