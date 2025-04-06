import { changeSettingOption, getSetting } from '../../data/settings/index';
import { documentQuerySelector, documentQuerySelectorAll, elementQuerySelector } from '../../tools/query-selector';
import { closePreviousPage, GeneratedElement, openPreviousPage, pushPageHistory } from '../index';

const SettingsOptionsField = documentQuerySelector('.css_settings_options_field');
const SettingsOptionsBodyElement = elementQuerySelector(SettingsOptionsField, '.css_settings_options_body');
const optionsElement = elementQuerySelector(SettingsOptionsBodyElement, '.css_settings_options');
const descriptionElement = elementQuerySelector(SettingsOptionsBodyElement, '.css_options_description');
const SettingsOptionsHeadElement = elementQuerySelector(SettingsOptionsField, '.css_settings_options_head');
const titleElement = elementQuerySelector(SettingsOptionsHeadElement, '.css_settings_options_title');

function generateElementOfItem(setting: object, item: object, index: number): GeneratedElement {
  // const identifier = generateIdentifier('i');
  const element = document.createElement('div');
  element.classList.add('css_option');
  // element.id = identifier;
  element.innerHTML = /*html*/ `<div class="css_option_name">${item.name}</div><div class="css_option_checkbox"><input type="checkbox" onclick="bus.settings.settingsOptionsHandler(event, '${setting.key}', ${index})" ${setting.option === index ? 'checked' : ''}/></div>`;
  return {
    element: element,
    id: ''
  };
}

function initializeSettingsOptionsField(settingKey: string): void {
  const setting = getSetting(settingKey);
  titleElement.innerText = setting.name;
  descriptionElement.innerText = setting.description;
  optionsElement.innerHTML = '';
  const fragment = new DocumentFragment();
  let index = 0;
  for (const item of setting.options) {
    const thisElement = generateElementOfItem(setting, item, index);
    fragment.appendChild(thisElement.element);
    index += 1;
  }
  optionsElement.append(fragment);
}

export function openSettingsOptions(settingKey: string): void {
  pushPageHistory('SettingsOptions');
  SettingsOptionsField.setAttribute('displayed', 'true');
  initializeSettingsOptionsField(settingKey);
  closePreviousPage();
}

export function closeSettingsOptions(): void {
  // revokePageHistory('SettingsOptions');
  SettingsOptionsField.setAttribute('displayed', 'false');
  openPreviousPage();
}

export function settingsOptionsHandler(event: Event, settingKey: string, index: number): void {
  const checkboxes = documentQuerySelectorAll('.css_settings_options_field .css_settings_options_body .css_settings_options .css_option .css_option_checkbox input[type="checkbox"]');
  for (const checkbox of checkboxes) {
    checkbox.checked = false;
  }
  event.target.checked = true;
  changeSettingOption(settingKey, index);
}
