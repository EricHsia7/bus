import { getNotificationAPIURL } from './getNotificationAPIURL';
import { NotificationResponseObjectUpdate } from './index';
import { requestNotificationAPI } from './loader';

export async function updateNotification(provider: string, clientID: string, secret: string, telegramBotToken: string, telegramChatID: number): Promise<NotificationResponseObjectUpdate | false> {
  const url = getNotificationAPIURL(provider, 'update', [clientID, secret, telegramBotToken, telegramChatID]);
  const result = await requestNotificationAPI(url);
  if (result === false) {
    return result as false;
  } else {
    return result as NotificationResponseObjectUpdate;
  }
}
