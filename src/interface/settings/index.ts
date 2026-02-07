import { exportData } from '../../data/export/index';
import { importData } from '../../data/import/index';
import { listSettings, Setting } from '../../data/settings/index';
import { getTreeURLOfCurrentVersion } from '../../data/settings/version';
import { askForPersistentStorage } from '../../data/storage/index';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { generateIdentifier } from '../../tools/index';
import { shareFile } from '../../tools/share';
import { getIconElement } from '../icons/index';
import { hidePreviousPage, PageTransitionDirection, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';
import { promptMessage } from '../prompt/index';

const SettingsField = documentQuerySelector('.css_settings_field');
const SettingsBodyElement = elementQuerySelector(SettingsField, '.css_settings_body');
const SettingsElement = elementQuerySelector(SettingsBodyElement, '.css_settings');

function generateElementOfItem(item: Setting): HTMLElement {
  const settingElement = documentCreateDivElement();
  settingElement.classList.add('css_setting');
  settingElement.setAttribute('type', item.type);

  // Icon
  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_setting_icon');
  const iconSpanElement = document.createElement('span');
  iconSpanElement.appendChild(getIconElement(item.icon));
  iconElement.appendChild(iconSpanElement);

  // Name
  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_setting_name');
  nameElement.innerText = item.name;

  // Status
  const statusElement = documentCreateDivElement();
  statusElement.classList.add('css_setting_status');
  statusElement.innerText = item.status;

  // Arrow
  const arrowElement = documentCreateDivElement();
  arrowElement.classList.add('css_setting_arrow');
  const arrowSpanElement = document.createElement('span');
  arrowSpanElement.appendChild(getIconElement('arrow_forward_ios'));
  arrowElement.appendChild(arrowSpanElement);

  // Event handler (lambda)
  if (typeof item.action === 'function') {
    settingElement.onclick = function () {
      item.action();
    };
  } else if (typeof item.action === 'string') {
    settingElement.setAttribute('onclick', item.action);
  }

  // Assemble
  settingElement.appendChild(iconElement);
  settingElement.appendChild(nameElement);
  settingElement.appendChild(statusElement);
  settingElement.appendChild(arrowElement);

  return settingElement;
}

export async function initializeSettingsField() {
  const list = await listSettings();
  SettingsElement.innerHTML = '';
  const fragment = new DocumentFragment();
  for (const item of list) {
    const thisElement = generateElementOfItem(item);
    fragment.appendChild(thisElement);
  }
  SettingsElement.append(fragment);
}

export function shwoSettings(pageTransitionDirection: PageTransitionDirection): void {
  const className = pageTransitionDirection === 'ltr' ? 'css_page_transition_slide_in_ltr' : 'css_page_transition_slide_in_rtl';
  SettingsField.addEventListener(
    'animationend',
    function () {
      SettingsField.classList.remove(className);
    },
    { once: true }
  );
  SettingsField.classList.add(className);
  SettingsField.setAttribute('displayed', 'true');
}

export function hideSettings(pageTransitionDirection: PageTransitionDirection): void {
  const className = pageTransitionDirection === 'ltr' ? 'css_page_transition_slide_out_ltr' : 'css_page_transition_slide_out_rtl';
  SettingsField.addEventListener(
    'animationend',
    function () {
      SettingsField.setAttribute('displayed', 'false');
      SettingsField.classList.remove(className);
    },
    { once: true }
  );
  SettingsField.classList.add(className);
}

export function openSettings(): void {
  pushPageHistory('Settings');
  shwoSettings('rtl');
  initializeSettingsField();
  hidePreviousPage();
}

export function closeSettings(): void {
  hideSettings('ltr');
  showPreviousPage();
  revokePageHistory('Settings');
}

export async function downloadExportFile() {
  promptMessage('manufacturing', '資料匯出中');
  const content = await exportData();
  shareFile(content, 'application/json', 'bus-export.json');
}

export function openFileToImportData(): void {
  const identifier = generateIdentifier();
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
              promptMessage('check_circle', '已匯入資料');
            } else {
              promptMessage('error', '無法匯入資料');
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

export function viewSourceCodeOfCurrentVersion(): void {
  const url = getTreeURLOfCurrentVersion();
  window.open(url);
}

export function viewGitHubRepository(): void {
  const url = 'https://github.com/EricHsia7/bus';
  window.open(url);
}

export function showPromptToAskForPersistentStorage(): void {
  askForPersistentStorage().then((e) => {
    switch (e) {
      case 'granted':
        promptMessage('check_circle', '已開啟永久儲存');
        break;
      case 'denied':
        promptMessage('cancel', '永久儲存權限已被拒絕');
        break;
      case 'unsupported':
        promptMessage('warning', '此瀏覽器不支援永久儲存');
        break;
      default:
        promptMessage('error', '發生錯誤');
        break;
    }
  });
}
