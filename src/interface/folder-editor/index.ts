import { Folder, FolderContent, getFolder, listFolderContent, removeFromFolder, updateFolder, updateFolderContentIndex } from '../../data/folder/index';
import { generateIdentifier } from '../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { closePreviousPage, GeneratedElement, openPreviousPage, pushPageHistory } from '../index';
import { getIconHTML } from '../icons/index';
import { promptMessage } from '../prompt/index';

const FolderEditorField = documentQuerySelector('.css_folder_editor_field');
const FolderEditorHeadElement = elementQuerySelector(FolderEditorField, '.css_folder_editor_head');
const LeftButtonElement = elementQuerySelector(FolderEditorHeadElement, '.css_folder_editor_button_left');
const FolderEditorBodyElement = elementQuerySelector(FolderEditorField, '.css_folder_editor_body');
const FolderEditorGroupsElement = elementQuerySelector(FolderEditorBodyElement, '.css_folder_editor_groups');
const NameInputElement = elementQuerySelector(FolderEditorGroupsElement, '.css_folder_editor_group[group="folder-name"] .css_folder_editor_group_body input');
const IconInputElement = elementQuerySelector(FolderEditorGroupsElement, '.css_folder_editor_group[group="folder-icon"] .css_folder_editor_group_body .css_folder_editor_icon_input input');
const OpenFolderIconSelectorElement = elementQuerySelector(FolderEditorGroupsElement, '.css_folder_editor_group[group="folder-icon"] .css_folder_editor_group_body .css_folder_editor_icon_input .css_folder_editor_open_folder_icon_selector');
const FolderContentElement = elementQuerySelector(FolderEditorGroupsElement, '.css_folder_editor_group[group="folder-content"] .css_folder_editor_group_body');

function generateElementOfItem(folder: Folder, item: FolderContent): GeneratedElement {
  const identifier = generateIdentifier('i');
  let element = document.createElement('div');
  element.id = identifier;
  element.classList.add('css_folder_editor_folder_item');
  element.setAttribute('type', item.type);
  let context = '';
  let main = '';
  let icon = '';
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
  element.innerHTML = /*html*/ `<div class="css_folder_editor_folder_item_icon">${getIconHTML(icon)}</div><div class="css_folder_editor_folder_item_context">${context}</div><div class="css_folder_editor_folder_item_main">${main}</div><div class="css_folder_editor_folder_item_capsule"><div class="css_folder_editor_folder_item_sort_control_up" onclick="bus.folder.moveItemOnFolderEditor('${identifier}', '${folder.id}', '${item.type}', ${item.id}, 'up')">${getIconHTML('keyboard_arrow_down')}</div><div class="css_folder_editor_folder_item_sort_control_down" onclick="bus.folder.moveItemOnFolderEditor('${identifier}', '${folder.id}', '${item.type}', ${item.id}, 'down')">${getIconHTML('keyboard_arrow_down')}</div><div class="css_folder_editor_folder_item_delete" onclick="bus.folder.removeItemOnFolderEditor('${identifier}', '${folder.id}', '${item.type}', ${item.id})">${getIconHTML('delete')}</div><div class="css_folder_editor_folder_item_capsule_separator"></div><div class="css_folder_editor_folder_item_capsule_separator"></div></div>`;
  return {
    element: element,
    id: identifier
  };
}

function updateFolderEditorField(folder: Folder, content: Array<FolderContent>): void {
  NameInputElement.value = folder.name;
  IconInputElement.value = folder.icon;

  if (folder.default) {
    NameInputElement.setAttribute('readonly', 'readonly');
    IconInputElement.setAttribute('readonly', 'readonly');
    OpenFolderIconSelectorElement.setAttribute('disabled', 'true');
  } else {
    NameInputElement.removeAttribute('readonly');
    IconInputElement.removeAttribute('readonly');
    OpenFolderIconSelectorElement.setAttribute('disabled', 'false');
  }

  LeftButtonElement.setAttribute('onclick', `bus.folder.saveEditedFolder('${folder.id}')`);

  FolderContentElement.innerHTML = '';
  for (var item of content) {
    var thisItemElement = generateElementOfItem(folder, item);
    FolderContentElement.appendChild(thisItemElement.element);
  }
}

async function initializeFolderEditorField(folderID: string) {
  //TODO: add skeleton screen
  var folder = await getFolder(folderID);
  var content = await listFolderContent(folderID);
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
          promptMessage('已移除站牌', 'delete');
          break;
        case 'route':
          promptMessage('已移除路線', 'delete');
          break;
        default:
          break;
      }
    } else {
      promptMessage('無法移除', 'error');
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
          promptMessage('已往上移', 'arrow_circle_up');
          break;
        case 'down':
          const nextSibling = itemElement.nextElementSibling;
          if (nextSibling) {
            itemElement.parentNode.insertBefore(nextSibling, itemElement);
          }
          promptMessage('已往下移', 'arrow_circle_down');
          break;
        default:
          break;
      }
    } else {
      promptMessage('無法移動', 'error');
    }
  });
}

export function saveEditedFolder(folderID: string): void {
  const name = NameInputElement.value;
  const icon = IconInputElement.value;
  updateFolder(folderID, name, icon);
  closeFolderEditor();
}
