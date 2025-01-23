import { lfGetItem, lfSetItem } from '../storage/index';

export type NotificationResponseCode = 200 | 400 | 401 | 404 | 500;

export interface NotificationResponseObjectCancel {
  result: string;
  code: NotificationResponseCode;
  method: 'cancel';
}

export interface NotificationResponseObjectRegister {
  result: string;
  code: NotificationResponseCode;
  method: 'register';
  client_id: string | 'null';
  secret: string | 'null';
}

export interface NotificationResponseObjectSchedule {
  result: string;
  code: NotificationResponseCode;
  method: 'schedule';
  schedule_id: string | 'null';
}

export interface NotificationResponseObjectUpdate {
  result: string;
  code: NotificationResponseCode;
  method: 'update';
}

export type NotificationResponseObject = NotificationResponseObjectCancel | NotificationResponseObjectRegister | NotificationResponseObjectSchedule | NotificationResponseObjectUpdate;

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
