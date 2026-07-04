import { exportData } from '../../data/export/index';
import { importData } from '../../data/import/index';
import { listSettings, Setting, SettingsArray } from '../../data/settings/index';
import { getTreeURLOfCurrentVersion } from '../../data/settings/version';
import { askForPersistentStorage } from '../../data/storage/index';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { generateIdentifier } from '../../tools/index';
import { shareFile } from '../../tools/share';
import { getBlankIconElement, getIconElement, setIcon } from '../icons/index';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';
import { promptMessage } from '../prompt/index';

const Field = documentQuerySelector('.css_settings_field');
const bodyElement = elementQuerySelector(Field, '.css_settings_body');
const settingsElement = elementQuerySelector(bodyElement, '.css_settings');

const settingElements: Array<HTMLElement> = []; // div.css_setting in div.css_settings

let initialized: boolean = false;

function generateElementOfItem(): HTMLElement {
  const settingElement = documentCreateDivElement();
  settingElement.classList.add('css_setting');

  // Icon
  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_setting_icon');
  iconElement.appendChild(getBlankIconElement());

  // Name
  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_setting_name');

  // Status
  const statusElement = documentCreateDivElement();
  statusElement.classList.add('css_setting_status');

  // Arrow
  const arrowElement = documentCreateDivElement();
  arrowElement.classList.add('css_setting_arrow');
  arrowElement.appendChild(getIconElement('arrow_forward_ios'));

  // Assemble
  settingElement.appendChild(iconElement);
  settingElement.appendChild(nameElement);
  settingElement.appendChild(statusElement);
  settingElement.appendChild(arrowElement);

  return settingElement;
}

export async function initializeSettingsField() {
  const list = await listSettings();
  updateSettingsField(list);
}

function updateSettingsField(list: SettingsArray): void {
  function updateItem(thisElement: HTMLElement, thisItem: Setting): void {
    function updateIcon(thisElement: HTMLElement, thisItem: Setting): void {
      const iconElement = elementQuerySelector(thisElement, '.css_setting_icon');
      setIcon(iconElement, thisItem.icon);
    }

    function updateName(thisElement: HTMLElement, thisItem: Setting): void {
      const nameElement = elementQuerySelector(thisElement, '.css_setting_name');
      nameElement.innerText = thisItem.name;
    }

    function updateStatus(thisElement: HTMLElement, thisItem: Setting): void {
      const statusElement = elementQuerySelector(thisElement, '.css_setting_status');
      statusElement.innerText = thisItem.status;
    }

    function updateType(thisElement: HTMLElement, thisItem: Setting): void {
      thisElement.setAttribute('type', thisItem.type);
    }

    function updateOnclick(thisElement: HTMLElement, thisItem: Setting): void {
      if (typeof thisItem.action === 'function') {
        thisElement.onclick = function () {
          thisItem.action();
        };
      }
    }

    if (!initialized) {
      updateIcon(thisElement, thisItem);
      updateName(thisElement, thisItem);
      updateType(thisElement, thisItem);
      updateOnclick(thisElement, thisItem);
    }

    updateStatus(thisElement, thisItem);
  }

  const listLength = list.length;
  const settingElementsLength = settingElements.length;
  if (listLength !== settingElementsLength) {
    const difference = settingElementsLength - listLength;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newSettingElement = generateElementOfItem();
        fragment.appendChild(newSettingElement);
        settingElements.push(newSettingElement);
      }
      settingsElement.append(fragment);
    } else if (difference > 0) {
      for (let p = settingElementsLength - 1, q = settingElementsLength - difference - 1; p > q; p--) {
        settingElements[p].remove();
        settingElements.splice(p, 1);
      }
    }
  }

  for (let i = 0; i < listLength; i++) {
    const thisElement = settingElements[i];
    const thisItem = list[i];
    updateItem(thisElement, thisItem);
  }

  initialized = true;
}

export function shwoSettings(): void {
  Field.setAttribute('displayed', 'true');
}

export function hideSettings(): void {
  Field.setAttribute('displayed', 'false');
}

export function openSettings(): void {
  pushPageHistory('Settings');
  shwoSettings();
  initializeSettingsField();
  hidePreviousPage();
}

export function closeSettings(): void {
  hideSettings();
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
