import { NotificationClientID, NotificationSchedule, NotificationSecret, removeNotificationSchedule } from '../../index';
import { getNotificationAPIURL } from '../getNotificationAPIURL/index';
import { getNotificationRequestBody } from '../getNotificationRequestBody/index';
import { makeNotificationRequest, NotificationResponseCode } from '../loader';

export async function cancelNotification(schedule_id: NotificationSchedule['schedule_id']): Promise<NotificationResponseCode | false> {
  if (NotificationClientID === '' || NotificationSecret === '' || schedule_id === undefined) {
    return false;
  }
  const url = getNotificationAPIURL('cancel');
  const requestBody = getNotificationRequestBody('cancel', [schedule_id]);
  const response = await makeNotificationRequest('cancel', url, requestBody);
  if (response === false) return false;
  if (response.method !== 'cancel') return false;
  if (response.code === 0) {
    await removeNotificationSchedule(schedule_id);
  }
  return response.code;
}
