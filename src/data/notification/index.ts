import { generateTOTPToken } from '../../tools/totp';

export interface NotificationRegistryResponse {
  result: 'successful';
  client_id: string;
  secret: string;
}

export async function registerNotificationClient(notificationAPI: string, telegramBotToken: string, telegramChatID: number): Promise<NotificationRegistryResponse | false> {
  const url = new URL(notificationAPI);
  url.searchParams.set('method', 'register');
  url.searchParams.set('token', telegramBotToken);
  url.searchParams.set('chat_id', telegramChatID);
  const response = await fetch(url.toString(), { method: 'POST' });
  if (response.ok) {
    const json = (await response.json()) as NotificationRegistryResponse;
    return json;
  } else {
    return false;
  } // TODO: show error message
}

export interface NotificationScheduleResponse {
  result: 'successfull';
  schedule_id: string;
}

export async function scheduleMessage(notificationAPI: string, clientID: string, secret: string): Promise<NotificationScheduleResponse | false> {
  const url = new URL(notificationAPI);
  url.searchParams.set('method', 'schedule');
  url.searchParams.set('client_id', clientID);
  const token = generateTOTPToken(clientID, secret);
  url.searchParams.set('totp_token', token);
  const response = await fetch(url.toString(), { method: 'POST' });
  if (response.ok) {
    const json = (await response.json()) as NotificationScheduleResponse;
    return json;
  } else {
    return false;
  }
}
