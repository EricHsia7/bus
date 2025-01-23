import { getNotificationAPIURL } from './getNotificationAPIURL';
import { NotificationResponseObjectCancel } from './index';
import { requestNotificationAPI } from './loader';

export async function cancelNotificationSchedule(provider: string, clientID: string, secret: string, scheduleID: string): Promise<NotificationResponseObjectCancel | false> {
  const url = getNotificationAPIURL(provider, 'cancel', [clientID, secret, scheduleID]);
  const result = await requestNotificationAPI(url);
  if (result === false) {
    return result as false;
  } else {
    return result as NotificationResponseObjectCancel;
  }
}
