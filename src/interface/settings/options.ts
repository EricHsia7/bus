import { changeSettingOption, getSetting, SettingSelect, SettingSelectOption } from '../../data/settings/index';
import { documentQuerySelector, documentQuerySelectorAll, elementQuerySelector } from '../../tools/elements';
import { closePreviousPage, openPreviousPage, pushPageHistory } from '../index';

const SettingsOptionsField = documentQuerySelector('.css_settings_options_field');
const SettingsOptionsBodyElement = elementQuerySelector(SettingsOptionsField, '.css_settings_options_body');
const SettingsOptionsOptionsElement = elementQuerySelector(SettingsOptionsBodyElement, '.css_settings_options');
const SettingsOptionsDescriptionElement = elementQuerySelector(SettingsOptionsBodyElement, '.css_options_description');
const SettingsOptionsHeadElement = elementQuerySelector(SettingsOptionsField, '.css_settings_options_head');
const SettingsOptionsTitleElement = elementQuerySelector(SettingsOptionsHeadElement, '.css_settings_options_title');

function generateElementOfItem(setting: SettingSelect, item: SettingSelectOption, index: number): HTMLElement {
  const optionElement = document.createElement('div');
  optionElement.classList.add('css_option');

  const nameElement = document.createElement('div');
  nameElement.classList.add('css_option_name');
  nameElement.appendChild(document.createTextNode(item.name));

  const checkboxContainerElement = document.createElement('div');
  checkboxContainerElement.classList.add('css_option_checkbox');

  const checkboxElement = document.createElement('input');
  checkboxElement.type = 'checkbox';
  checkboxElement.checked = setting.option === index;
  checkboxElement.onclick = (event) => {
    settingsOptionsHandler(event, setting.key, index);
  };

  checkboxContainerElement.appendChild(checkboxElement);
  optionElement.appendChild(nameElement);
  optionElement.appendChild(checkboxContainerElement);

  return optionElement;
}

function initializeSettingsOptionsField(settingKey: string): void {
  const setting = getSetting(settingKey) as SettingSelect;
  SettingsOptionsTitleElement.innerText = setting.name;
  SettingsOptionsDescriptionElement.innerText = setting.description;
  SettingsOptionsOptionsElement.innerHTML = '';
  const fragment = new DocumentFragment();
  let index: number = 0;
  for (const item of setting.options) {
    const thisElement = generateElementOfItem(setting, item, index);
    fragment.appendChild(thisElement);
    index += 1;
  }
  SettingsOptionsOptionsElement.append(fragment);
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
  const checkboxes = documentQuerySelectorAll('.css_settings_options_field .css_settings_options_body .css_settings_options .css_option .css_option_checkbox input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
  for (const checkbox of checkboxes) {
    checkbox.checked = false;
  }
  const target = event.target as HTMLInputElement;
  target.checked = true;
  changeSettingOption(settingKey, index);
}
