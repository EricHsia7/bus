import { documentQuerySelector } from '../../tools/query-selector';
import { pushPageHistory, revokePageHistory } from '../index';

const NotificationField = documentQuerySelector('.css_notification_field');

export function openNotification(): void {
  pushPageHistory('Notification');
  NotificationField.setAttribute('displayed', 'true');
}

export function closeNotification(): void {
  revokePageHistory('Notification');
  NotificationField.setAttribute('displayed', 'false');
}

export async function saveFormulatedNotification() {
  
}
