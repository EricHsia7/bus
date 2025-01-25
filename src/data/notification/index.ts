import { MaterialSymbols } from '../../interface/icons/material-symbols-type';
import { isValidURL, sha256 } from '../../tools/index';
import { generateTOTPToken } from '../../tools/totp';
import { lfGetItem, lfSetItem } from '../storage/index';

type NResponseCode = 200 | 400 | 401 | 404 | 500;

interface NResponseCancel {
  result: string;
  code: NResponseCode;
  method: 'cancel';
}

interface NResponseRegister {
  result: string;
  code: NResponseCode;
  method: 'register';
  client_id: string | 'null';
  secret: string | 'null';
}

interface NResponseSchedule {
  result: string;
  code: NResponseCode;
  method: 'schedule';
  schedule_id: string | 'null';
}

interface NResponseRotate {
  result: string;
  code: NResponseCode;
  method: 'rotate';
  secret: string | 'null';
}

type NResponse = NResponseCancel | NResponseRegister | NResponseSchedule | NResponseRotate;

interface NClientFrontend {
  provider: string;
  client_id: string;
  secret: string;
}

export class NotificationAPI {
  private provider: NClientFrontend['provider'] = ''; // base url
  private client_id: NClientFrontend['client_id'] = '';
  private secret: NClientFrontend['secret'] = '';

  constructor() {}

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
        if (!(parameters.length === 1)) {
          return false;
        }
        const currentDate = new Date();
        currentDate.setMilliseconds(0);
        currentDate.setSeconds(0);
        url.searchParams.set('method', 'register');
        url.searchParams.set('hash', sha256(`${parameters[0]}${currentDate.getTime()}`));
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
      case 'rotate':
        if (this.client_id === '' || this.secret === '' || !(parameters.length === 0)) {
          return false;
        }
        url.searchParams.set('method', 'rotate');
        url.searchParams.set('client_id', this.client_id);
        url.searchParams.set('totp_token', generateTOTPToken(this.client_id, this.secret));
        break;
      default:
        return false;
        break;
    }
    return url.toString();
  }

  private async makeRequest(method: NResponse['method'], url: string | false): Promise<NResponse | false> {
    try {
      if (url === false) {
        return false;
      }
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
          case 'rotate':
            return json as NResponseRotate;
            break;
          default:
            return false;
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
    const currentClient: NClientFrontend = {
      provider: this.provider,
      client_id: this.client_id,
      secret: this.secret
    };
    await lfSetItem(7, 'n_client', JSON.stringify(currentClient));
  }

  private async loadClient() {
    const existingClient = await lfGetItem(7, 'n_client');
    if (existingClient) {
      const existingClientObject = JSON.parse(existingClient) as NClientFrontend;
      this.provider = existingClientObject.provider;
      this.client_id = existingClientObject.client_id;
      this.secret = existingClientObject.secret;
    }
  }

  public getStatus(): boolean {
    if (this.client_id === '' || this.secret === '') {
      return false;
    } else {
      return true;
    }
  }

  public setProvider(provider: NClientFrontend['provider']): void {
    if (isValidURL(provider)) {
      this.provider = provider;
    } else {
      throw new Error('The provider is not valid.');
    }
  }

  public getProvider(): NClientFrontend['provider'] {
    return this.provider;
  }

  public async register(registrationKey: string): Promise<boolean> {
    if (!registrationKey) {
      return false;
    }
    const url = this.getURL('register', [registrationKey]);
    const response = await this.makeRequest('register', url);
    if (response === false) {
      return false;
    } else {
      if (response.code === 200 && response.method === 'register') {
        this.client_id = response.client_id;
        this.secret = response.secret;
        await this.saveClient();
        return true;
      } else {
        return false;
      }
    }
  }

  public async login(client_id: NClientFrontend['client_id'], secret: NClientFrontend['secret']) {
    if (!client_id || !secret) {
      await this.loadClient();
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
        if (Math.random() > 0.7) {
          await this.rotate();
        }
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

  public async rotate(): Promise<boolean> {
    if (this.client_id === '' || this.secret === '') {
      return false;
    }
    const url = this.getURL('rotate', []);
    const response = await this.makeRequest('rotate', url);
    if (response === false) {
      return false;
    } else {
      if (response.code === 200 && response.method === 'rotate') {
        this.secret = response.secret;
        await this.saveClient();
        return true;
      } else {
        return false;
      }
    }
  }
}

export let currentNotificationAPI = new NotificationAPI();

export interface ScheduleNotificationOption {
  name: string;
  status: string;
  timeOffset: number;
  icon: MaterialSymbols;
  index: number;
}

export type ScheduleNotificationOptions = Array<ScheduleNotificationOption>;

export const scheduleNotificationOptions: ScheduleNotificationOptions = [
  {
    name: '到站前5分鐘',
    status: '公車將在5分鐘內進站',
    timeOffset: -5,
    icon: 'clock_loader_10',
    index: 0
  },
  {
    name: '到站前10分鐘',
    status: '公車將在10分鐘內進站',
    timeOffset: -10,
    icon: 'clock_loader_20',
    index: 1
  },
  {
    name: '到站前15分鐘',
    status: '公車將在15分鐘內進站',
    timeOffset: -15,
    icon: 'clock_loader_40',
    index: 2
  },
  {
    name: '到站前20分鐘',
    status: '公車將在20分鐘內進站',
    timeOffset: -20,
    icon: 'clock_loader_60',
    index: 3
  },
  {
    name: '到站前25分鐘',
    status: '公車將在25分鐘內進站',
    timeOffset: -25,
    icon: 'clock_loader_80',
    index: 4
  },
  {
    name: '到站前30分鐘',
    status: '公車將在30分鐘內進站',
    timeOffset: -30,
    icon: 'clock_loader_90',
    index: 5
  }
];
