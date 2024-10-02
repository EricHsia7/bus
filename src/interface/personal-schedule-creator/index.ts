import { createPersonalSchedule } from '../../data/personal-schedule/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/query-selector';
import { WeekDayIndex } from '../../tools/time';
import { closePreviousPage, openPreviousPage, pushPageHistory } from '../index';
import { promptMessage } from '../prompt/index';

const PersonalScheduleCreatorField = documentQuerySelector('.css_personal_schedule_creator_field');
const PersonalScheduleCreatorBodyElement = elementQuerySelector(PersonalScheduleCreatorField, '.css_personal_schedule_creator_body');
const PersonalScheduleCreatorGroups = elementQuerySelector(PersonalScheduleCreatorBodyElement, '.css_personal_schedule_creator_groups');
const nameInputElement = elementQuerySelector(PersonalScheduleCreatorGroups, '.css_personal_schedule_creator_group[group="schedule-name"] .css_personal_schedule_creator_group_body input');
const startTimeInputElement = elementQuerySelector(PersonalScheduleCreatorGroups, '.css_personal_schedule_creator_group[group="schedule-start-time"] .css_personal_schedule_creator_group_body input');
const endTimeInputElement = elementQuerySelector(PersonalScheduleCreatorGroups, '.css_personal_schedule_creator_group[group="schedule-end-time"] .css_personal_schedule_creator_group_body input');
const dayGroupBodyElement = elementQuerySelector(PersonalScheduleCreatorGroups, '.css_personal_schedule_creator_group[group="schedule-days"] .css_personal_schedule_creator_group_body');
const dayElements = elementQuerySelectorAll(dayGroupBodyElement, '.css_personal_schedule_creator_day');

export function createFormulatedPersonalSchedule(): void {
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

  createPersonalSchedule(name, startHours, startMinutes, endHours, endMinutes, days).then(function (e) {
    if (e) {
      closePersonalScheduleCreator();
      promptMessage('已建立個人化行程', 'calendar_view_day');
    } else {
      promptMessage('無法建立個人化行程', 'error');
    }
  });
}

export function openPersonalScheduleCreator(): void {
  pushPageHistory('PersonalScheduleCreator');
  PersonalScheduleCreatorField.setAttribute('displayed', 'true');
  closePreviousPage();
}

export function closePersonalScheduleCreator(): void {
  // revokePageHistory('PersonalScheduleCreator');
  PersonalScheduleCreatorField.setAttribute('displayed', 'false');
  openPreviousPage();
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
