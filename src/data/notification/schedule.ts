import { getProvider } from '../apis/getProvider/index';
import { getNotificationAPIURL } from './getNotificationAPIURL';
import { NotificationResponseObjectSchedule } from './index';
import { requestNotificationAPI } from './loader';
import { getNotificationRegister } from './register';

export async function scheduleNotificationMessage(provider: string, client_id: string, secret: string, message: string, scheduled_time: string): Promise<NotificationResponseObjectSchedule | false> {
  const url = await getNotificationAPIURL(provider, 'schedule', [client_id, secret, message, scheduled_time]);
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

export async function scheduleNotificationMessageForRegisteredClient(message: string, scheduled_time: string): Promise<NotificationResponseObjectSchedule | false> {
  const existingNotificationRegister = await getNotificationRegister();
  const existingProvider = await getProvider();
  if (existingNotificationRegister === false || existingProvider === false) {
    return false;
  } else {
    const result = scheduleNotificationMessage(existingProvider, existingNotificationRegister.client_id, existingNotificationRegister.secret, message, scheduled_time);
    return result;
  }
}
