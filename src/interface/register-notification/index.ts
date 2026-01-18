import { registerNotificationClient } from '../../data/notification/apis/registerNotificationClient/index';
import { getNotificationProvider, setNotificationProvider } from '../../data/notification/index';
import { isValidURL } from '../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { closePreviousPage, openPreviousPage, pushPageHistory } from '../index';
import { promptMessage } from '../prompt/index';

const RegisterNotificationField = documentQuerySelector('.css_register_notification_field');
const RegisterNotificationBodyElement = elementQuerySelector(RegisterNotificationField, '.css_register_notification_body');
const RegisterNotificationGroupsElement = elementQuerySelector(RegisterNotificationBodyElement, '.css_register_notification_groups');

const ProviderInputElement = elementQuerySelector(RegisterNotificationGroupsElement, '.css_register_notification_group[group="provider"] .css_register_notification_group_body input');
const RgistrationKeyInputElement = elementQuerySelector(RegisterNotificationGroupsElement, '.css_register_notification_group[group="registration-key"] .css_register_notification_group_body input');

function initializeRegisterNotificationField() {
  ProviderInputElement.value = getNotificationProvider();
  RgistrationKeyInputElement.value = '';
}

export function openRegisterNotification(): void {
  pushPageHistory('RegisterNotification');
  RegisterNotificationField.setAttribute('displayed', 'true');
  initializeRegisterNotificationField();
  closePreviousPage();
}

export function closeRegisterNotification(): void {
  // revokePageHistory('RegisterNotification');
  RegisterNotificationField.setAttribute('displayed', 'false');
  openPreviousPage();
}

export async function saveFormulatedRegisterNotification() {
  promptMessage('處理中', 'manufacturing');
  const provider = ProviderInputElement.value;
  const registrationKey = RgistrationKeyInputElement.value;
  if (!isValidURL(provider)) {
    promptMessage('無效的提供者', 'error');
    return;
  }
  // register
  setNotificationProvider(provider);
  const registering = await registerNotificationClient(registrationKey);
  if (registering) {
    promptMessage('註冊成功', 'check_circle');
    return;
  } else {
    promptMessage('註冊失敗', 'error');
    return;
  }
}
