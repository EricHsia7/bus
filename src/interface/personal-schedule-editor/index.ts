import { createPersonalSchedule } from '../../data/personal-schedule/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/query-selector';
import { WeekDay } from '../../tools/time';
import { closePreviousPage, openPreviousPage, pushPageHistory } from '../index';
import { promptMessage } from '../prompt/index';

const PersonalScheduleEditorField = documentQuerySelector('.css_personal_schedule_editor_field');
const PersonalScheduleEditorBodyElement = elementQuerySelector(PersonalScheduleEditorField, '.css_personal_schedule_editor_body');
const PersonalScheduleEditorGroups = elementQuerySelector(PersonalScheduleEditorBodyElement, '.css_personal_schedule_editor_groups');
const nameInputElement = elementQuerySelector(PersonalScheduleEditorGroups, '.css_personal_schedule_editor_group[group="schedule-name"] .css_personal_schedule_editor_group_body input');
const startTimeInputElement = elementQuerySelector(PersonalScheduleEditorGroups, '.css_personal_schedule_editor_group[group="schedule-start-time"] .css_personal_schedule_editor_group_body input');
const endTimeInputElement = elementQuerySelector(PersonalScheduleEditorGroups, '.css_personal_schedule_editor_group[group="schedule-end-time"] .css_personal_schedule_editor_group_body input');
const dayGroupBodyElement = elementQuerySelector(PersonalScheduleEditorGroups, '.css_personal_schedule_editor_group[group="schedule-days"] .css_personal_schedule_editor_group_body');
const dayElements = elementQuerySelectorAll(dayGroupBodyElement, '.css_personal_schedule_editor_day');

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
      closePersonalScheduleEditor();
      promptMessage('已建立個人化行程', 'calendar_view_day');
    } else {
      promptMessage('無法建立個人化行程', 'error');
    }
  });
}

export function openPersonalScheduleEditor(): void {
  pushPageHistory('PersonalScheduleEditor');
  PersonalScheduleEditorField.setAttribute('displayed', 'true');
  closePreviousPage();
}

export function closePersonalScheduleEditor(): void {
  // revokePageHistory('PersonalScheduleEditor');
  PersonalScheduleEditorField.setAttribute('displayed', 'false');
  openPreviousPage();
}

export function switchPersonalScheduleEditorDay(day: WeekDay): void {
  const thisDayElement = elementQuerySelector(dayGroupBodyElement, `.css_personal_schedule_editor_day[day="${day}"]`);
  const highlighted = thisDayElement.getAttribute('highlighted');
  if (highlighted === 'true') {
    thisDayElement.setAttribute('highlighted', 'false');
  } else {
    thisDayElement.setAttribute('highlighted', 'true');
  }
}
