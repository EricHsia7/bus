import { Folder, FolderWithContentLength, FolderWithContentLengthArray, listFoldersWithContentLength, removeFolder, updateFolderIndex } from '../../data/folder/index';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/elements';
import { openFolderCreator } from '../folder-creator/index';
import { openFolderEditor } from '../folder-editor/index';
import { getBlankIconElement, getIconElement, setIcon } from '../icons/index';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';
import { promptMessage } from '../prompt/index';

const Field = documentQuerySelector('.css_folder_manager_field');

const HeadElement = elementQuerySelector(Field, '.css_folder_manager_head');
const HeadButtonLeftElement = elementQuerySelector(HeadElement, '.css_folder_manager_button_left');
const HeadButtonRightElement = elementQuerySelector(HeadElement, '.css_folder_manager_button_right');

const BodyElement = elementQuerySelector(Field, '.css_folder_manager_body');
const ListElement = elementQuerySelector(BodyElement, '.css_folder_manager_folder_list');

/**
 * div.css_folder_manager_folder_item(n) in div.css_folder_manager_folder_list(1)
 */
const folderItemElements: Array<HTMLElement> = [];

let previousFoldersWithContentLength: FolderWithContentLengthArray = [];

function generateElementOfItem(): HTMLElement {
  // Main container
  const itemElement = documentCreateDivElement();
  itemElement.classList.add('css_folder_manager_folder_item');

  // Head
  const headElement = documentCreateDivElement();
  headElement.classList.add('css_folder_manager_folder_item_head');

  // Icon
  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_folder_manager_folder_item_icon');
  iconElement.appendChild(getBlankIconElement());

  // Name
  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_folder_manager_folder_item_name');

  // Status
  const statusElement = documentCreateDivElement();
  statusElement.classList.add('css_folder_manager_folder_item_status');

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

  // Sort down control
  const sortDownElement = documentCreateDivElement();
  sortDownElement.classList.add('css_folder_manager_folder_item_drawer_button');
  sortDownElement.appendChild(getIconElement('keyboard_arrow_down'));

  // Delete control
  const deleteElement = documentCreateDivElement();
  deleteElement.classList.add('css_folder_manager_folder_item_drawer_button');
  deleteElement.appendChild(getIconElement('delete'));

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

function initializeFolderManagerField(): void {
  HeadButtonLeftElement.onclick = closeFolderManager;
  HeadButtonRightElement.onclick = function () {
    openFolderCreator(function () {
      initializeFolderManagerField();
    });
  };
  const foldersWithContentLength = listFoldersWithContentLength();
  updateFolderManagerField(foldersWithContentLength);
}

function updateFolderManagerField(foldersWithContentLength: FolderWithContentLengthArray): void {
  function updateItem(thisElement: HTMLElement, thisItem: FolderWithContentLength, previousItem: FolderWithContentLength | null): void {
    function updateIcon(thisElement: HTMLElement, thisItem: FolderWithContentLength): void {
      const headElement = elementQuerySelector(thisElement, '.css_folder_manager_folder_item_head');
      const iconElement = elementQuerySelector(headElement, '.css_folder_manager_folder_item_icon');
      setIcon(iconElement, thisItem.icon);
    }

    function updateName(thisElement: HTMLElement, thisItem: FolderWithContentLength): void {
      const headElement = elementQuerySelector(thisElement, '.css_folder_manager_folder_item_head');
      const nameElement = elementQuerySelector(headElement, '.css_folder_manager_folder_item_name');
      nameElement.textContent = thisItem.name;
    }

    function updateStatus(thisElement: HTMLElement, thisItem: FolderWithContentLength): void {
      const headElement = elementQuerySelector(thisElement, '.css_folder_manager_folder_item_head');
      const statusElement = elementQuerySelector(headElement, '.css_folder_manager_folder_item_status');
      statusElement.textContent = thisItem.contentLength.toString();
    }

    function updateDrawer(thisElement: HTMLElement, thisItem: FolderWithContentLength): void {
      const drawerElement = elementQuerySelector(thisElement, '.css_folder_manager_folder_item_drawer');
      const [sortUpElement, sortDownElement, deleteElement] = elementQuerySelectorAll(drawerElement, '.css_folder_manager_folder_item_drawer_button');
      sortUpElement.onclick = function () {
        moveItemOnFolderManager(thisElement, thisItem.id, 'up');
      };
      sortDownElement.onclick = function () {
        moveItemOnFolderManager(thisElement, thisItem.id, 'down');
      };
      deleteElement.onclick = function () {
        removeItemOnFolderManager(thisElement, thisItem.id);
      };
    }

    function updateOnclick(thisElement: HTMLElement, thisItem: FolderWithContentLength): void {
      const headElement = elementQuerySelector(thisElement, '.css_folder_manager_folder_item_head');
      headElement.onclick = function () {
        openFolderEditor(thisItem.id, function () {
          initializeFolderManagerField();
        });
      };
    }

    if (previousItem !== null) {
      if (previousItem.icon !== thisItem.icon) {
        updateIcon(thisElement, thisItem);
      }

      if (previousItem.name !== thisItem.name) {
        updateName(thisElement, thisItem);
      }

      if (previousItem.contentLength !== thisItem.contentLength) {
        updateStatus(thisElement, thisItem);
      }

      if (previousItem.id !== thisItem.id) {
        updateDrawer(thisElement, thisItem);
        updateOnclick(thisElement, thisItem);
      }
    } else {
      updateIcon(thisElement, thisItem);
      updateName(thisElement, thisItem);
      updateStatus(thisElement, thisItem);
      updateDrawer(thisElement, thisItem);
      updateOnclick(thisElement, thisItem);
    }
  }

  const foldersWithContentLengthLength = foldersWithContentLength.length;

  const folderElementsLength = folderItemElements.length;
  if (foldersWithContentLengthLength !== folderElementsLength) {
    const difference = folderElementsLength - foldersWithContentLengthLength;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newFolderItemElement = generateElementOfItem();
        fragment.appendChild(newFolderItemElement);
        folderItemElements.push(newFolderItemElement);
      }
      ListElement.append(fragment);
    } else if (difference > 0) {
      for (let p = folderElementsLength - 1, q = folderElementsLength - difference - 1; p > q; p--) {
        folderItemElements[p].remove();
        folderItemElements.splice(p, 1);
      }
    }
  }

  for (let i = 0; i < foldersWithContentLengthLength; i++) {
    const thisElement = folderItemElements[i];
    const thisItem = foldersWithContentLength[i];
    const previousItem = previousFoldersWithContentLength[i];
    if (previousItem) {
      updateItem(thisElement, thisItem, previousItem);
    } else {
      updateItem(thisElement, thisItem, null);
    }
  }

  previousFoldersWithContentLength = foldersWithContentLength;
}

