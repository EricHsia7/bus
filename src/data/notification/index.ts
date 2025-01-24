import { isValidURL } from '../../tools/index';
import { generateTOTPToken } from '../../tools/totp';
import { lfGetItem, lfSetItem } from '../storage/index';

export type NResponseCode = 200 | 400 | 401 | 404 | 500;

export interface NResponseCancel {
  result: string;
  code: NResponseCode;
  method: 'cancel';
}

export interface NResponseRegister {
  result: string;
  code: NResponseCode;
  method: 'register';
  client_id: string | 'null';
  secret: string | 'null';
}

export interface NResponseSchedule {
  result: string;
  code: NResponseCode;
  method: 'schedule';
  schedule_id: string | 'null';
}

export interface NResponseUpdate {
  result: string;
  code: NResponseCode;
  method: 'update';
}

export type NResponse = NResponseCancel | NResponseRegister | NResponseSchedule | NResponseUpdate;

export interface NClient {
  provider: string;
  client_id: string;
  secret: string;
  token: string;
  chat_id: number;
}

const notificationProviderKey = 'n_provider';

export async function setNotificationProvider(provider: string): Promise<boolean> {
  await lfSetItem(7, notificationProviderKey, provider);
  return true;
}

export async function getNotificationProvider(): Promise<string | false> {
  const existingNotificationProvider = await lfGetItem(7, notificationProviderKey);
  if (existingNotificationProvider) {
    return existingNotificationProvider;
  }
  return false;
}

export async function hasNotificationProvider(): Promise<boolean> {
  const existingNotificationProvider = await lfGetItem(7, notificationProviderKey);
  if (existingNotificationProvider) {
    return true;
  } else {
    return false;
  }
}

const notificationTokenKey = 'n_token';

export async function setNotificationToken(token: string): Promise<boolean> {
  await lfSetItem(7, notificationTokenKey, token);
  return true;
}

export async function getNotificationToken(): Promise<string | false> {
  const existingNotificationToken = await lfGetItem(7, notificationTokenKey);
  if (existingNotificationToken) {
    return existingNotificationToken;
  }
  return false;
}

export async function hasNotificationToken(): Promise<boolean> {
  const existingNotificationToken = await lfGetItem(7, notificationTokenKey);
  if (existingNotificationToken) {
    return true;
  } else {
    return false;
  }
}

const notificationChatIDKey = 'n_chat_id';

export async function setNotificationChatID(chatID: string): Promise<boolean> {
  await lfSetItem(7, notificationChatIDKey, chatID);
  return true;
}

export async function getNotificationChatID(): Promise<string | false> {
  const existingNotificationChatID = await lfGetItem(7, notificationChatIDKey);
  if (existingNotificationChatID) {
    return existingNotificationChatID;
  }
  return false;
}

export async function hasNotificationChatID(): Promise<boolean> {
  const existingNotificationChatID = await lfGetItem(7, notificationChatIDKey);
  if (existingNotificationChatID) {
    return true;
  } else {
    return false;
  }
}

export class NotificationAPI {
  private provider: NClient['provider'] = ''; // base url
  private client_id: NClient['client_id'] = '';
  private secret: NClient['secret'] = '';
  private telegramBotToken: NClient['token'] = '';
  private telegramChatID: NClient['chat_id'] = 0;

  constructor(provider: string) {
    if (isValidURL(provider)) {
      this.provider = provider;
    } else {
      throw new Error('The provider is not valid.');
    }
  }

  private getURL(method: NResponse['method'], parameters: Array<any>): string | false {
    if (this.provider === '') {
      return false;
    }
    const url = new URL(this.provider);
    switch (method) {
      case 'cancel':
        if (this.client_id === '' || this.secret === '' || !(parameters.length === 1)) {
          return false;
        }
        url.searchParams.set('method', 'schedule');
        url.searchParams.set('client_id', this.client_id);
        url.searchParams.set('totp_token', generateTOTPToken(this.client_id, this.secret));
        url.searchParams.set('schedule_id', parameters[0]);
        break;
      case 'register':
        if (!(parameters.length === 2)) {
          return false;
        }
        url.searchParams.set('method', 'register');
        url.searchParams.set('token', parameters[0]);
        url.searchParams.set('chat_id', parameters[1]);
        break;
      case 'schedule':
        if (this.client_id === '' || this.secret === '' || !(parameters.length === 2)) {
          return false;
        }
        url.searchParams.set('method', 'schedule');
        url.searchParams.set('client_id', this.client_id);
        url.searchParams.set('totp_token', generateTOTPToken(this.client_id, this.secret));
        url.searchParams.set('message', parameters[0]);
        url.searchParams.set('scheduled_time', parameters[1]);
        break;
      case 'update':
        if (this.client_id === '' || this.secret === '' || !(parameters.length === 2)) {
          return false;
        }
        url.searchParams.set('method', 'update');
        url.searchParams.set('client_id', this.client_id);
        url.searchParams.set('totp_token', generateTOTPToken(this.client_id, this.secret));
        url.searchParams.set('token', parameters[0]);
        url.searchParams.set('chat_id', parameters[1]);
        break;
      default:
        return false;
        break;
    }
    return url.toString();
  }

