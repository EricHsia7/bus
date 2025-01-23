import { lfGetItem, lfSetItem } from '../storage/index';
import { getNotificationAPIURL } from './getNotificationAPIURL';
import { NotificationResponseObjectRegister } from './index';
import { requestNotificationAPI } from './loader';

const notificationRegisterKey = 'n_register'

export async function registerNotification(provider: string, telegramBotToken: string, telegramChatID: number): Promise<NotificationResponseObjectRegister | false> {
  const url = getNotificationAPIURL(provider, 'register', [telegramBotToken, telegramChatID]);
  const result = await requestNotificationAPI(url);
  if (result === false) {
    return result as false;
  } else {
    return result as NotificationResponseObjectRegister;
  }
}

export async function hasRegister(): Promise<boolean> {
  const existingNotificationRegister = await lfGetItem(7, notificationRegisterKey);
  if (existingNotificationRegister) {
    if (register.code === '200') {
      return true;
    }
  }
  return false;
}

export async function saveRegister(register: NotificationResponseObjectRegister): Promise<boolean> {
  const existingNotificationRegister = await lfGetItem(7, notificationRegisterKey);
  if (!existingNotificationRegister) {
    if (register.code === '200') {
      await lfSetItem(7, notificationRegisterKey, JSON.stringify(register));
      return true;
    }
  }
  return false;
}

export async function getRegister(): Promise<NotificationResponseObjectRegister | false> {
  const existingNotificationRegister = await lfGetItem(7, notificationRegisterKey);
  if (!existingNotificationRegister) {
    const existingNotificationRegisterObject = JSON.parse(existingNotificationRegister) as NotificationResponseObjectRegister;
    if (existingNotificationRegisterObject.code === '200') {
      return existingNotificationRegisterObject;
    }
  }
  return false;
}
