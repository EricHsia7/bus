import { getNotificationChatID, getNotificationProvider, getNotificationToken, hasNotificationProvider, hasNotificationToken, setNotificationChatID, setNotificationProvider, setNotificationToken } from '../../data/notification/index';
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

async function initializeNotificationField() {
  const existingNotificationProvider = await getNotificationProvider();
  if (existingNotificationProvider === false) {
    ProviderInputElement.value = '';
  } else {
    ProviderInputElement.value = existingNotificationProvider;
  }

  const existingNotificationToken = await getNotificationToken();
  if (existingNotificationToken === false) {
    TokenInputElement.value = '';
  } else {
    TokenInputElement.value = existingNotificationToken;
  }

  const existingNotificationChatID = await getNotificationChatID();
  if (existingNotificationChatID === false) {
    ChatIDInputElement.value = '';
  } else {
    ChatIDInputElement.value = existingNotificationChatID;
  }
}

export function openNotification(): void {
  pushPageHistory('Notification');
  NotificationField.setAttribute('displayed', 'true');
  initializeNotificationField();
}

export function closeNotification(): void {
  revokePageHistory('Notification');
  NotificationField.setAttribute('displayed', 'false');
}

export async function saveFormulatedNotification() {
  promptMessage('處理中', 'manufacturing');
  const provider = ProviderInputElement.value;
  const token = TokenInputElement.value;
  const chatID = ChatIDInputElement.value;
  const existenceOfRegister = await hasNotificationRegister();
  const existenceOfProvider = await hasNotificationProvider();
  if (existenceOfRegister && existenceOfProvider) {
    const existingRegister = await getNotificationRegister();
    const existingProvider = await getNotificationProvider();
    if (!(existingRegister === false) && !(existingProvider === false)) {
      if (provider === existingProvider) {
        const update = await updateNotification(provider, existingRegister.client_id, existingRegister.secret, token, chatID);
        if (update === false) {
          promptMessage('發生未知錯誤', 'error');
        } else {
          if (update.code === 200) {
            await setNotificationToken(token);
            await setNotificationChatID(chatID);
            promptMessage('更新成功', 'check_circle');
          } else {
            promptMessage(update.result, 'error');
          }
        }
      } else {
        const newRegister = await registerNotification(provider, token, chatID);
        if (newRegister === false) {
          promptMessage('發生未知錯誤', 'error');
        } else {
          if (newRegister.code === 200) {
            await setNotificationProvider(provider);
            await setNotificationToken(token);
            await setNotificationChatID(chatID);
            await setNotificationRegister(newRegister);
            promptMessage('註冊成功', 'check_circle');
          } else {
            promptMessage(newRegister.result, 'error');
          }
        }
      }
    }
  } else {
    const newRegister = await registerNotification(provider, token, chatID);
    if (newRegister === false) {
      promptMessage('發生未知錯誤', 'error');
    } else {
      if (newRegister.code === 200) {
        await setNotificationProvider(provider);
        await setNotificationToken(token);
        await setNotificationChatID(chatID);
        await setNotificationRegister(newRegister);
        promptMessage('註冊成功', 'check_circle');
      }
    }
  }
}
