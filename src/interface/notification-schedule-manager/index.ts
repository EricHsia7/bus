import { listNotifcationSchedules, NScheduleFrontend } from '../../data/notification/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { closePreviousPage, openPreviousPage, pushPageHistory } from '../index';

const NotificationScheduleManagerField = documentQuerySelector('.css_notification_schedule_manager_field');
const NotificationScheduleManagerBody = elementQuerySelector(NotificationScheduleManagerField, '.css_notification_schedule_manager_body');

function updateNotificationScheduleManagerField(notificationSchedules: Array<NScheduleFrontend>): void {
  
}

function initializeNotificationScheduleManagerField(): void {
  const notificationSchedules = listNotifcationSchedules();
  updateNotificationScheduleManagerField(notificationSchedules);
}

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
