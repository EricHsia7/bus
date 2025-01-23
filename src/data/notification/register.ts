import { getNotificationAPIURL } from './getNotificationAPIURL';
import { NotificationResponseObjectRegister } from './index';
import { requestNotificationAPI } from './loader';

export async function registerNotification(provider: string, telegramBotToken: string, telegramChatID: number): Promise<NotificationResponseObjectRegister | false> {
  const url = getNotificationAPIURL(provider, 'register', [telegramBotToken, telegramChatID]);
  const result = await requestNotificationAPI(url);
  if (result === false) {
    return result as false;
  } else {
    return result as NotificationResponseObjectRegister;
  }
}
