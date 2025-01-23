import { generateTOTPToken } from '../../tools/totp';

type responseCode = 200 | 400 | 401 | 404 | 500;

interface ResponseObjectCancel {
  result: string;
  code: responseCode;
  method: 'cancel';
}

interface ResponseObjectRegister {
  result: string;
  code: responseCode;
  method: 'register';
  client_id: string | 'null';
  secret: string | 'null';
}

interface ResponseObjectSchedule {
  result: string;
  code: responseCode;
  method: 'schedule';
  schedule_id: string | 'null';
}

interface ResponseObjectUpdate {
  result: string;
  code: responseCode;
  method: 'update';
}

type ResponseObject = ResponseObjectCancel | ResponseObjectRegister | ResponseObjectSchedule | ResponseObjectUpdate;

function getNotificationAPIURL(provider: string, method: ResponseObject['method'], parameters: Array<any>): string {
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

async function requestNotificationAPI(url: string): Promise<object | false> {
  try {
    // Send the request
    const response = await fetch(url, {
      method: 'POST',
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
      const text = await response.text();
      const json = JSON.parse(text);
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

export async function cancelNotificationMessage(provider: string, clientID: string, secret: string, scheduleID: string): Promise<ResponseObjectCancel | false> {
  const url = getNotificationAPIURL(provider, 'register', [clientID, secret, scheduleID]);
  const result = await requestNotificationAPI(url);
  if (result === false) {
    return result as false;
  } else {
    return result as ResponseObjectCancel;
  }
}

export async function registerNotification(provider: string, telegramBotToken: string, telegramChatID: number): Promise<ResponseObjectRegister | false> {
  const url = getNotificationAPIURL(provider, 'register', [telegramBotToken, telegramChatID]);
  const result = await requestNotificationAPI(url);
  if (result === false) {
    return result as false;
  } else {
    return result as ResponseObjectRegister;
  }
}

export async function scheduleNotificationMessage(provider: string, clientID: string, secret: string, message: string, scheduled_time: Date): Promise<ResponseObjectSchedule | false> {
  const url = getNotificationAPIURL(provider, 'register', [clientID, secret, message, scheduled_time]);
  const result = await requestNotificationAPI(url);
  if (result === false) {
    return result as false;
  } else {
    return result as ResponseObjectSchedule;
  }
}

export async function updateNotification(provider: string, clientID: string, secret: string, telegramBotToken: string, telegramChatID: number): Promise<ResponseObjectUpdate | false> {
  const url = getNotificationAPIURL(provider, 'register', [clientID, secret, telegramBotToken, telegramChatID]);
  const result = await requestNotificationAPI(url);
  if (result === false) {
    return result as false;
  } else {
    return result as ResponseObjectUpdate;
  }
}
