import { getNotificationAPIURL } from './getNotificationAPIURL';
import { NotificationResponseObjectSchedule } from './index';
import { requestNotificationAPI } from './loader';

export async function scheduleNotificationMessage(message: string, scheduled_time: Date): Promise<NotificationResponseObjectSchedule | false> {
  const url = await getNotificationAPIURL('schedule', [message, scheduled_time]);
  if (url === false) {
    return false;
  } else {
    const result = await requestNotificationAPI(url);
    if (result === false) {
      return result as false;
    } else {
      return result as NotificationResponseObjectSchedule;
    }
  }
}
