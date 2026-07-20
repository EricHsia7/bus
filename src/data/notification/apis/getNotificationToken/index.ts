import { sha512 } from '../../../../tools/index';
import { NotificationClient } from '../../index';

export function getNotificationToken(client_id: NotificationClient['client_id'], secret: NotificationClient['secret'], payload: object): string {
  const now = new Date().getTime();
  const window = 5 * 1000;
  const i = (now - (now % window)) / window;
  const payloadHash = sha512(`${sha512(client_id)}\n${sha512(secret)}\n${sha512(JSON.stringify(payload))}`);
  const result = sha512(sha512(`${client_id}\n${secret}\n${i}\n${payloadHash}}`));
  return result;
}
