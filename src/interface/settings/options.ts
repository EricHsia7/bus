import { generateIdentifier } from '../../tools/index';
import { documentQuerySelector, documentQuerySelectorAll, elementQuerySelector } from '../../tools/query-selector';
import { getSetting, changeSettingOption } from '../../data/settings/index';
import { closePreviousPage, GeneratedElement, openPreviousPage, pushPageHistory } from '../index';

function generateElementOfItem(setting: object, item: object, index: number): GeneratedElement {
  var identifier = generateIdentifier('i');
  var element = document.createElement('div');
  element.classList.add('css_option');
  element.id = identifier;
  element.innerHTML = `<div class="css_option_name">${item.name}</div><div class="css_option_checkbox"><input type="checkbox" onclick="bus.settings.settingsOptionsHandler(event, '${setting.key}', ${index})" ${setting.option === index ? 'checked' : ''}/></div>`;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfDescription(setting: object): GeneratedElement {
  var identifier = generateIdentifier('d');
  var element = document.createElement('div');
  element.classList.add('css_options_description');
  element.id = identifier;
  element.innerText = setting.description;
  return {
    element: element,
    id: identifier
  };
}

function initializeSettingsOptionsField(Field: HTMLElement, settingKey: string): void {
  const setting = getSetting(settingKey);
  const optionsElement = elementQuerySelector(Field, '.css_settings_options_page_body .css_settings_options_page_options');
  optionsElement.innerHTML = '';
  let index = 0;
  for (const item of setting.options) {
    var thisElement = generateElementOfItem(setting, item, index);
    optionsElement.appendChild(thisElement.element);
    index += 1;
  }
  const descriptionElement = generateElementOfDescription(setting);
  optionsElement.appendChild(descriptionElement);
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
