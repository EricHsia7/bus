import { generateTOTPToken } from '../../tools/totp';
import { NotificationResponseObject } from './index';

export function getNotificationAPIURL(provider: string, method: NotificationResponseObject['method'], parameters: Array<any>): string {
  const url = new URL(provider);
  switch (method) {
    case 'cancel':
      const [clientID, secret, scheduleID] = parameters;
      const cancelToken = generateTOTPToken(clientID, secret);
      url.searchParams.set('method', 'schedule');
      url.searchParams.set('client_id', clientID);
      url.searchParams.set('totp_token', cancelToken);
      url.searchParams.set('schedule_id', scheduleID);
      break;
    case 'register':
      const [telegramBotToken, telegramChatID] = parameters;
      url.searchParams.set('method', 'register');
      url.searchParams.set('token', telegramBotToken);
      url.searchParams.set('chat_id', telegramChatID);
      break;
    case 'schedule':
      const [clientID, secret, message, scheduled_time] = parameters;
      const scheduleToken = generateTOTPToken(clientID, secret);
      url.searchParams.set('method', 'schedule');
      url.searchParams.set('client_id', clientID);
      url.searchParams.set('totp_token', scheduleToken);
      url.searchParams.set('message', message);
      url.searchParams.set('scheduled_time', scheduled_time.toISOString());
      break;
    case 'update':
      const [clientID, secret, telegramBotToken, telegramChatID] = parameters;
      const updateToken = generateTOTPToken(clientID, secret);
      url.searchParams.set('method', 'update');
      url.searchParams.set('client_id', clientID);
      url.searchParams.set('totp_token', updateToken);
      url.searchParams.set('token', telegramBotToken);
      url.searchParams.set('chat_id', telegramChatID);
      break;
    default:
      break;
  }
  return url.toString();
}