export function showFolderManager(): void {
  Field.setAttribute('displayed', 'true');
}

export function hideFolderManager(): void {
  Field.setAttribute('displayed', 'false');
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
    const index = folderItemElements.indexOf(itemElement);
    folderItemElements.splice(index, 1);
    promptMessage('delete', '已移除資料夾');
  } else {
    promptMessage('error', '無法移除');
  }
}

export async function moveItemOnFolderManager(itemElement: HTMLElement, folderID: Folder['id'], direction: 'up' | 'down') {
  const update = await updateFolderIndex(folderID, direction);
  if (update) {
    switch (direction) {
      case 'up': {
        const previousSibling = itemElement.previousElementSibling;
        const parentNode = itemElement.parentNode;
        if (previousSibling && parentNode) {
          parentNode.insertBefore(itemElement, previousSibling);
        }
        const index = folderItemElements.indexOf(itemElement);
        folderItemElements.splice(index, 1);
        folderItemElements.splice(index - 1, 0, itemElement);
        promptMessage('arrow_circle_up', '已往上移');
        break;
      }
      case 'down': {
        const nextSibling = itemElement.nextElementSibling;
        const parentNode = itemElement.parentNode;
        if (nextSibling && parentNode) {
          parentNode.insertBefore(nextSibling, itemElement);
        }
        const index = folderItemElements.indexOf(itemElement);
        folderItemElements.splice(index, 1);
        folderItemElements.splice(index + 1, 0, itemElement);
        promptMessage('arrow_circle_down', '已往下移');
        break;
      }
      default:
        break;
    }
  } else {
    promptMessage('error', '無法移動');
  }
}
