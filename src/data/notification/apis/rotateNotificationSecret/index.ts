import { NotificationClientID, NotificationSecret, saveNotificationClient, setNotificationSecret } from '../../index';
import { getNotificationAPIURL } from '../getNotificationAPIURL/index';
import { getNotificationRequestBody } from '../getNotificationRequestBody/index';
import { makeNotificationRequest, NotificationResponseCode } from '../loader';

export async function rotateNotificationSecret(): Promise<NotificationResponseCode | false> {
  if (NotificationClientID === '' || NotificationSecret === '') {
    return false;
  }
  const url = getNotificationAPIURL('rotate');
  const requestBody = getNotificationRequestBody('rotate', []);
  const response = await makeNotificationRequest('rotate', url, requestBody);
  if (response === false) return false;
  if (response.method !== 'rotate') return false;
  if (response.code === 0) {
    setNotificationSecret(response.secret);
    await saveNotificationClient();
  }
  return response.code;
}
