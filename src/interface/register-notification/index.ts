import { registerNotificationClient } from '../../data/notification/apis/registerNotificationClient/index';
import { getNotificationProvider, setNotificationProvider } from '../../data/notification/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { isValidURL } from '../../tools/index';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';
import { promptMessage } from '../prompt/index';
import { initializeSettingsField } from '../settings/index';

const RegisterNotificationField = documentQuerySelector('.css_register_notification_field');
const bodyElement = elementQuerySelector(RegisterNotificationField, '.css_register_notification_body');

const groupsElement = elementQuerySelector(bodyElement, '.css_register_notification_groups');

const providerGroupElement = elementQuerySelector(groupsElement, '.css_register_notification_group[group="provider"]');
const providerGroupBodyElement = elementQuerySelector(providerGroupElement, '.css_register_notification_group_body');
const providerInputElement = elementQuerySelector(providerGroupBodyElement, 'input');

const rgistrationKeyGroupElement = elementQuerySelector(groupsElement, '.css_register_notification_group[group="registration-key"]');
const rgistrationKeyGroupBodyElement = elementQuerySelector(rgistrationKeyGroupElement, '.css_register_notification_group_body');
const rgistrationKeyInputElement = elementQuerySelector(rgistrationKeyGroupBodyElement, 'input');

const headElement = elementQuerySelector(RegisterNotificationField, '.css_register_notification_head');
const leftButtonElement = elementQuerySelector(headElement, '.css_register_notification_button_left');
const rightButtonElement = elementQuerySelector(headElement, '.css_register_notification_button_right');

function initializeRegisterNotificationField() {
  leftButtonElement.onclick = function () {
    closeRegisterNotification();
    // callback
    initializeSettingsField();
  };

  rightButtonElement.onclick = function () {
    saveFormulatedRegisterNotification();
  };

  providerInputElement.value = getNotificationProvider();
  rgistrationKeyInputElement.value = '';
}

export function showRegisterNotification(pageTransitionReverse: boolean): void {
  const className = pageTransitionReverse ? 'css_page_transition_slide_in_reverse' : 'css_page_transition_fade_in';
  RegisterNotificationField.addEventListener(
    'animationend',
    function () {
      RegisterNotificationField.classList.remove(className);
    },
    { once: true }
  );
  RegisterNotificationField.classList.add(className);
  RegisterNotificationField.setAttribute('displayed', 'true');
}

export function hideRegisterNotification(pageTransitionReverse: boolean): void {
  const className = pageTransitionReverse === 'ltr' ? 'css_page_transition_slide_out_reverse' : 'css_page_transition_fade_out';
  RegisterNotificationField.addEventListener(
    'animationend',
    function () {
      RegisterNotificationField.setAttribute('displayed', 'false');
      RegisterNotificationField.classList.remove(className);
    },
    { once: true }
  );
  RegisterNotificationField.classList.add(className);
}

export function openRegisterNotification(): void {
  pushPageHistory('RegisterNotification');
  showRegisterNotification('rtl');
  initializeRegisterNotificationField();
  hidePreviousPage();
}

export function closeRegisterNotification(): void {
  hideRegisterNotification('ltr');
  showPreviousPage();
  revokePageHistory('RegisterNotification');
}

export async function saveFormulatedRegisterNotification() {
  promptMessage('manufacturing', '處理中');
  const provider = providerInputElement.value;
  const registrationKey = rgistrationKeyInputElement.value;
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
