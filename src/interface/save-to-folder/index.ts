import { FolderContent, FolderWithContent, isFolderContentSaved, listFoldersWithContent, saveLocation, saveRoute, saveStop } from '../../data/folder/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { booleanToString } from '../../tools/index';
import { getIconElement } from '../icons/index';
import { GeneratedElement, pushPageHistory, revokePageHistory } from '../index';
import { promptMessage } from '../prompt/index';

const SaveToFolderField = documentQuerySelector('.css_save_to_folder_field');
const SaveToFolderBodyElement = elementQuerySelector(SaveToFolderField, '.css_save_to_folder_body');
const SaveToFolderListElement = elementQuerySelector(SaveToFolderBodyElement, '.css_save_to_folder_list');

const successfulSaveMessage = '已儲存至資料夾';
const failedSaveMessage = '無法儲存';

function generateElementOfItem(item: FolderWithContent, type: FolderContent['type'], parameters: Array<any>, saveToFolderButtonElement?: HTMLElement | null | undefined): GeneratedElement {
  const itemElement = document.createElement('div');
  itemElement.classList.add('css_save_to_folder_list_item');

  // Icon element
  const iconElement = document.createElement('div');
  iconElement.classList.add('css_save_to_folder_item_icon');
  const iconSpanElement = document.createElement('span');
  iconSpanElement.appendChild(getIconElement(item.icon));
  iconElement.appendChild(iconSpanElement);

  // Name element
  const nameElement = document.createElement('div');
  nameElement.classList.add('css_save_to_folder_item_name');
  nameElement.appendChild(document.createTextNode(item.name));

  itemElement.appendChild(iconElement);
  itemElement.appendChild(nameElement);

  // Event handler
  switch (type) {
    case 'stop': {
      itemElement.onclick = function () {
        saveStop(item.id, parameters[0], parameters[1]).then((e) => {
          if (e) {
            isFolderContentSaved('stop', parameters[0]).then((k) => {
              if (k) {
                if (saveToFolderButtonElement !== null && saveToFolderButtonElement !== undefined) {
                  saveToFolderButtonElement.setAttribute('highlighted', booleanToString(k));
                }
                promptMessage('folder', successfulSaveMessage);
                closeSaveToFolder();
              }
            });
          } else {
            promptMessage('warning', failedSaveMessage);
          }
        });
      };
      break;
    }

    case 'route': {
      itemElement.onclick = function () {
        saveRoute(item.id, parameters[0]).then((e) => {
          if (e) {
            isFolderContentSaved('route', parameters[0]).then((k) => {
              if (k) {
                if (saveToFolderButtonElement !== null && saveToFolderButtonElement !== undefined) {
                  saveToFolderButtonElement.setAttribute('highlighted', booleanToString(k));
                }
                promptMessage('folder', successfulSaveMessage);
                closeSaveToFolder();
              }
            });
          } else {
            promptMessage('warning', failedSaveMessage);
          }
        });
      };
      break;
    }

    case 'location': {
      itemElement.onclick = function () {
        saveLocation(item.id, parameters[0]).then((e) => {
          if (e) {
            isFolderContentSaved('location', parameters[0]).then((k) => {
              if (k) {
                if (saveToFolderButtonElement !== null && saveToFolderButtonElement !== undefined) {
                  saveToFolderButtonElement.setAttribute('highlighted', booleanToString(k));
                }
                promptMessage('folder', successfulSaveMessage);
                closeSaveToFolder();
              }
            });
          } else {
            promptMessage('warning', failedSaveMessage);
          }
        });
      };
      break;
    }
    case 'bus':
      break;
    case 'empty':
      break;
    default:
      break;
  }

  return {
    element: itemElement,
    id: ''
  };
}

async function initializeSaveToFolderField(type: FolderContent['type'], parameters: Array<any>, saveToFolderButtonElement?: HTMLElement | null | undefined) {
  const foldersWithContent = await listFoldersWithContent();
  SaveToFolderListElement.innerHTML = '';
  const fragment = new DocumentFragment();
  for (const item of foldersWithContent) {
    const newItemElement = generateElementOfItem(item, type, parameters, saveToFolderButtonElement);
    fragment.appendChild(newItemElement.element);
  }
  SaveToFolderListElement.append(fragment);
}

export function openSaveToFolder(type: FolderContent['type'], parameters: Array<any>, saveToFolderButtonElement?: HTMLElement | null | undefined): void {
  pushPageHistory('SaveToFolder');
  SaveToFolderField.setAttribute('displayed', 'true');
  initializeSaveToFolderField(type, parameters, saveToFolderButtonElement);
}

export function closeSaveToFolder(): void {
  revokePageHistory('SaveToFolder');
  SaveToFolderField.setAttribute('displayed', 'false');
}
