import { saveNotificationClient, setNotificationClientID, setNotificationSecret } from '../..';
import { getNotificationAPIURL } from '../getNotificationAPIURL/index';
import { getNotificationRequestBody } from '../getNotificationRequestBody/index';
import { makeNotificationRequest } from '../loader';

export async function registerNotificationClient(registrationKey: string): Promise<boolean> {
  if (!registrationKey) {
    return false;
  }
  const url = getNotificationAPIURL('register');
  const requestBody = getNotificationRequestBody('register', [registrationKey]);
  const response = await makeNotificationRequest('register', url, requestBody);
  if (response === false) {
    return false;
  } else {
    if (response.code === 200 && response.method === 'register') {
      setNotificationClientID(response.client_id)
      setNotificationSecret(response.secret)
      await saveNotificationClient();
      return true;
    } else {
      return false;
    }
  }
}