  private async makeRequest(method: NResponse['method'], url: string): Promise<NResponse | false> {
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
        switch (method) {
          case 'cancel':
            return json as NResponseCancel;
            break;
          case 'register':
            return json as NResponseRegister;
            break;
          case 'schedule':
            return json as NResponseSchedule;
            break;
          case 'update':
            return json as NResponseUpdate;
            break;
            return false;
          default:
            break;
        }
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

  private async saveClient() {
    await lfSetItem(
      7,
      'n_client',
      JSON.stringify({
        provider: this.provider,
        client_id: this.client_id,
        secret: this.secret,
        token: this.telegramBotToken,
        chat_id: this.telegramChatID
      })
    );
  }

  private async loadClient() {
    const existingClient = await lfGetItem(7, 'n_client');
    if (existingClient) {
      const existingClientObject = JSON.parse(existingClient);
    }
  }

  public async register(telegramBotToken: NClient['token'], telegramChatID: NClient['chat_id']): Promise<boolean> {
    if (!telegramBotToken || !telegramChatID) {
      return false;
    }
    const url = this.getURL('register', [telegramBotToken, telegramChatID]);
    const response = await this.makeRequest('register', url);
    if (response === false) {
      return false;
    } else {
      if (response.code === 200 && response.method === 'register') {
        this.telegramBotToken = telegramBotToken;
        this.telegramChatID = telegramChatID;
        this.secret = response.secret;
        this.client_id = response.client_id;
        await this.saveClient();
        return true;
      } else {
        return false;
      }
    }
  }

  public async login(client_id: NClient['client_id'], secret: NClient['secret']) {
    if (!client_id || !secret) {
      loadClient();
    } else {
      this.client_id = client_id;
      this.secret = secret;
    }
  }

  public async schedule(message: string, scheduled_time: string | number | Date): Promise<string | false> {
    if (this.client_id === '' || this.secret === '' || !message || !scheduled_time) {
      return false;
    }
    let processed_schedule_time = '';
    switch (typeof scheduled_time) {
      case 'string':
        processed_schedule_time = scheduled_time;
        break;
      case 'number':
        processed_schedule_time = new Date(scheduled_time).toISOString();
        break;
      default:
        if (scheduled_time instanceof Date) {
          processed_schedule_time = scheduled_time.toISOString();
        } else {
          return false;
        }
        break;
    }
    const url = this.getURL('schedule', [message, processed_schedule_time]);
    const response = await this.makeRequest('schedule', url);
    if (response === false) {
      return false;
    } else {
      if (response.code === 200 && response.method === 'schedule') {
        return response.schedule_id;
      } else {
        return false;
      }
    }
  }

  public async cancel(schedule_id: string): Promise<boolean> {
    if (this.client_id === '' || this.secret === '' || !schedule_id) {
      return false;
    }
    const url = this.getURL('cancel', [schedule_id]);
    const response = await this.makeRequest('cancel', url);
    if (response === false) {
      return false;
    } else {
      if (response.code === 200 && response.method === 'cancel') {
        return true;
      } else {
        return false;
      }
    }
  }

  public async update(telegramBotToken: NClient['token'], telegramChatID: NClient['chat_id']): Promise<boolean> {
    if (this.client_id === '' || this.secret === '' || !telegramBotToken || !telegramChatID) {
      return false;
    }
    const url = this.getURL('update', [telegramBotToken, telegramChatID]);
    const response = await this.makeRequest('update', url);
    if (response === false) {
      return false;
    } else {
      if (response.code === 200 && response.method === 'update') {
        return true;
      } else {
        return false;
      }
    }
  }
}
