import { Folder, FolderContent, FolderContentLocation, FolderContentRoute, FolderContentStop, listFolders, saveLocation, saveRoute, saveStop } from '../../data/folder/index';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { openFolderCreator } from '../folder-creator/index';
import { getBlankIconElement, setIcon } from '../icons/index';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';
import { promptMessage } from '../prompt/index';

const SaveToFolderField = documentQuerySelector('.css_save_to_folder_field');
const bodyElement = elementQuerySelector(SaveToFolderField, '.css_save_to_folder_body');
const listElement = elementQuerySelector(bodyElement, '.css_save_to_folder_list');
const headElement = elementQuerySelector(SaveToFolderField, '.css_save_to_folder_head');
const rightButtonElement = elementQuerySelector(headElement, '.css_save_to_folder_button_right');

/**
 * div.css_save_to_folder_list_item(n) in div.css_save_to_folder_list(1)
 */
const itemElements: Array<HTMLElement> = [];

const successfulSaveMessage = '已儲存至資料夾';
const failedSaveMessage = '無法儲存';

let previousFolders: Array<Folder> = [];

function generateElementOfItem(): HTMLElement {
  const itemElement = documentCreateDivElement();
  itemElement.classList.add('css_save_to_folder_list_item');

  // Icon element
  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_save_to_folder_item_icon');
  iconElement.appendChild(getBlankIconElement());

  // Name element
  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_save_to_folder_item_name');

  itemElement.appendChild(iconElement);
  itemElement.appendChild(nameElement);

  return itemElement;
}

function initializeSaveToFolderField(type: FolderContent['type'], parameters: Array<any>, saveToFolderButtonElement?: HTMLElement | null | undefined): void {
  const folders = listFolders();
  updateSaveToFolderField(folders, type, parameters, saveToFolderButtonElement);
}

function updateSaveToFolderField(folders: Array<Folder>, type: FolderContent['type'], parameters: Array<any>, saveToFolderButtonElement?: HTMLElement | null | undefined): void {
  function updateItem(thisElement: HTMLElement, thisItem: Folder, previousItem: Folder | null, type: FolderContent['type'], parameters: Array<any>, saveToFolderButtonElement?: HTMLElement | null | undefined): void {
    function updateIcon(thisElement: HTMLElement, thisItem: Folder): void {
      const iconElement = elementQuerySelector(thisElement, '.css_save_to_folder_item_icon');
      setIcon(iconElement, thisItem.icon);
    }

    function updateName(thisElement: HTMLElement, thisItem: Folder): void {
      const nameElement = elementQuerySelector(thisElement, '.css_save_to_folder_item_name');
      nameElement.textContent = thisItem.name;
    }

    function updateOnclick(thisElement: HTMLElement, thisItem: Folder, type: FolderContent['type'], parameters: Array<any>, saveToFolderButtonElement?: HTMLElement | null | undefined): void {
      switch (type) {
        case 'stop':
          thisElement.onclick = function () {
            handleSaveStop(thisItem.id, parameters[0], parameters[1], saveToFolderButtonElement);
          };
          break;
        case 'route':
          thisElement.onclick = function () {
            handleSaveRoute(thisItem.id, parameters[0], saveToFolderButtonElement);
          };
          break;
        case 'location':
          thisElement.onclick = function () {
            handleSaveLocation(thisItem.id, parameters[0], saveToFolderButtonElement);
          };
          break;
        default:
          thisElement.onclick = null;
          break;
      }
    }

    if (previousItem !== null) {
      updateOnclick(thisElement, thisItem, type, parameters, saveToFolderButtonElement);

      if (thisItem.icon !== previousItem.icon) {
        updateIcon(thisElement, thisItem);
      }

      if (thisItem.name !== previousItem.name) {
        updateName(thisElement, thisItem);
      }
    } else {
      updateIcon(thisElement, thisItem);
      updateName(thisElement, thisItem);
      updateOnclick(thisElement, thisItem, type, parameters, saveToFolderButtonElement);
    }
  }

  rightButtonElement.onclick = function () {
    openFolderCreator(function () {
      initializeSaveToFolderField(type, parameters, saveToFolderButtonElement);
    });
  };

  const foldersLength = folders.length;
  const itemElementsLength = itemElements.length;

  if (foldersLength !== itemElementsLength) {
    const difference = itemElementsLength - foldersLength;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newItemElement = generateElementOfItem();
        fragment.appendChild(newItemElement);
        itemElements.push(newItemElement);
      }
      listElement.append(fragment);
    } else if (difference > 0) {
      for (let p = itemElementsLength - 1, q = itemElementsLength - difference - 1; p > q; p--) {
        itemElements[p].remove();
        itemElements.splice(p, 1);
      }
    }
  }

  for (let i = 0; i < foldersLength; i++) {
    const thisElement = itemElements[i];
    const thisItem = folders[i];
    const previousItem = previousFolders[i];
    if (previousItem) {
      updateItem(thisElement, thisItem, previousItem, type, parameters, saveToFolderButtonElement);
    } else {
      updateItem(thisElement, thisItem, null, type, parameters, saveToFolderButtonElement);
    }
  }

  previousFolders = folders;
}

export function showSaveToFolder(): void {
  SaveToFolderField.setAttribute('displayed', 'true');
}

export function hideSaveToFolder(): void {
  SaveToFolderField.setAttribute('displayed', 'false');
}

export function openSaveToFolder(type: FolderContent['type'], parameters: Array<any>, saveToFolderButtonElement?: HTMLElement | null | undefined): void {
  pushPageHistory('SaveToFolder');
  showSaveToFolder();
  initializeSaveToFolderField(type, parameters, saveToFolderButtonElement);
  hidePreviousPage();
}

export function closeSaveToFolder(): void {
  hideSaveToFolder();
  showPreviousPage();
  revokePageHistory('SaveToFolder');
}

async function handleSaveStop(folderID: Folder['id'], StopID: FolderContentStop['id'], RouteID: FolderContentStop['route']['id'], saveToFolderButtonElement?: HTMLElement | null | undefined) {
  const result = await saveStop(folderID, StopID, RouteID);
  if (result) {
    if (saveToFolderButtonElement !== null && saveToFolderButtonElement !== undefined) {
      saveToFolderButtonElement.setAttribute('highlighted', 'true');
    }
    promptMessage('folder', successfulSaveMessage);
    closeSaveToFolder();
  } else {
    promptMessage('warning', failedSaveMessage);
  }
}

async function handleSaveRoute(folderID: Folder['id'], RouteID: FolderContentRoute['id'], saveToFolderButtonElement?: HTMLElement | null | undefined) {
  const result = await saveRoute(folderID, RouteID);
  if (result) {
    if (saveToFolderButtonElement !== null && saveToFolderButtonElement !== undefined) {
      saveToFolderButtonElement.setAttribute('highlighted', 'true');
    }
    promptMessage('folder', successfulSaveMessage);
    closeSaveToFolder();
  } else {
    promptMessage('warning', failedSaveMessage);
  }
}

async function handleSaveLocation(folderID: Folder['id'], hash: FolderContentLocation['id'], saveToFolderButtonElement?: HTMLElement | null | undefined) {
  const result = await saveLocation(folderID, hash);
  if (result) {
    if (saveToFolderButtonElement !== null && saveToFolderButtonElement !== undefined) {
      saveToFolderButtonElement.setAttribute('highlighted', 'true');
    }
    promptMessage('folder', successfulSaveMessage);
    closeSaveToFolder();
  } else {
    promptMessage('warning', failedSaveMessage);
  }
}
