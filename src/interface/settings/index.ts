import { md5 } from '../../tools/index.ts';
import { listSettings } from '../../data/settings/index.ts';
import { icons } from '../icons/index.ts';

function generateElementOfItem(item: object): object {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('setting');
  element.id = identifier;
  element.innerHTML = `<div class="setting_icon">${icons[item.icon]}</div><div class="setting_name">${item.name}</div><div class="setting_status"></div><div class="setting_arrow">${icons['arrow']}</div>`;
  return {
    element: element,
    id: identifier
  };
}

async function initializeSettingsField(Field: HTMLElement) {
  var list = await listSettings();
  for (var item of list) {
    var thisElement = generateElementOfItem(item);
    Field.appendChild(thisElement.element);
  }
}

export function openSettingsPage(): void {
  var Field: HTMLElement = document.querySelector('.settings_page_field .settings_page_body .settings_page_settings');
  Field.setAttribute('displayed', 'true');
  Field.innerHTML = '';
  initializeSettingsField(Field);
}

export function closeSettingsPage(): void {
  var Field: HTMLElement = document.querySelector('.settings_page_field .settings_page_body .settings_page_settings');
  Field.setAttribute('displayed', 'false');
}
