import { generateIdentifier } from '../../tools/index.ts';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector.ts';
import { listSettings } from '../../data/settings/index.ts';
import { getIconHTML } from '../icons/index.ts';
import { GeneratedElement } from '../index.ts';

function generateElementOfItem(item: object): GeneratedElement {
  var identifier = `i_${generateIdentifier()}`;
  var element = document.createElement('div');
  element.classList.add('css_setting');
  element.id = identifier;
  element.setAttribute('onclick', item.action);
  element.setAttribute('type', item.type);
  element.innerHTML = `<div class="css_setting_icon">${getIconHTML(item.icon)}</div><div class="css_setting_name">${item.name}</div><div class="css_setting_status">${item.status}</div><div class="css_setting_arrow">${getIconHTML('arrow_forward_ios')}</div>`;
  return {
    element: element,
    id: identifier
  };
}

async function initializeSettingsField(Field: HTMLElement) {
  var list = await listSettings();
  elementQuerySelector(Field, '.css_settings_page_body .css_settings_page_settings').innerHTML = '';
  for (var item of list) {
    var thisElement = generateElementOfItem(item);
    elementQuerySelector(Field, '.css_settings_page_body .css_settings_page_settings').appendChild(thisElement.element);
  }
}

export function openSettingsPage(): void {
  var Field: HTMLElement = documentQuerySelector('.css_settings_page_field');
  Field.setAttribute('displayed', 'true');
  initializeSettingsField(Field);
}

export function closeSettingsPage(): void {
  var Field: HTMLElement = documentQuerySelector('.css_settings_page_field');
  Field.setAttribute('displayed', 'false');
}
