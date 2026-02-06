import { changeSettingOption, getSetting, initializeSettings, SettingSelect, SettingSelectOption } from '../../data/settings/index';
import { documentCreateDivElement, documentQuerySelector, documentQuerySelectorAll, elementQuerySelector } from '../../tools/elements';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';

const SettingsOptionsField = documentQuerySelector('.css_settings_options_field');
const SettingsOptionsBodyElement = elementQuerySelector(SettingsOptionsField, '.css_settings_options_body');
const SettingsOptionsOptionsElement = elementQuerySelector(SettingsOptionsBodyElement, '.css_settings_options');
const SettingsOptionsDescriptionElement = elementQuerySelector(SettingsOptionsBodyElement, '.css_options_description');
const SettingsOptionsHeadElement = elementQuerySelector(SettingsOptionsField, '.css_settings_options_head');
const SettingsOptionsTitleElement = elementQuerySelector(SettingsOptionsHeadElement, '.css_settings_options_title');
const SettingsOptionsLeftButtonElement = elementQuerySelector(SettingsOptionsHeadElement, '.css_settings_options_button_left');

function generateElementOfItem(setting: SettingSelect, item: SettingSelectOption, index: number): HTMLElement {
  const optionElement = documentCreateDivElement();
  optionElement.classList.add('css_option');

  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_option_name');
  nameElement.innerText = item.name;

  const checkboxContainerElement = documentCreateDivElement();
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
  SettingsOptionsLeftButtonElement.onclick = function () {
    closeSettingsOptions();
    // callback
    initializeSettings();
  };
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

export function showSettingsOptions(): void {
  SettingsOptionsField.setAttribute('displayed', 'true');
}

export function hideSettingsOptions(): void {
  SettingsOptionsField.setAttribute('displayed', 'false');
}

export function openSettingsOptions(settingKey: string): void {
  pushPageHistory('SettingsOptions');
  showSettingsOptions();
  initializeSettingsOptionsField(settingKey);
  hidePreviousPage();
}

export function closeSettingsOptions(): void {
  hideSettingsOptions();
  showPreviousPage();
  revokePageHistory('SettingsOptions');
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
