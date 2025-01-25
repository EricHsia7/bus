import { currentNotificationAPI } from '../../data/notification/index';
import { isValidURL } from '../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { closePreviousPage, openPreviousPage, pushPageHistory } from '../index';
import { promptMessage } from '../prompt/index';

const NotificationField = documentQuerySelector('.css_notification_field');
const NotificationBodyElement = elementQuerySelector(NotificationField, '.css_notification_body');
const NotificationGroupsElement = elementQuerySelector(NotificationBodyElement, '.css_notification_groups');

const ProviderInputElement = elementQuerySelector(NotificationGroupsElement, '.css_notification_group[group="provider"] .css_notification_group_body input');
const RgistrationKeyInputElement = elementQuerySelector(NotificationGroupsElement, '.css_notification_group[group="registration-key"] .css_notification_group_body input');

function initializeNotificationField() {
  ProviderInputElement.value = currentNotificationAPI.getProvider();
  TokenInputElement.value = '';
  ChatIDInputElement.value = '';
}

export function openNotification(): void {
  pushPageHistory('Notification');
  NotificationField.setAttribute('displayed', 'true');
  initializeNotificationField();
  closePreviousPage();
}

export function closeNotification(): void {
  // revokePageHistory('Notification');
  NotificationField.setAttribute('displayed', 'false');
  openPreviousPage();
}

export async function saveFormulatedNotification() {
  promptMessage('處理中', 'manufacturing');
  const provider = ProviderInputElement.value;
  const registrationKey = RgistrationKeyInputElement.value;

  const status = currentNotificationAPI.getStatus();

  if (status) {
    // registered
    if (!isValidURL(provider)) {
      promptMessage('無效的提供者', 'error');
      return;
    }
    if (new URL(currentNotificationAPI.getProvider()).hostname === new URL(provider).hostname) {
      // same provider > use update method
      const updating = await currentNotificationAPI.update(token, chatID);
      if (updating) {
        promptMessage('更新成功', 'check_circle');
        return;
      } else {
        promptMessage('更新失敗', 'error');
        return;
      }
    } else {
      // different provider > use register method
      const registering = await currentNotificationAPI.register(registrationKey);
      if (registering) {
        promptMessage('註冊成功', 'check_circle');
        return;
      } else {
        promptMessage('註冊失敗', 'error');
        return;
      }
    }
  } else {
    // new client
    currentNotificationAPI.setProvider(provider);
    const registering = await currentNotificationAPI.register(registrationKey);
    if (registering) {
      promptMessage('註冊成功', 'check_circle');
      return;
    } else {
      promptMessage('註冊失敗', 'error');
      return;
    }
  }
}
