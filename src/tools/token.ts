import { NotificationClient } from '../data/notification/index';
import { sha256 } from './index';

export function generateToken(client_id: NotificationClient['client_id'], secret: NotificationClient['secret'], payload: object): string {
  const now = new Date().getTime();
  const window = 10 * 1000;
  const i = (now - (now % window)) / window;
  const result = sha256(`${client_id} ${secret} ${i.toString(16)} ${JSON.stringify(payload)}`);
  return result;
}
