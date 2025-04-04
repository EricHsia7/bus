import { changeSettingOption, getSetting } from '../../data/settings/index';
import { generateIdentifier } from '../../tools/index';
import { documentQuerySelector, documentQuerySelectorAll, elementQuerySelector } from '../../tools/query-selector';
import { closePreviousPage, GeneratedElement, openPreviousPage, pushPageHistory } from '../index';

function generateElementOfItem(setting: object, item: object, index: number): GeneratedElement {
  var identifier = generateIdentifier('i');
  var element = document.createElement('div');
  element.classList.add('css_option');
  element.id = identifier;
  element.innerHTML = /*html*/ `<div class="css_option_name">${item.name}</div><div class="css_option_checkbox"><input type="checkbox" onclick="bus.settings.settingsOptionsHandler(event, '${setting.key}', ${index})" ${setting.option === index ? 'checked' : ''}/></div>`;
  return {
    element: element,
    id: identifier
  };
}

function initializeSettingsOptionsField(Field: HTMLElement, settingKey: string): void {
  const setting = getSetting(settingKey);
  const bodyElement = elementQuerySelector(Field, '.css_settings_options_page_body');
  const optionsElement = elementQuerySelector(bodyElement, '.css_settings_options_page_options');
  const descriptionElement = elementQuerySelector(bodyElement, '.css_options_description');
  descriptionElement.innerText = setting.description;
  optionsElement.innerHTML = '';
  let index = 0;
  for (const item of setting.options) {
    const thisElement = generateElementOfItem(setting, item, index);
    optionsElement.appendChild(thisElement.element);
    index += 1;
  }
}

export function openSettingsOptions(settingKey: string): void {
  pushPageHistory('SettingsOptions');
  var setting = getSetting(settingKey);
  var Field: HTMLElement = documentQuerySelector('.css_settings_options_page_field');
  Field.setAttribute('displayed', 'true');
  elementQuerySelector(Field, '.css_settings_options_page_head .css_settings_options_page_title').innerText = setting.name;
  initializeSettingsOptionsField(Field, settingKey);
  closePreviousPage();
}

export function closeSettingsOptions(): void {
  // revokePageHistory('SettingsOptions');
  var Field = documentQuerySelector('.css_settings_options_page_field');
  Field.setAttribute('displayed', 'false');
  openPreviousPage();
}

export function settingsOptionsHandler(event: Event, settingKey: string, index: number): void {
  var checkboxes = documentQuerySelectorAll('.css_settings_options_page_field .css_settings_options_page_body .css_settings_options_page_options .css_option .css_option_checkbox input[type="checkbox"]');
  for (var checkbox of checkboxes) {
    checkbox.checked = false;
  }
  event.target.checked = true;
  changeSettingOption(settingKey, index).then((e) => {});
}
