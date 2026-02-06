import { Folder, FolderContent, getFolder, listFolderContent, removeFromFolder, updateFolder, updateFolderContentIndex } from '../../data/folder/index';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { openIconSelector } from '../icon-selector/index';
import { getIconElement } from '../icons/index';
import { MaterialSymbols } from '../icons/material-symbols-type';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';
import { promptMessage } from '../prompt/index';

const FolderEditorField = documentQuerySelector('.css_folder_editor_field');
const FolderEditorHeadElement = elementQuerySelector(FolderEditorField, '.css_folder_editor_head');
const LeftButtonElement = elementQuerySelector(FolderEditorHeadElement, '.css_folder_editor_button_left');
const FolderEditorBodyElement = elementQuerySelector(FolderEditorField, '.css_folder_editor_body');
const FolderEditorGroupsElement = elementQuerySelector(FolderEditorBodyElement, '.css_folder_editor_groups');
const NameInputElement = elementQuerySelector(FolderEditorGroupsElement, '.css_folder_editor_group[group="folder-name"] .css_folder_editor_group_body input') as HTMLInputElement;
const IconInputElement = elementQuerySelector(FolderEditorGroupsElement, '.css_folder_editor_group[group="folder-icon"] .css_folder_editor_group_body .css_folder_editor_icon_input input') as HTMLInputElement;
const OpenIconSelectorElement = elementQuerySelector(FolderEditorGroupsElement, '.css_folder_editor_group[group="folder-icon"] .css_folder_editor_group_body .css_folder_editor_icon_input .css_folder_editor_open_icon_selector');
const FolderContentElement = elementQuerySelector(FolderEditorGroupsElement, '.css_folder_editor_group[group="folder-content"] .css_folder_editor_group_body');

OpenIconSelectorElement.onclick = function () {
  openIconSelector(IconInputElement);
};

function generateElementOfItem(folder: Folder, item: FolderContent): HTMLElement {
  // Main container
  const itemElement = documentCreateDivElement();
  itemElement.classList.add('css_folder_editor_folder_item');
  itemElement.setAttribute('type', item.type);

  // Icon, context, main text
  let context = '';
  let main = '';
  let icon: MaterialSymbols = '';
  switch (item.type) {
    case 'stop':
      icon = 'location_on';
      context = `${item.route ? item.route.name : ''} - 往${item.route ? [item.route.endPoints.destination, item.route.endPoints.departure, ''][item.direction ? item.direction : 0] : ''}`;
      main = item.name;
      break;
    case 'route':
      icon = 'route';
      context = `${item.endPoints.departure} \u2194 ${item.endPoints.destination}`;
      main = item.name;
      break;
    case 'location':
      icon = 'location_on';
      context = '地點';
      main = item.name;
      break;
    case 'bus':
      context = '';
      main = item.name;
      break;
    case 'empty':
      icon = 'lightbulb';
      context = '提示';
      main = '沒有內容';
      break;
    default:
      icon = '';
      context = 'null';
      main = 'null';
      break;
  }

  // Icon element
  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_folder_editor_folder_item_icon');
  iconElement.appendChild(getIconElement(icon));

  // Context element
  const contextElement = documentCreateDivElement();
  contextElement.classList.add('css_folder_editor_folder_item_context');
  contextElement.innerText = context;

  // Main element
  const mainElement = documentCreateDivElement();
  mainElement.classList.add('css_folder_editor_folder_item_main');
  mainElement.innerText = main;

  // Capsule element
  const capsuleElement = documentCreateDivElement();
  capsuleElement.classList.add('css_folder_editor_folder_item_capsule');

  // Sort up control
  const sortUpElement = documentCreateDivElement();
  sortUpElement.classList.add('css_folder_editor_folder_item_sort_control_up');
  sortUpElement.appendChild(getIconElement('keyboard_arrow_down'));
  sortUpElement.onclick = () => {
    moveItemOnFolderEditor(itemElement, folder.id, item.type, item.id, 'up');
  };

  // Sort down control
  const sortDownElement = documentCreateDivElement();
  sortDownElement.classList.add('css_folder_editor_folder_item_sort_control_down');
  sortDownElement.appendChild(getIconElement('keyboard_arrow_down'));
  sortDownElement.onclick = () => {
    moveItemOnFolderEditor(itemElement, folder.id, item.type, item.id, 'down');
  };

  // Delete control
  const deleteElement = documentCreateDivElement();
  deleteElement.classList.add('css_folder_editor_folder_item_delete');
  deleteElement.appendChild(getIconElement('delete'));
  deleteElement.onclick = () => {
    removeItemOnFolderEditor(itemElement, folder.id, item.type, item.id);
  };

  // Capsule separators
  const separator1Element = documentCreateDivElement();
  separator1Element.classList.add('css_folder_editor_folder_item_capsule_separator');
  const separator2Element = documentCreateDivElement();
  separator2Element.classList.add('css_folder_editor_folder_item_capsule_separator');

  // Assemble capsule
  capsuleElement.appendChild(sortUpElement);
  capsuleElement.appendChild(sortDownElement);
  capsuleElement.appendChild(deleteElement);
  capsuleElement.appendChild(separator1Element);
  capsuleElement.appendChild(separator2Element);

  // Assemble main item
  itemElement.appendChild(iconElement);
  itemElement.appendChild(contextElement);
  itemElement.appendChild(mainElement);
  itemElement.appendChild(capsuleElement);

  return itemElement;
}

