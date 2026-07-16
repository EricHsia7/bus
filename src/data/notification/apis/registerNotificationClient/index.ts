import { saveNotificationClient, setNotificationClientID, setNotificationSecret } from '../..';
import { getNotificationAPIURL } from '../getNotificationAPIURL/index';
import { getNotificationRequestBody } from '../getNotificationRequestBody/index';
import { makeNotificationRequest, NotificationResponseCode } from '../loader';

export async function registerNotificationClient(registrationKey: string): Promise<NotificationResponseCode | false> {
  if (!registrationKey) {
    return false;
  }
  const url = getNotificationAPIURL('register');
  const requestBody = getNotificationRequestBody('register', [registrationKey]);
  const response = await makeNotificationRequest('register', url, requestBody);
  if (response === false) return false;
  if (response.method !== 'register') return false;
  if (response.code === 0) {
    setNotificationClientID(response.client_id);
    setNotificationSecret(response.secret);
    await saveNotificationClient();
  }
  return response.code;
}
