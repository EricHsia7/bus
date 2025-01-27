import { MaterialSymbols } from '../../interface/icons/material-symbols-type';
import { isValidURL } from '../../tools/index';
import { lfGetItem, lfListItemKeys, lfSetItem } from '../storage/index';

export interface NClientFrontend {
  provider: string;
  client_id: string;
  secret: string;
}

export interface NScheduleFrontend {
  schedule_id: string;
  stop_id: number;
  location_name: string;
  route_id: number;
  route_name: string;
  direction: string;
  estimate_time: number;
  time_formatting_mode: number;
  scheduled_time: number;
}

export let NotificationProvider: NClientFrontend['provider'] = ''; // base url
export let NotificationClientID: NClientFrontend['client_id'] = '';
export let NotificationSecret: NClientFrontend['secret'] = '';

export async function saveNotificationClient() {
  const currentClient: NClientFrontend = {
    provider: NotificationProvider,
    client_id: NotificationClientID,
    secret: NotificationSecret
  };
  await lfSetItem(7, 'n_client', JSON.stringify(currentClient));
}

export async function loginNotification() {
  const existingClient = await lfGetItem(7, 'n_client');
  if (existingClient) {
    const existingClientObject = JSON.parse(existingClient) as NClientFrontend;
    NotificationProvider = existingClientObject.provider;
    NotificationClientID = existingClientObject.client_id;
    NotificationSecret = existingClientObject.secret;
  }
}

export async function saveNotificationSchedule(schedule_id: NScheduleFrontend['schedule_id'], stop_id: NScheduleFrontend['stop_id'], location_name: NScheduleFrontend['location_name'], route_id: NScheduleFrontend['route_id'], route_name: NScheduleFrontend['route_name'], direction: NScheduleFrontend['direction'], estimate_time: NScheduleFrontend['estimate_time'], time_formatting_mode: NScheduleFrontend['time_formatting_mode'], scheduled_time: NScheduleFrontend['scheduled_time']) {
  const thisSchedule: NScheduleFrontend = {
    schedule_id: schedule_id,
    stop_id: stop_id,
    location_name: location_name,
    route_id: route_id,
    route_name: route_name,
    direction: direction,
    estimate_time: estimate_time,
    time_formatting_mode: time_formatting_mode,
    scheduled_time: scheduled_time
  };
  await lfSetItem(8, schedule_id, JSON.stringify(thisSchedule));
}

export async function modifyNotificationSchedule(schedule_id: NScheduleFrontend['schedule_id'], estimate_time: NScheduleFrontend['estimate_time'], scheduled_time: NScheduleFrontend['scheduled_time']) {
  const existingSchedule = await lfGetItem(8, schedule_id);
  if (existingSchedule) {
    const existingScheduleObject = JSON.parse(existingSchedule);
    const thisSchedule: NScheduleFrontend = {
      schedule_id: schedule_id,
      stop_id: existingScheduleObject.stop_id,
      location_name: existingScheduleObject.location_name,
      route_id: existingScheduleObject.route_id,
      route_name: existingScheduleObject.route_name,
      direction: existingScheduleObject.direction,
      estimate_time: estimate_time,
      time_formatting_mode: existingScheduleObject.time_formatting_mode,
      scheduled_time: scheduled_time
    };
    await lfSetItem(8, schedule_id, JSON.stringify(thisSchedule));
  }
}

export async function listNotifcationSchedules(): Promise<Array<NScheduleFrontend>> {
  const now = new Date().getTime();
  const keys = await lfListItemKeys(8);
  let result = [];
  for (const key of keys) {
    const thisScheduleJSON = await lfGetItem(8, key);
    const thisSchedule = JSON.parse(thisScheduleJSON) as NScheduleFrontend;
    const thisScheduledTime = thisSchedule.scheduled_time;
    if (thisScheduledTime > now) {
      result.push(thisSchedule);
    }
  }
  return result;
}

export function getNotificationStatus(): boolean {
  if (NotificationClientID === '' || NotificationSecret === '') {
    return false;
  } else {
    return true;
  }
}

export function setNotificationProvider(provider: NClientFrontend['provider']): void {
  if (isValidURL(provider)) {
    const url = new URL(provider);
    NotificationProvider = `${url.protocol}//${url.hostname}`;
  } else {
    throw new Error('The provider is not valid.');
  }
}

export function getNotificationProvider(): NClientFrontend['provider'] {
  return String(NotificationProvider);
}

export interface ScheduleNotificationOption {
  name: string;
  timeOffset: number;
  icon: MaterialSymbols;
  index: number;
}

export type ScheduleNotificationOptions = Array<ScheduleNotificationOption>;

export const scheduleNotificationOptions: ScheduleNotificationOptions = [
  {
    name: '到站前5分鐘',
    timeOffset: -5,
    icon: 'clock_loader_10',
    index: 0
  },
  {
    name: '到站前10分鐘',
    timeOffset: -10,
    icon: 'clock_loader_20',
    index: 1
  },
  {
    name: '到站前15分鐘',
    timeOffset: -15,
    icon: 'clock_loader_40',
    index: 2
  },
  {
    name: '到站前20分鐘',
    timeOffset: -20,
    icon: 'clock_loader_60',
    index: 3
  },
  {
    name: '到站前25分鐘',
    timeOffset: -25,
    icon: 'clock_loader_80',
    index: 4
  },
  {
    name: '到站前30分鐘',
    timeOffset: -30,
    icon: 'clock_loader_90',
    index: 5
  }
];
