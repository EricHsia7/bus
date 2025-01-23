import { getNotificationAPIProvider, hasNotificationAPIProvider, setNotificationAPIProvider } from '../../data/notification/getNotificationAPIURL';
import { getNotificationRegister, hasNotificationRegister, registerNotification, setNotificationRegister } from '../../data/notification/register';
import { updateNotification } from '../../data/notification/update';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { pushPageHistory, revokePageHistory } from '../index';
import { promptMessage } from '../prompt/index';

const NotificationField = documentQuerySelector('.css_notification_field');
const NotificationBodyElement = elementQuerySelector(NotificationField, '.css_notification_body');
const NotificationGroupsElement = elementQuerySelector(NotificationBodyElement, '.css_notification_groups');

const ProviderInputElement = elementQuerySelector(NotificationGroupsElement, '.css_notification_group[group="provider"] .css_notification_group_body input');
const TokenInputElement = elementQuerySelector(NotificationGroupsElement, '.css_notification_group[group="token"] .css_notification_group_body input');
const ChatIDInputElement = elementQuerySelector(NotificationGroupsElement, '.css_notification_group[group="chat-id"] .css_notification_group_body input');

export function openNotification(): void {
  pushPageHistory('Notification');
  NotificationField.setAttribute('displayed', 'true');
}

export function closeNotification(): void {
  revokePageHistory('Notification');
  NotificationField.setAttribute('displayed', 'false');
}

export async function saveFormulatedNotification() {
  const provider = ProviderInputElement.value;
  const token = TokenInputElement.value;
  const chatID = ChatIDInputElement.value;
  const existenceOfRegister = await hasNotificationRegister();
  const existenceOfProvider = await hasNotificationAPIProvider();
  if (existenceOfRegister && existenceOfProvider) {
    const existingRegister = await getNotificationRegister();
    const existingProvider = await getNotificationAPIProvider();
    if (!(existingRegister === false) && !(existingProvider === false)) {
      if (provider === existingProvider) {
        const update = await updateNotification(provider, existingRegister.client_id, existingRegister.secret, token, chatID);
        if (update === false) {
          promptMessage('發生未知錯誤', 'error');
        } else {
          if (update.code === 200) {
            promptMessage('更新成功', 'check');
          } else {
            promptMessage(update.result, 'error');
          }
        }
      } else {
        const newProvider = await setNotificationAPIProvider(provider);
        const newRegister = await registerNotification(provider, token, chatID);
        if (newRegister === false || newProvider === false) {
          promptMessage('發生未知錯誤', 'error');
        } else {
          if (newRegister.code === 200) {
            promptMessage('註冊成功', 'check');
            await setNotificationRegister(newRegister);
          } else {
            promptMessage(newRegister.result, 'error');
          }
        }
      }
    }
  } else {
    const newProvider = await setNotificationAPIProvider(provider);
    const newRegister = await registerNotification(provider, token, chatID);
    if (newRegister === false || newProvider === false) {
      promptMessage('發生未知錯誤', 'error');
    } else {
      if (newRegister.code === 200) {
        promptMessage('註冊成功');
        await setNotificationRegister(newRegister);
      }
    }
  }
}
