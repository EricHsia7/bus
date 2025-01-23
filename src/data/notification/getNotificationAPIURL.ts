import { generateTOTPToken } from '../../tools/totp';
import { getNotificationProvider, NotificationResponseObject } from './index';

export async function getNotificationAPIURL(method: NotificationResponseObject['method'], parameters: Array<any>): Promise<string | false> {
  const provider = await getNotificationProvider();
  if (provider === false) {
    return false;
  } else {
    const url = new URL(provider);
    switch (method) {
      case 'cancel':
        const [cnacel_clientID, cancel_secret, cancel_scheduleID] = parameters;
        const cancelToken = generateTOTPToken(cnacel_clientID, cancel_secret);
        url.searchParams.set('method', 'schedule');
        url.searchParams.set('client_id', cnacel_clientID);
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
        url.searchParams.set('scheduled_time', schedule_scheduledTime.toISOString());
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
