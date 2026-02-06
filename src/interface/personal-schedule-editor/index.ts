import { getPersonalSchedule, updatePersonalSchedule } from '../../data/personal-schedule/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/elements';
import { timeObjectToString, WeekDayIndex } from '../../tools/time';
import { hidePreviousPage, showPreviousPage, pushPageHistory, revokePageHistory } from '../index';
import { promptMessage } from '../prompt/index';

const PersonalScheduleEditorField = documentQuerySelector('.css_personal_schedule_editor_field');
const PersonalScheduleEditorBodyElement = elementQuerySelector(PersonalScheduleEditorField, '.css_personal_schedule_editor_body');
const PersonalScheduleEditorHeadElement = elementQuerySelector(PersonalScheduleEditorField, '.css_personal_schedule_editor_head');
const leftButtonElement = elementQuerySelector(PersonalScheduleEditorHeadElement, '.css_personal_schedule_editor_button_left');
const PersonalScheduleEditorGroups = elementQuerySelector(PersonalScheduleEditorBodyElement, '.css_personal_schedule_editor_groups');
const nameInputElement = elementQuerySelector(PersonalScheduleEditorGroups, '.css_personal_schedule_editor_group[group="schedule-name"] .css_personal_schedule_editor_group_body input');
const startTimeInputElement = elementQuerySelector(PersonalScheduleEditorGroups, '.css_personal_schedule_editor_group[group="schedule-start-time"] .css_personal_schedule_editor_group_body input');
const endTimeInputElement = elementQuerySelector(PersonalScheduleEditorGroups, '.css_personal_schedule_editor_group[group="schedule-end-time"] .css_personal_schedule_editor_group_body input');
const dayGroupBodyElement = elementQuerySelector(PersonalScheduleEditorGroups, '.css_personal_schedule_editor_group[group="schedule-days"] .css_personal_schedule_editor_group_body');
const dayElements = elementQuerySelectorAll(dayGroupBodyElement, '.css_personal_schedule_editor_day');

export async function saveEditedPersonalSchedule(personalScheduleID: string) {
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

  let personalSchedule = await getPersonalSchedule(personalScheduleID);
  personalSchedule.name = name;
  personalSchedule.days = days;
  personalSchedule.period.start.hours = startHours;
  personalSchedule.period.start.minutes = startMinutes;
  personalSchedule.period.end.hours = endHours;
  personalSchedule.period.end.minutes = endMinutes;

  await updatePersonalSchedule(personalSchedule);
  promptMessage('check_circle', '已儲存變更');
  closePersonalScheduleEditor();
}

async function initializePersonalScheduleEditorField(personalScheduleID: string) {
  const personalSchedule = await getPersonalSchedule(personalScheduleID);
  nameInputElement.value = personalSchedule.name;
  startTimeInputElement.value = timeObjectToString(personalSchedule.period.start);
  endTimeInputElement.value = timeObjectToString(personalSchedule.period.end);

  for (let i = 0; i < 7; i++) {
    const thisDayElement = dayElements[i];
    if (personalSchedule.days.indexOf(i) > -1) {
      thisDayElement.setAttribute('highlighted', 'true');
    } else {
      thisDayElement.setAttribute('highlighted', 'false');
    }
  }
  leftButtonElement.onclick = function () {
    saveEditedPersonalSchedule(personalScheduleID);
  };
}

export function showPersonalScheduleEditor(): void {
  PersonalScheduleEditorField.setAttribute('displayed', 'true');
}

export function hidePersonalScheduleEditor(): void {
  PersonalScheduleEditorField.setAttribute('displayed', 'false');
}

export function openPersonalScheduleEditor(personalScheduleID: string): void {
  pushPageHistory('PersonalScheduleEditor');
  showPersonalScheduleEditor();
  initializePersonalScheduleEditorField(personalScheduleID);
  hidePreviousPage();
}

export function closePersonalScheduleEditor(): void {
  revokePageHistory('PersonalScheduleEditor');
  hidePersonalScheduleEditor();
  showPreviousPage();
}

export function switchPersonalScheduleEditorDay(day: WeekDayIndex): void {
  const thisDayElement = elementQuerySelector(dayGroupBodyElement, `.css_personal_schedule_editor_day[day="${day}"]`);
  const highlighted = thisDayElement.getAttribute('highlighted');
  if (highlighted === 'true') {
    thisDayElement.setAttribute('highlighted', 'false');
  } else {
    thisDayElement.setAttribute('highlighted', 'true');
  }
}
