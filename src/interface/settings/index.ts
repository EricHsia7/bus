import { releaseFile, generateIdentifier } from '../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { listSettings } from '../../data/settings/index';
import { exportData } from '../../data/export/index';
import { getIconHTML } from '../icons/index';
import { GeneratedElement } from '../index';

function generateElementOfItem(item: object): GeneratedElement {
  var identifier = generateIdentifier('i');
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

function initializeSettingsField(Field: HTMLElement) {
  var list = listSettings();
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

export async function downloadExportFile(): void {
  const exportedData = await exportData();
  releaseFile(exportedData, 'application/json', 'bus-export.json');
}
