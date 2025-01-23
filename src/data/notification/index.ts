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
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
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

export async function scheduleMessage(notificationAPI: string, clientID: string, secret: string, message: string, scheduled_time: Date): Promise<NotificationScheduleResponse | false> {
  try {
    // Validate inputs
    if (!notificationAPI || !clientID || !secret || !message || !(scheduled_time instanceof Date)) {
      throw new Error('Invalid input parameters');
    }

    const url = new URL(notificationAPI);
    url.searchParams.set('method', 'schedule');
    url.searchParams.set('client_id', clientID);

    // Generate the TOTP token
    const token = generateTOTPToken(clientID, secret);
    if (!token) throw new Error('Failed to generate TOTP token');

    // Set remaining query parameters
    url.searchParams.set('totp_token', token);
    url.searchParams.set('message', message);
    url.searchParams.set('scheduled_time', scheduled_time.toISOString());

    // Send the request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      // Log additional details for debugging
      const errorText = await response.text();
      console.error('API request failed', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return false;
    }

    // Attempt to parse the JSON response
    try {
      const json = (await response.json()) as NotificationScheduleResponse;
      return json;
    } catch (jsonError) {
      console.error('Failed to parse JSON response', jsonError);
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    // Catch and log errors
    console.error('Error scheduling message:', error);
    return false;
  }
}