function updateFolderEditorField(folder: Folder, content: Array<FolderContent>): void {
  FolderContentElement.innerHTML = '';
  const fragment = new DocumentFragment();
  for (const item of content) {
    const thisItemElement = generateElementOfItem(folder, item);
    fragment.appendChild(thisItemElement);
  }
  FolderContentElement.append(fragment);
}

async function initializeFolderEditorField(folderID: string, callback: Function) {
  // TODO: add skeleton screen
  const folder = getFolder(folderID);
  const content = await listFolderContent(folderID);

  if (typeof folder === 'boolean' || folder === false) return;

  LeftButtonElement.onclick = function () {
    saveEditedFolder(folder.id, callback);
  };
  NameInputElement.value = folder.name;
  IconInputElement.value = folder.icon;

  updateFolderEditorField(folder, content);
}

export function showFolderEditor(): void {
  FolderEditorField.setAttribute('displayed', 'true');
}

export function hideFolderEditor(): void {
  FolderEditorField.setAttribute('displayed', 'false');
}

export function openFolderEditor(folderID: string, callback: Function): void {
  pushPageHistory('FolderEditor');
  showFolderEditor();
  initializeFolderEditorField(folderID, callback);
  hidePreviousPage();
}

export function closeFolderEditor(): void {
  hideFolderEditor();
  showPreviousPage();
  revokePageHistory('FolderEditor');
}

export function removeItemOnFolderEditor(itemElement: HTMLElement, folderID: Folder['id'], type: FolderContent['type'], id: number): void {
  removeFromFolder(folderID, type, id).then((e) => {
    if (e) {
      itemElement.remove();
      switch (type) {
        case 'stop':
          promptMessage('delete', '已移除站牌');
          break;
        case 'route':
          promptMessage('delete', '已移除路線');
          break;
        case 'location':
          promptMessage('delete', '已移除地點');
          break;
        default:
          break;
      }
    } else {
      promptMessage('error', '無法移除');
    }
  });
}

export function moveItemOnFolderEditor(itemElement: HTMLElement, folderID: Folder['id'], type: FolderContent['type'], id: FolderContent['id'], direction: 'up' | 'down'): void {
  updateFolderContentIndex(folderID, type, id, direction).then((e) => {
    if (e) {
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
  });
}

export async function saveEditedFolder(folderID: string, callback: Function) {
  const name = NameInputElement.value;
  const icon = IconInputElement.value;
  const update = await updateFolder(folderID, name, icon);
  if (update) {
    closeFolderEditor();
    promptMessage('check_circle', '已儲存變更');
    if (typeof callback === 'function') {
      callback();
    }
  } else {
    promptMessage('error', '無法儲存');
  }
}
