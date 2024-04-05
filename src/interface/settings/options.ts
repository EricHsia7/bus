import { md5 } from '../../tools/index.ts';
import { getSettingOptions } from '../../data/settings/index.ts';

function generateElementOfItem(item: object, index: number): object {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('option');
  element.id = identifier;
  element.setAttribute('type', item.type);
  element.innerHTML = `<div class="option_name">${item.name}</div><div class="option_checkbox"><input type="checkbox" ${item.option === index ? 'checked' : ''}/></div>`;
  return {
    element: element,
    id: identifier
  };
}

function initializeSettingsOptionsField(Field: HTMLElement, settingKey: string): void {
  var options = getSettingOptions(settingKey);
  Field.querySelector('.settings_options_page_body .settings_options_page_options').innerHTML = '';
  var index = 0;
  for (var item of options) {
    var thisElement = generateElementOfItem(item, index);
    Field.querySelector('.settings_options_page_body .settings_options_page_options').appendChild(thisElement.element);
    index += 1;
  }
}

export function openSettingsOptionsPage(settingKey: string): void {
  var Field = document.querySelector('.settings_options_page_field');
  Field.setAttribute('displayed', 'true');
  initializeSettingsOptionsField(Field, settingKey);
}

export function closeSettingsOptionsPage(): void {
  var Field = document.querySelector('.settings_options_page_field');
  Field.setAttribute('displayed', 'false');
}
