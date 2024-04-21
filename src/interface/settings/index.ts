import { md5 } from '../../tools/index.ts';
import { documentQuerySelector, documentQuerySelectorAll, elementQuerySelector, elementQuerySelectorAll } from '../../tools/query-selector.ts';
import { listSettings } from '../../data/settings/index.ts';
import { icons } from '../icons/index.ts';
import { GeneratedElement } from '../index.ts';

function generateElementOfItem(item: object): GeneratedElement {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('setting');
  element.id = identifier;
  element.setAttribute('onclick', item.action);
  element.setAttribute('type', item.type);
  element.innerHTML = `<div class="setting_icon">${icons[item.icon]}</div><div class="setting_name">${item.name}</div><div class="setting_status">${item.status}</div><div class="setting_arrow">${icons['arrow']}</div>`;
  return {
    element: element,
    id: identifier
  };
}

async function initializeSettingsField(Field: HTMLElement) {
  var list = await listSettings();
  elementQuerySelector(Field, '.settings_page_body .settings_page_settings').innerHTML = '';
  for (var item of list) {
    var thisElement = generateElementOfItem(item);
    elementQuerySelector(Field, '.settings_page_body .settings_page_settings').appendChild(thisElement.element);
  }
}

export function openSettingsPage(): void {
  var Field: HTMLElement = documentQuerySelector('.settings_page_field');
  Field.setAttribute('displayed', 'true');
  initializeSettingsField(Field);
}

export function closeSettingsPage(): void {
  var Field: HTMLElement = documentQuerySelector('.settings_page_field');
  Field.setAttribute('displayed', 'false');
}
