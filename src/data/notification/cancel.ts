import { getNotificationAPIURL } from './getNotificationAPIURL';
import { NResponseCancel } from './index';
import { requestNotificationAPI } from './loader';

export async function cancelNotificationSchedule(provider: string, clientID, secret, scheduleID: string): Promise<NResponseCancel | false> {
  const url = await getNotificationAPIURL(provider, 'cancel', [clientID, secret, scheduleID]);
  if (url === false) {
    return false;
  } else {
    const result = await requestNotificationAPI(url);
    if (result === false) {
      return result as false;
    } else {
      return result as NResponseCancel;
    }
  }
}
