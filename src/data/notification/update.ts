import { getNotificationAPIURL } from './getNotificationAPIURL';
import { NResponseUpdate } from './index';
import { requestNotificationAPI } from './loader';

export async function updateNotification(provider: string, client_id: string, secret: string, telegramBotToken: string, telegramChatID: number): Promise<NResponseUpdate | false> {
  const url = await getNotificationAPIURL(provider, 'update', [client_id, secret, telegramBotToken, telegramChatID]);
  if (url === false) {
    return false;
  } else {
    const result = await requestNotificationAPI(url);
    if (result === false) {
      return result as false;
    } else {
      return result as NResponseUpdate;
    }
  }
}
