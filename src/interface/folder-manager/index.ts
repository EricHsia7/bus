import { FolderWithContentLength, listFoldersWithContentLength, removeFolder, updateFolderIndex } from '../../data/folder/index';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { openFolderCreator } from '../folder-creator/index';
import { openFolderEditor } from '../folder-editor/index';
import { getIconElement } from '../icons/index';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';
import { promptMessage } from '../prompt/index';

const FolderManagerField = documentQuerySelector('.css_folder_manager_field');
const bodyElement = elementQuerySelector(FolderManagerField, '.css_folder_manager_body');
const listElement = elementQuerySelector(bodyElement, '.css_folder_manager_folder_list');
const headElement = elementQuerySelector(FolderManagerField, '.css_folder_manager_head');
const rightButtonElement = elementQuerySelector(headElement, '.css_folder_manager_button_right');

function generateElementOfItem(item: FolderWithContentLength): HTMLElement {
  // Main container
  const itemElement = documentCreateDivElement();
  itemElement.classList.add('css_folder_manager_folder_item');
  itemElement.onclick = function () {
    openFolderEditor(item.id, function () {
      initializeFolderManagerField();
    });
  };

  // Head
  const headElement = documentCreateDivElement();
  headElement.classList.add('css_folder_manager_folder_item_head');

  // Icon
  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_folder_manager_folder_item_icon');
  iconElement.appendChild(getIconElement(item.icon));

  // Name
  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_folder_manager_folder_item_name');
  nameElement.innerText = item.name;

  // Status
  const statusElement = documentCreateDivElement();
  statusElement.classList.add('css_folder_manager_folder_item_status');
  statusElement.innerText = String(item.contentLength);

  // Arrow
  const arrowElement = documentCreateDivElement();
  arrowElement.classList.add('css_folder_manager_folder_item_arrow');
  arrowElement.appendChild(getIconElement('arrow_forward_ios'));

  // Drawer
  const drawerElement = documentCreateDivElement();
  drawerElement.classList.add('css_folder_manager_folder_item_drawer');

  // Sort up control
  const sortUpElement = documentCreateDivElement();
  sortUpElement.classList.add('css_folder_manager_folder_item_drawer_button');
  sortUpElement.appendChild(getIconElement('keyboard_arrow_down'));
  sortUpElement.onclick = () => {
    moveItemOnFolderManager(itemElement, folder.id, 'up');
  };

  // Sort down control
  const sortDownElement = documentCreateDivElement();
  sortDownElement.classList.add('css_folder_manager_folder_item_drawer_button');
  sortDownElement.appendChild(getIconElement('keyboard_arrow_down'));
  sortDownElement.onclick = () => {
    moveItemOnFolderManager(itemElement, folder.id, 'down');
  };

  // Delete control
  const deleteElement = documentCreateDivElement();
  deleteElement.classList.add('css_folder_manager_folder_item_drawer_button');
  deleteElement.appendChild(getIconElement('delete'));
  deleteElement.onclick = () => {
    removeItemOnFolderManager(itemElement, folder.id);
  };

  // Assemble drawer
  drawerElement.appendChild(sortUpElement);
  drawerElement.appendChild(sortDownElement);
  drawerElement.appendChild(deleteElement);

  // Assemble head
  headElement.appendChild(iconElement);
  headElement.appendChild(nameElement);
  headElement.appendChild(statusElement);
  headElement.appendChild(arrowElement);

  itemElement.appendChild(headElement);
  itemElement.appendChild(drawerElement);

  return itemElement;
}

async function initializeFolderManagerField() {
  rightButtonElement.onclick = function () {
    openFolderCreator(function () {
      initializeFolderManagerField();
    });
  };
  const foldersWithContent = await listFoldersWithContentLength();
  listElement.innerHTML = '';
  const fragment = new DocumentFragment();
  for (const item of foldersWithContent) {
    const newItemElement = generateElementOfItem(item);
    fragment.appendChild(newItemElement);
  }
  listElement.append(fragment);
}

export function showFolderManager(): void {
  FolderManagerField.setAttribute('displayed', 'true');
}

export function hideFolderManager(): void {
  FolderManagerField.setAttribute('displayed', 'false');
}

export function openFolderManager(): void {
  pushPageHistory('FolderManager');
  showFolderManager();
  initializeFolderManagerField();
  hidePreviousPage();
}

export function closeFolderManager(): void {
  hideFolderManager();
  showPreviousPage();
  revokePageHistory('FolderManager');
}

export async function removeItemOnFolderManager(itemElement: HTMLElement, folderID: Folder['id']) {
  const removal = await removeFolder(folderID);
  if (removal) {
    itemElement.remove();
    promptMessage('delete', '已移除資料夾');
  } else {
    promptMessage('error', '無法移除');
  }
}

export async function moveItemOnFolderManager(itemElement: HTMLElement, folderID: Folder['id'], direction: 'up' | 'down') {
  const update = await updateFolderIndex(folderID, direction);
  if (update) {
    switch (direction) {
      case 'up':
        const previousSibling = itemElement.previousElementSibling;
        if (previousSibling) {
          itemElement.parentNode.insertBefore(itemElement, previousSibling);
        }
        promptMessage('arrow_circle_up', '已往上移');
        break;
      case 'down':
        const nextSibling = itemElement.nextElementSibling;
        if (nextSibling) {
          itemElement.parentNode.insertBefore(nextSibling, itemElement);
        }
        promptMessage('arrow_circle_down', '已往下移');
        break;
      default:
        break;
    }
  } else {
    promptMessage('error', '無法移動');
  }
}
