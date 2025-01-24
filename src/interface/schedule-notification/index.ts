import { documentQuerySelector } from '../../tools/query-selector';
import { pushPageHistory, revokePageHistory } from '../index';

const ScheduleNotificationField = documentQuerySelector('.css_schedule_notification_field');

export function openScheduleNotification(): void {
  pushPageHistory('ScheduleNotification');
  ScheduleNotificationField.setAttribute('displayed', 'true');
}

export function closeScheduleNotification(): void {
  revokePageHistory('ScheduleNotification');
  ScheduleNotificationField.setAttribute('displayed', 'false');
}
