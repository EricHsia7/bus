import { documentQuerySelector } from '../../tools/query-selector';
import { closePreviousPage, openPreviousPage, pushPageHistory, revokePageHistory } from '../index';

const NotificationScheduleManagerField = documentQuerySelector('.css_notification_schedule_manager_field');

export function openNotificationScheduleManager(): void {
  pushPageHistory('NotificationScheduleManager');
  NotificationScheduleManagerField.setAttribute('displayed', 'true');
  closePreviousPage();
}

export function closeNotificationScheduleManager(): void {
  // revokePageHistory('NotificationScheduleManager');
  NotificationScheduleManagerField.setAttribute('displayed', 'false');
  openPreviousPage();
}
