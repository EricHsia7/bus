import { getNotificationAPIURL } from './getNotificationAPIURL';
import { NotificationResponseObjectSchedule } from './index';
import { requestNotificationAPI } from './loader';

export async function scheduleNotificationMessage(provider: string, clientID: string, secret: string, message: string, scheduled_time: Date): Promise<NotificationResponseObjectSchedule | false> {
  const url = getNotificationAPIURL(provider, 'register', [clientID, secret, message, scheduled_time]);
  const result = await requestNotificationAPI(url);
  if (result === false) {
    return result as false;
  } else {
    return result as NotificationResponseObjectSchedule;
  }
}
