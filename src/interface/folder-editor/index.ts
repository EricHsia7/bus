import { Folder, FolderContent, getFolder, listFolderContent, removeFromFolder, updateFolder, updateFolderContentIndex } from '../../data/folder/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { generateIdentifier } from '../../tools/index';
import { openFolderIconSelector } from '../folder-icon-selector/index';
import { getIconElement } from '../icons/index';
import { MaterialSymbols } from '../icons/material-symbols-type';
import { closePreviousPage, GeneratedElement, openPreviousPage, pushPageHistory } from '../index';
import { promptMessage } from '../prompt/index';

const FolderEditorField = documentQuerySelector('.css_folder_editor_field');
const FolderEditorHeadElement = elementQuerySelector(FolderEditorField, '.css_folder_editor_head');
const LeftButtonElement = elementQuerySelector(FolderEditorHeadElement, '.css_folder_editor_button_left');
const FolderEditorBodyElement = elementQuerySelector(FolderEditorField, '.css_folder_editor_body');
const FolderEditorGroupsElement = elementQuerySelector(FolderEditorBodyElement, '.css_folder_editor_groups');
const NameInputElement = elementQuerySelector(FolderEditorGroupsElement, '.css_folder_editor_group[group="folder-name"] .css_folder_editor_group_body input') as HTMLInputElement;
const IconInputElement = elementQuerySelector(FolderEditorGroupsElement, '.css_folder_editor_group[group="folder-icon"] .css_folder_editor_group_body .css_folder_editor_icon_input input') as HTMLInputElement;
const OpenFolderIconSelectorElement = elementQuerySelector(FolderEditorGroupsElement, '.css_folder_editor_group[group="folder-icon"] .css_folder_editor_group_body .css_folder_editor_icon_input .css_folder_editor_open_folder_icon_selector');
const FolderContentElement = elementQuerySelector(FolderEditorGroupsElement, '.css_folder_editor_group[group="folder-content"] .css_folder_editor_group_body');

OpenFolderIconSelectorElement.onclick = function () {
  openFolderIconSelector('editor');
};

function generateElementOfItem(folder: Folder, item: FolderContent): GeneratedElement {
  const identifier = generateIdentifier();

  // Main container
  const itemElement = document.createElement('div');
  itemElement.id = identifier;
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
  const iconElement = document.createElement('div');
  iconElement.classList.add('css_folder_editor_folder_item_icon');
  iconElement.appendChild(getIconElement(icon));

  // Context element
  const contextElement = document.createElement('div');
  contextElement.classList.add('css_folder_editor_folder_item_context');
  contextElement.appendChild(document.createTextNode(context));

  // Main element
  const mainElement = document.createElement('div');
  mainElement.classList.add('css_folder_editor_folder_item_main');
  mainElement.appendChild(document.createTextNode(main));

  // Capsule element
  const capsuleElement = document.createElement('div');
  capsuleElement.classList.add('css_folder_editor_folder_item_capsule');

  // Sort up control
  const sortUpElement = document.createElement('div');
  sortUpElement.classList.add('css_folder_editor_folder_item_sort_control_up');
  sortUpElement.appendChild(getIconElement('keyboard_arrow_down'));
  sortUpElement.onclick = () => {
    moveItemOnFolderEditor(identifier, folder.id, item.type, item.id, 'up');
  };

  // Sort down control
  const sortDownElement = document.createElement('div');
  sortDownElement.classList.add('css_folder_editor_folder_item_sort_control_down');
  sortDownElement.appendChild(getIconElement('keyboard_arrow_down'));
  sortDownElement.onclick = () => {
    moveItemOnFolderEditor(identifier, folder.id, item.type, item.id, 'down');
  };

  // Delete control
  const deleteElement = document.createElement('div');
  deleteElement.classList.add('css_folder_editor_folder_item_delete');
  deleteElement.appendChild(getIconElement('delete'));
  deleteElement.onclick = () => {
    removeItemOnFolderEditor(identifier, folder.id, item.type, item.id);
  };

  // Capsule separators
  const separator1Element = document.createElement('div');
  separator1Element.classList.add('css_folder_editor_folder_item_capsule_separator');
  const separator2Element = document.createElement('div');
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

  return {
    element: itemElement,
    id: identifier
  };
}

function updateFolderEditorField(folder: Folder, content: Array<FolderContent>): void {
  NameInputElement.value = folder.name;
  IconInputElement.value = folder.icon;

  LeftButtonElement.onclick = function () {
    saveEditedFolder(folder.id);
  };

  FolderContentElement.innerHTML = '';
  const fragment = new DocumentFragment();
  for (const item of content) {
    const thisItemElement = generateElementOfItem(folder, item);
    fragment.appendChild(thisItemElement.element);
  }
  FolderContentElement.append(fragment);
}

async function initializeFolderEditorField(folderID: string) {
  // TODO: add skeleton screen
  const folder = getFolder(folderID);
  const content = await listFolderContent(folderID);
  updateFolderEditorField(folder, content);
}

export function openFolderEditor(folderID: string): void {
  pushPageHistory('FolderEditor');
  FolderEditorField.setAttribute('displayed', 'true');
  initializeFolderEditorField(folderID);
  closePreviousPage();
}

export function closeFolderEditor(): void {
  // revokePageHistory('FolderEditor');
  FolderEditorField.setAttribute('displayed', 'false');
  openPreviousPage();
}

export function removeItemOnFolderEditor(itemID: string, folderID: Folder['id'], type: FolderContent['type'], id: number): void {
  const itemElement = elementQuerySelector(FolderEditorField, `.css_folder_editor_body .css_folder_editor_groups .css_folder_editor_group[group="folder-content"] .css_folder_editor_group_body .css_folder_editor_folder_item#${itemID}`);
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

export function moveItemOnFolderEditor(itemID: string, folderID: Folder['id'], type: FolderContent['type'], id: FolderContent['id'], direction: 'up' | 'down'): void {
  const itemElement = elementQuerySelector(FolderEditorField, `.css_folder_editor_body .css_folder_editor_groups .css_folder_editor_group[group="folder-content"] .css_folder_editor_group_body .css_folder_editor_folder_item#${itemID}`);
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

export function saveEditedFolder(folderID: string): void {
  const name = NameInputElement.value;
  const icon = IconInputElement.value;
  updateFolder(folderID, name, icon).then(function () {
    closeFolderEditor();
  });
}
