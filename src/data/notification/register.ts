import { lfGetItem, lfSetItem } from '../storage/index';
import { getNotificationAPIURL } from './getNotificationAPIURL';
import { NotificationResponseObjectRegister } from './index';
import { requestNotificationAPI } from './loader';

const notificationRegisterKey = 'n_register';

export async function registerNotification(provider: string, telegramBotToken: string, telegramChatID: number): Promise<NotificationResponseObjectRegister | false> {
  const url = await getNotificationAPIURL(provider, 'register', [telegramBotToken, telegramChatID]);
  if (url === false) {
    return false;
  } else {
    const result = await requestNotificationAPI(url);
    if (result === false) {
      return result as false;
    } else {
      return result as NotificationResponseObjectRegister;
    }
  }
}

export async function hasNotificationRegister(): Promise<boolean> {
  const existingNotificationRegister = await lfGetItem(7, notificationRegisterKey);
  if (existingNotificationRegister) {
    return true;
  }
  return false;
}

export async function setNotificationRegister(register: NotificationResponseObjectRegister): Promise<boolean> {
  if (register.code === 200 && register.method === 'register') {
    await lfSetItem(7, notificationRegisterKey, JSON.stringify(register));
    return true;
  } else {
    return false;
  }
}

export async function getNotificationRegister(): Promise<NotificationResponseObjectRegister | false> {
  const existingNotificationRegister = await lfGetItem(7, notificationRegisterKey);
  if (existingNotificationRegister) {
    const existingNotificationRegisterObject = JSON.parse(existingNotificationRegister) as NotificationResponseObjectRegister;
    if (existingNotificationRegisterObject.code === 200) {
      return existingNotificationRegisterObject;
    }
  }
  return false;
}
