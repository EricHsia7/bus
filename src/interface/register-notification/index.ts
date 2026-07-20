import { registerNotificationClient } from '../../data/notification/apis/registerNotificationClient/index';
import { getNotificationProvider, setNotificationProvider } from '../../data/notification/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { isValidURL } from '../../tools/index';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';
import { promptMessage } from '../prompt/index';
import { initializeSettingsField } from '../settings/index';

const Field = documentQuerySelector('.css_register_notification_field');

const HeadElement = elementQuerySelector(Field, '.css_register_notification_head');
const HeadButtonLeftElement = elementQuerySelector(HeadElement, '.css_register_notification_button_left');
const HeadButtonRightElement = elementQuerySelector(HeadElement, '.css_register_notification_button_right');

const BodyElement = elementQuerySelector(Field, '.css_register_notification_body');
const GroupsElement = elementQuerySelector(BodyElement, '.css_register_notification_groups');

const ProviderGroupElement = elementQuerySelector(GroupsElement, '.css_register_notification_group[group="provider"]');
const ProviderGroupBodyElement = elementQuerySelector(ProviderGroupElement, '.css_register_notification_group_body');
const ProviderInputElement = elementQuerySelector(ProviderGroupBodyElement, 'input') as HTMLInputElement;

const RegistrationKeyGroupElement = elementQuerySelector(GroupsElement, '.css_register_notification_group[group="registration-key"]');
const RegistrationKeyGroupBodyElement = elementQuerySelector(RegistrationKeyGroupElement, '.css_register_notification_group_body');
const RegistrationKeyInputElement = elementQuerySelector(RegistrationKeyGroupBodyElement, 'input') as HTMLInputElement;

function initializeRegisterNotificationField(): void {
  HeadButtonLeftElement.onclick = function () {
    closeRegisterNotification();
    // callback
    initializeSettingsField();
  };

  HeadButtonRightElement.onclick = function () {
    saveFormulatedRegisterNotification();
  };

  ProviderInputElement.value = getNotificationProvider();
  RegistrationKeyInputElement.value = '';
}

export function showRegisterNotification(): void {
  Field.setAttribute('displayed', 'true');
}

export function hideRegisterNotification(): void {
  Field.setAttribute('displayed', 'false');
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
  const registrationKey = RegistrationKeyInputElement.value;
  if (!isValidURL(provider)) {
    promptMessage('error', '無效的提供者');
    return;
  }
  // register
  setNotificationProvider(provider);
  const result = await registerNotificationClient(registrationKey);
  if (result === 0) {
    promptMessage('check_circle', '註冊成功');
  } else {
    promptMessage('error', '註冊失敗');
  }
}
