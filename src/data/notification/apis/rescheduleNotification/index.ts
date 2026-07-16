import { NotificationClientID, NotificationSchedule, NotificationSecret, updateNotificationSchedule } from '../../index';
import { getNotificationAPIURL } from '../getNotificationAPIURL/index';
import { getNotificationRequestBody } from '../getNotificationRequestBody/index';
import { makeNotificationRequest, NotificationResponseCode } from '../loader';

export async function rescheduleNotification(schedule_id: NotificationSchedule['schedule_id'], estimate_time: NotificationSchedule['estimate_time'], scheduled_time: string | number | Date): Promise<NotificationResponseCode | false> {
  if (NotificationClientID === '' || NotificationSecret === '' || schedule_id === undefined || estimate_time === undefined || scheduled_time === undefined) {
    return false;
  }
  let processed_schedule_time = new Date();
  switch (typeof scheduled_time) {
    case 'string':
      processed_schedule_time = new Date(scheduled_time);
      break;
    case 'number':
      processed_schedule_time = new Date(scheduled_time);
      break;
    default:
      if (scheduled_time instanceof Date) {
        processed_schedule_time = scheduled_time;
      } else {
        return false;
      }
      break;
  }
  const url = getNotificationAPIURL('reschedule');
  const requestBody = getNotificationRequestBody('reschedule', [schedule_id, estimate_time, processed_schedule_time.toISOString()]);
  const response = await makeNotificationRequest('reschedule', url, requestBody);
  if (response === false) return false;
  if (response.method !== 'reschedule') return false;
  if (response.code === 0) {
    await updateNotificationSchedule(schedule_id, estimate_time, processed_schedule_time.getTime());
  }
  return response.code;
}
