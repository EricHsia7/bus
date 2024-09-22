import { releaseFile, generateIdentifier } from '../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { listSettings } from '../../data/settings/index';
import { exportData } from '../../data/export/index';
import { importData } from '../../data/import/index';
import { getIconHTML } from '../icons/index';
import { GeneratedElement, pushPageHistory, revokePageHistory } from '../index';
import { promptMessage } from '../prompt/index';

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

export function openSettings(): void {
  pushPageHistory('Settings');
  var Field: HTMLElement = documentQuerySelector('.css_settings_page_field');
  Field.setAttribute('displayed', 'true');
  initializeSettingsField(Field);
}

export function closeSettings(): void {
  revokePageHistory('Settings');
  var Field: HTMLElement = documentQuerySelector('.css_settings_page_field');
  Field.setAttribute('displayed', 'false');
}

export async function downloadExportFile(): void {
  const exportedData = await exportData();
  releaseFile(exportedData, 'application/json', 'bus-export.json');
}

export function openFileToImportData(): void {
  const identifier = generateIdentifier('i');
  const fileInput = document.createElement('input');
  fileInput.setAttribute('type', 'file');
  fileInput.setAttribute('accept', 'application/json');
  fileInput.setAttribute('name', identifier);
  fileInput.id = identifier;
  fileInput.classList.add('css_import_file_input');
  fileInput.addEventListener(
    'change',
    function (event) {
      // Check if a file is selected
      if (event.target.files.length === 0) {
        documentQuerySelector(`body #${identifier}`).remove();
      } else {
        // Get the first file selected by the user
        const file = event.target.files[0];
        const reader = new FileReader();

        // When the file is successfully read
        reader.onload = function (e) {
          // Get the file content as text
          const fileTextContent = e.target.result;

          // Import the data
          importData(fileTextContent).then((f) => {
            if (f) {
              promptMessage('已匯入資料', 'check_circle');
            } else {
              promptMessage('無法匯入資料', 'error');
            }
            documentQuerySelector(`body #${identifier}`).remove();
          });
        };

        // Read the file as text
        reader.readAsText(file);
      }
    },
    { once: true }
  );
  fileInput.addEventListener(
    'cancel',
    function (event) {
      documentQuerySelector(`body #${identifier}`).remove();
    },
    { once: true }
  );

  document.body.append(fileInput);
  documentQuerySelector(`body #${identifier}`).click();
}
