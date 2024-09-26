import { documentQuerySelector } from '../../tools/query-selector';
import { openPreviousPage, pushPageHistory } from '../index';

const PersonalScheduleCreatorField = documentQuerySelector('.css_personal_schedule_creator_field');

export function openPersonalScheduleCreator(): void {
  pushPageHistory('PersonalScheduleCreator');
  PersonalScheduleCreatorField.setAttribute('displayed', 'true');
}

export function closePersonalScheduleCreator(): void {
  // revokePageHistory('PersonalScheduleCreator');
  PersonalScheduleCreatorField.setAttribute('displayed', 'false');
  openPreviousPage();
}
