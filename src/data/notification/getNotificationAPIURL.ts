import { getNoCacheParameter } from '../../tools/index';
import { generateTOTPToken } from '../../tools/totp';
import { NotificationResponseObject } from './index';

export async function getNotificationAPIURL(provider: string, method: NotificationResponseObject['method'], parameters: Array<any>): Promise<string | false> {
  if (provider === false) {
    return false;
  } else {
    const url = new URL(provider);
    url.searchParams.set('_', getNoCacheParameter(30000));
    switch (method) {
      case 'cancel':
        const [cancel_clientID, cancel_secret, cancel_scheduleID] = parameters;
        const cancelToken = generateTOTPToken(cancel_clientID, cancel_secret);
        url.searchParams.set('method', 'schedule');
        url.searchParams.set('client_id', cancel_clientID);
        url.searchParams.set('totp_token', cancelToken);
        url.searchParams.set('schedule_id', cancel_scheduleID);
        break;
      case 'register':
        const [register_telegramBotToken, register_telegramChatID] = parameters;
        url.searchParams.set('method', 'register');
        url.searchParams.set('token', register_telegramBotToken);
        url.searchParams.set('chat_id', register_telegramChatID);
        break;
      case 'schedule':
        const [schedule_clientID, schedule_secret, schedule_message, schedule_scheduledTime] = parameters;
        const scheduleToken = generateTOTPToken(schedule_clientID, schedule_secret);
        url.searchParams.set('method', 'schedule');
        url.searchParams.set('client_id', schedule_clientID);
        url.searchParams.set('totp_token', scheduleToken);
        url.searchParams.set('message', schedule_message);
        url.searchParams.set('scheduled_time', new Date(schedule_scheduledTime).toISOString());
        break;
      case 'update':
        const [update_clientID, update_secret, update_telegramBotToken, update_telegramChatID] = parameters;
        const updateToken = generateTOTPToken(update_clientID, update_secret);
        url.searchParams.set('method', 'update');
        url.searchParams.set('client_id', update_clientID);
        url.searchParams.set('totp_token', updateToken);
        url.searchParams.set('token', update_telegramBotToken);
        url.searchParams.set('chat_id', update_telegramChatID);
        break;
      default:
        break;
    }
    return url.toString();
  }
}
