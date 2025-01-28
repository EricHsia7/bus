import { NotificationClientID, NotificationSecret, saveNotificationClient, setNotificationSecret } from '../../index';
import { getNotificationAPIURL } from '../getNotificationAPIURL/index';
import { getNotificationRequestBody } from '../getNotificationRequestBody/index';
import { makeNotificationRequest } from '../loader';

export async function rotateNotificationSecret(): Promise<boolean> {
  if (NotificationClientID === '' || NotificationSecret === '') {
    return false;
  }
  const url = getNotificationAPIURL('rotate');
  const requestBody = getNotificationRequestBody('rotate', []);
  const response = await makeNotificationRequest('rotate', url, requestBody);
  if (response === false) {
    return false;
  } else {
    if (response.code === 200 && response.method === 'rotate') {
      setNotificationSecret(response.secret);
      await saveNotificationClient();
      return true;
    } else {
      return false;
    }
  }
}
