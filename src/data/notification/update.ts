import { getNotificationAPIURL } from './getNotificationAPIURL';
import { NotificationResponseObjectUpdate } from './index';
import { requestNotificationAPI } from './loader';

export async function updateNotification(clientID: string, secret: string, telegramBotToken: string, telegramChatID: number): Promise<NotificationResponseObjectUpdate | false> {
  const url = await getNotificationAPIURL('update', [clientID, secret, telegramBotToken, telegramChatID]);
  if (url === false) {
    return false;
  } else {
    const result = await requestNotificationAPI(url);
    if (result === false) {
      return result as false;
    } else {
      return result as NotificationResponseObjectUpdate;
    }
  }
}
