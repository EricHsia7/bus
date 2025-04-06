import { exportData } from '../../data/export/index';
import { importData } from '../../data/import/index';
import { listSettings, Setting } from '../../data/settings/index';
import { getCommitURLOfCurrentVersion } from '../../data/settings/version';
import { askForPersistentStorage } from '../../data/storage/index';
import { generateIdentifier, releaseFile } from '../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { getIconHTML } from '../icons/index';
import { GeneratedElement, pushPageHistory, revokePageHistory } from '../index';
import { promptMessage } from '../prompt/index';

const SettingsField = documentQuerySelector('.css_settings_field');
const SettingsBodyElement = elementQuerySelector(SettingsField, '.css_settings_body');
const SettingsElement = elementQuerySelector(SettingsBodyElement, '.css_settings');

function generateElementOfItem(item: Setting): GeneratedElement {
  // const identifier = generateIdentifier('i');
  const element = document.createElement('div');
  element.classList.add('css_setting');
  // element.id = identifier;
  element.setAttribute('onclick', item.action);
  element.setAttribute('type', item.type);
  element.innerHTML = /*html*/ `<div class="css_setting_icon">${getIconHTML(item.icon)}</div><div class="css_setting_name">${item.name}</div><div class="css_setting_status">${item.status}</div><div class="css_setting_arrow">${getIconHTML('arrow_forward_ios')}</div>`;
  return {
    element: element,
    id: ''
  };
}

async function initializeSettingsField() {
  const list = await listSettings();
  SettingsElement.innerHTML = '';
  const fragment = new DocumentFragment();
  for (const item of list) {
    const thisElement = generateElementOfItem(item);
    fragment.appendChild(thisElement.element);
  }
  SettingsElement.append(fragment);
}

export function openSettings(): void {
  pushPageHistory('Settings');
  SettingsField.setAttribute('displayed', 'true');
  initializeSettingsField();
}

export function closeSettings(): void {
  revokePageHistory('Settings');
  SettingsField.setAttribute('displayed', 'false');
}

export async function downloadExportFile() {
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
    function () {
      documentQuerySelector(`body #${identifier}`).remove();
    },
    { once: true }
  );

  document.body.append(fileInput);
  documentQuerySelector(`body #${identifier}`).click();
}

export function viewCommitOfCurrentVersion(): void {
  const url = getCommitURLOfCurrentVersion();
  window.open(url);
}

export function showPromptToAskForPersistentStorage(): void {
  askForPersistentStorage().then((e) => {
    switch (e) {
      case 'granted':
        promptMessage('已開啟永久儲存', 'check_circle');
        break;
      case 'denied':
        promptMessage('永久儲存權限已被拒絕', 'cancel');
        break;
      case 'unsupported':
        promptMessage('此瀏覽器不支援永久儲存', 'warning');
        break;
      default:
        promptMessage('發生錯誤', 'error');
        break;
    }
  });
}
