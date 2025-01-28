import { NotificationClientID, NotificationSecret, NotificationSchedule, removeNotificationSchedule } from '../../index';
import { getNotificationAPIURL } from '../getNotificationAPIURL/index';
import { getNotificationRequestBody } from '../getNotificationRequestBody/index';
import { makeNotificationRequest } from '../loader';

export async function cancelNotification(schedule_id: NotificationSchedule['schedule_id']): Promise<boolean> {
  if (NotificationClientID === '' || NotificationSecret === '' || schedule_id === undefined) {
    return false;
  }
  const url = getNotificationAPIURL('cancel', [schedule_id]);
  const requestBody = getNotificationRequestBody('cancel', [schedule_id]);
  const response = await makeNotificationRequest('cancel', url, requestBody);
  if (response === false) {
    return false;
  } else {
    if (response.code === 200 && response.method === 'cancel') {
      await removeNotificationSchedule(schedule_id);
      return true;
    } else {
      return false;
    }
  }
}
