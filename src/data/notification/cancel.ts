import { getNotificationAPIURL } from './getNotificationAPIURL';
import { NotificationResponseObjectCancel } from './index';
import { requestNotificationAPI } from './loader';

export async function cancelNotificationSchedule(scheduleID: string): Promise<NotificationResponseObjectCancel | false> {
  const url = await getNotificationAPIURL('cancel', [scheduleID]);
  if (url === false) {
    return false;
  } else {
    const result = await requestNotificationAPI(url);
    if (result === false) {
      return result as false;
    } else {
      return result as NotificationResponseObjectCancel;
    }
  }
}
