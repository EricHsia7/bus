import { documentQuerySelector } from '../../tools/query-selector';

const PersonalScheduleCreatorField = documentQuerySelector('.css_personal_schedule_creator_field');

export function openPersonalScheduleCreator(): void {
  PersonalScheduleCreatorField.setAttribute('displayed', 'true');
}

export function closePersonalScheduleCreator(): void {
  PersonalScheduleCreatorField.setAttribute('displayed', 'false');
}
