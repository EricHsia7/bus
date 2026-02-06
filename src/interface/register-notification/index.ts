import { registerNotificationClient } from '../../data/notification/apis/registerNotificationClient/index';
import { getNotificationProvider, setNotificationProvider } from '../../data/notification/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { isValidURL } from '../../tools/index';
import { hidePreviousPage, showPreviousPage, pushPageHistory, revokePageHistory } from '../index';
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

export function showRegisterNotification(): void {
  RegisterNotificationField.setAttribute('displayed', 'true');
}

export function hideRegisterNotification(): void {
  RegisterNotificationField.setAttribute('displayed', 'false');
}

export function openRegisterNotification(): void {
  pushPageHistory('RegisterNotification');
  showRegisterNotification();
  initializeRegisterNotificationField();
  hidePreviousPage();
}

export function closeRegisterNotification(): void {
  hideRegisterNotification();
  showPreviousPage();
  revokePageHistory('RegisterNotification');
}

export async function saveFormulatedRegisterNotification() {
  promptMessage('manufacturing', '處理中');
  const provider = ProviderInputElement.value;
  const registrationKey = RgistrationKeyInputElement.value;
  if (!isValidURL(provider)) {
    promptMessage('error', '無效的提供者');
    return;
  }
  // register
  setNotificationProvider(provider);
  const registering = await registerNotificationClient(registrationKey);
  if (registering) {
    promptMessage('check_circle', '註冊成功');
    return;
  } else {
    promptMessage('error', '註冊失敗');
    return;
  }
}
