import { getPersonalSchedule, updatePersonalSchedule } from '../../data/personal-schedule/index';
import { booleanToString } from '../../tools';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/elements';
import { timeObjectToString, WeekDayIndex, WeekDayIndexArray } from '../../tools/time';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';
import { initializePersonalScheduleManagerField } from '../personal-schedule-manager/index';
import { promptMessage } from '../prompt/index';

const Field = documentQuerySelector('.css_personal_schedule_editor_field');

const HeadElement = elementQuerySelector(Field, '.css_personal_schedule_editor_head');
const HeadButtonLeftElement = elementQuerySelector(HeadElement, '.css_personal_schedule_editor_button_left');

const BodyElement = elementQuerySelector(Field, '.css_personal_schedule_editor_body');
const GroupsElement = elementQuerySelector(BodyElement, '.css_personal_schedule_editor_groups');

const NameGroupElement = elementQuerySelector(GroupsElement, '.css_personal_schedule_editor_group[group="schedule-name"]');
const NameGroupBodyElement = elementQuerySelector(NameGroupElement, '.css_personal_schedule_editor_group_body');
const NameInputElement = elementQuerySelector(NameGroupBodyElement, 'input') as HTMLInputElement;

const StartTimeGroupElement = elementQuerySelector(GroupsElement, '.css_personal_schedule_editor_group[group="schedule-start-time"]');
const StartTimeGroupBodyElement = elementQuerySelector(StartTimeGroupElement, '.css_personal_schedule_editor_group_body');
const StartTimeInputElement = elementQuerySelector(StartTimeGroupBodyElement, 'input') as HTMLInputElement;

const EndTimeGroupElement = elementQuerySelector(GroupsElement, '.css_personal_schedule_editor_group[group="schedule-end-time"]');
const EndTimeGroupBodyElement = elementQuerySelector(EndTimeGroupElement, '.css_personal_schedule_editor_group_body');
const EndTimeInputElement = elementQuerySelector(EndTimeGroupBodyElement, 'input') as HTMLInputElement;

const ScheduleDayGroupElement = elementQuerySelector(GroupsElement, '.css_personal_schedule_editor_group[group="schedule-days"]');
const ScheduleDayGroupBodyElement = elementQuerySelector(ScheduleDayGroupElement, '.css_personal_schedule_editor_group_body');
const DayElements = elementQuerySelectorAll(ScheduleDayGroupBodyElement, '.css_personal_schedule_editor_day');

export async function saveEditedPersonalSchedule(personalScheduleID: string) {
  const name = NameInputElement.value;
  const startTime = StartTimeInputElement.value;
  const endTime = EndTimeInputElement.value;

  const [startHours, startMinutes] = String(startTime)
    .split(':')
    .map((e) => parseInt(e, 10));
  const [endHours, endMinutes] = String(endTime)
    .split(':')
    .map((e) => parseInt(e, 10));

  const days: WeekDayIndexArray = [];
  for (let i = 0; i < 7; i++) {
    const thisDayElement = DayElements[i];
    const highlighted = thisDayElement.getAttribute('highlighted');
    if (highlighted === 'true') {
      days.push(i as WeekDayIndex);
    }
  }

  const personalSchedule = getPersonalSchedule(personalScheduleID);
  if (personalSchedule) {
    personalSchedule.name = name;
    personalSchedule.days = days;
    personalSchedule.period.start.hours = startHours;
    personalSchedule.period.start.minutes = startMinutes;
    personalSchedule.period.end.hours = endHours;
    personalSchedule.period.end.minutes = endMinutes;

    const update = await updatePersonalSchedule(personalSchedule);
    if (update) {
      closePersonalScheduleEditor();
      // callback
      initializePersonalScheduleManagerField();
    } else {
      promptMessage('error', '無法儲存變更');
    }
  } else {
    promptMessage('error', '發生錯誤');
  }
}

async function initializePersonalScheduleEditorField(personalScheduleID: string) {
  const personalSchedule = await getPersonalSchedule(personalScheduleID);
  if (personalSchedule === false) return;

  NameInputElement.value = personalSchedule.name;
  StartTimeInputElement.value = timeObjectToString(personalSchedule.period.start);
  EndTimeInputElement.value = timeObjectToString(personalSchedule.period.end);

  for (let i = 0; i < 7; i++) {
    const thisDayElement = DayElements[i];
    if (personalSchedule.days.indexOf(i as WeekDayIndex) > -1) {
      thisDayElement.setAttribute('highlighted', 'true');
    } else {
      thisDayElement.setAttribute('highlighted', 'false');
    }
  }
  HeadButtonLeftElement.onclick = function () {
    saveEditedPersonalSchedule(personalScheduleID);
  };
}

export function showPersonalScheduleEditor(): void {
  Field.setAttribute('displayed', 'true');
}

export function hidePersonalScheduleEditor(): void {
  Field.setAttribute('displayed', 'false');
}

export function openPersonalScheduleEditor(personalScheduleID: string): void {
  pushPageHistory('PersonalScheduleEditor');
  showPersonalScheduleEditor();
  initializePersonalScheduleEditorField(personalScheduleID);
  hidePreviousPage();
}

export function closePersonalScheduleEditor(): void {
  hidePersonalScheduleEditor();
  showPreviousPage();
  revokePageHistory('PersonalScheduleEditor');
}

export function switchPersonalScheduleEditorDay(day: WeekDayIndex): void {
  const thisDayElement = DayElements[day];
  const highlighted = thisDayElement.getAttribute('highlighted') === 'true';
  thisDayElement.setAttribute('highlighted', booleanToString(!highlighted));
}
