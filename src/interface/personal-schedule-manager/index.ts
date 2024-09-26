import { documentQuerySelector } from '../../tools/query-selector';

const PersonalScheduleManagerField = documentQuerySelector('.css_personal_schedule_manager_field');

export function openPersonalScheduleManager(): void {
  PersonalScheduleManagerField.setAttribute('displayed', 'true');
}

export function closePersonalScheduleManager(): void {
  PersonalScheduleManagerField.setAttribute('displayed', 'false');
}
