import { md5 } from '../../tools/index.ts';
import { documentQuerySelector, documentQuerySelectorAll, elementQuerySelector, elementQuerySelectorAll } from '../../tools/query-selector.ts';
import { getSetting, changeSettingOption } from '../../data/settings/index.ts';

function generateElementOfItem(setting: object, item: object, index: number): object {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('option');
  element.id = identifier;
  element.innerHTML = `<div class="option_name">${item.name}</div><div class="option_checkbox"><input type="checkbox" onclick="bus.settingsPage.settingsOptionsHandler(event, '${setting.key}', ${index})" ${setting.option === index ? 'checked' : ''}/></div>`;
  return {
    element: element,
    id: identifier
  };
}

function initializeSettingsOptionsField(Field: HTMLElement, settingKey: string): void {
  var setting = getSetting(settingKey);
  elementQuerySelector(Field, '.settings_options_page_body .settings_options_page_options').innerHTML = '';
  var index = 0;
  for (var item of setting.options) {
    var thisElement = generateElementOfItem(setting, item, index);
    elementQuerySelector(Field, '.settings_options_page_body .settings_options_page_options').appendChild(thisElement.element);
    index += 1;
  }
}

export function openSettingsOptionsPage(settingKey: string): void {
  var setting = getSetting(settingKey);
  var Field: HTMLElement = documentQuerySelector('.settings_options_page_field');
  Field.setAttribute('displayed', 'true');
  elementQuerySelector(Field, '.settings_options_page_head .settings_options_page_title').innerText = setting.name;
  initializeSettingsOptionsField(Field, settingKey);
}

export function closeSettingsOptionsPage(): void {
  var Field = documentQuerySelector('.settings_options_page_field');
  Field.setAttribute('displayed', 'false');
}

export function settingsOptionsHandler(event: Event, settingKey: string, index: number): void {
  var checkboxes = documentQuerySelectorAll('.settings_options_page_field .settings_options_page_body .settings_options_page_options .option .option_checkbox input[type="checkbox"]');
  for (var checkbox of checkboxes) {
    checkbox.checked = false;
  }
  event.target.checked = true;
  changeSettingOption(settingKey, index).then((e) => {
    console.log(e);
  });
}
