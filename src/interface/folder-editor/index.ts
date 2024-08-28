import { Folder, FolderContent, FolderContentType, getFolder, listFolderContent, removeFromFolder, updateFolder, updateFolderContentIndex } from '../../data/folder/index';
import { generateIdentifier } from '../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { GeneratedElement } from '../index';
import { getIconHTML } from '../icons/index';
import { promptMessage } from '../prompt/index';

function generateElementOfItem(folder: Folder, item: FolderContent): GeneratedElement {
  var identifier = `i_${generateIdentifier()}`;
  var element = document.createElement('div');
  element.id = identifier;
  element.classList.add('css_folder_editor_folder_item');
  element.setAttribute('type', item.type);
  var context = '';
  var main = '';
  var icon = '';
  switch (item.type) {
    case 'stop':
      icon = 'location_on';
      context = `${item.route ? item.route.name : ''} - 往${item.route ? [item.route.endPoints.destination, item.route.endPoints.departure, ''][item.direction ? item.direction : 0] : ''}`;
      main = item.name;
      break;
    case 'route':
      icon = 'route';
      context = `${item.endPoints.departure} \u21CC ${item.endPoints.destination}`;
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
  element.innerHTML = `<div class="css_folder_editor_folder_item_icon">${getIconHTML(icon)}</div><div class="css_folder_editor_folder_item_context">${context}</div><div class="css_folder_editor_folder_item_main">${main}</div><div class="css_folder_editor_folder_item_capsule"><div class="css_folder_editor_folder_item_sort_control_up" onclick="bus.folder.moveItemOnFolderEditor('${identifier}', '${folder.id}', '${item.type}', ${item.id}, 'up')">${getIconHTML('keyboard_arrow_down')}</div><div class="css_folder_editor_folder_item_capsule_separator"></div><div class="css_folder_editor_folder_item_sort_control_down" onclick="bus.folder.moveItemOnFolderEditor('${identifier}', '${folder.id}', '${item.type}', ${item.id}, 'down')">${getIconHTML('keyboard_arrow_down')}</div><div class="css_folder_editor_folder_item_capsule_separator"></div><div class="css_folder_editor_folder_item_delete" onclick="bus.folder.removeItemOnFolderEditor('${identifier}', '${folder.id}', '${item.type}', ${item.id})">${getIconHTML('delete')}</div></div>`;
  return {
    element: element,
    id: identifier
  };
}

function updateFolderEditorField(folder: Folder, content: Array<FolderContent>): void {
  const Field = documentQuerySelector('.css_folder_editor_field');
  const nameInputElement = elementQuerySelector(Field, '.css_folder_editor_body .css_folder_editor_groups .css_folder_editor_group[group="folder-name"] .css_folder_editor_group_body input');
  const iconInputElement = elementQuerySelector(Field, '.css_folder_editor_body .css_folder_editor_groups .css_folder_editor_group[group="folder-icon"] .css_folder_editor_group_body .css_folder_editor_icon_input input');
  const openFolderIconSelectorElement = elementQuerySelector(Field, '.css_folder_editor_body .css_folder_editor_groups .css_folder_editor_group[group="folder-icon"] .css_folder_editor_group_body .css_folder_editor_icon_input .css_folder_editor_open_folder_icon_selector');
  const leftButtonElement = elementQuerySelector(Field, '.css_folder_editor_head .css_folder_editor_button_left');

  nameInputElement.value = folder.name;
  iconInputElement.value = folder.icon;

  if (folder.default) {
    nameInputElement.setAttribute('readonly', 'readonly');
    iconInputElement.setAttribute('readonly', 'readonly');
    openFolderIconSelectorElement.setAttribute('disabled', 'true');
  } else {
    nameInputElement.removeAttribute('readonly');
    iconInputElement.removeAttribute('readonly');
    openFolderIconSelectorElement.setAttribute('disabled', 'false');
  }

  leftButtonElement.setAttribute('onclick', `bus.folder.saveEditedFolder('${folder.id}')`);

  const folderContentElement = elementQuerySelector(Field, '.css_folder_editor_body .css_folder_editor_groups .css_folder_editor_group[group="folder-content"] .css_folder_editor_group_body');
  folderContentElement.innerHTML = '';
  for (var item of content) {
    var thisItemElement = generateElementOfItem(folder, item);
    folderContentElement.appendChild(thisItemElement.element);
  }
}

async function initializeFolderEditorField(folderID: string): void {
  //TODO: add skeleton screen
  var folder = await getFolder(folderID);
  var content = await listFolderContent(folderID);
  updateFolderEditorField(folder, content);
}

export function openFolderEditor(folderID: string): void {
  const Field = documentQuerySelector('.css_folder_editor_field');
  Field.setAttribute('displayed', 'true');
  initializeFolderEditorField(folderID);
}

export function closeFolderEditor(): void {
  const Field = documentQuerySelector('.css_folder_editor_field');
  Field.setAttribute('displayed', 'false');
}

export function removeItemOnFolderEditor(itemID: string, folderID: string, type: FolderContentType, id: number): void {
  const Field = documentQuerySelector('.css_folder_editor_field');
  const itemElement = elementQuerySelector(Field, `.css_folder_editor_body .css_folder_editor_groups .css_folder_editor_group[group="folder-content"] .css_folder_editor_group_body .css_folder_editor_folder_item#${itemID}`);
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

export function moveItemOnFolderEditor(itemID: string, folderID: string, type: FolderContentType, id: number, direction: 'up' | 'down'): void {
  const Field = documentQuerySelector('.css_folder_editor_field');
  const itemElement = elementQuerySelector(Field, `.css_folder_editor_body .css_folder_editor_groups .css_folder_editor_group[group="folder-content"] .css_folder_editor_group_body .css_folder_editor_folder_item#${itemID}`);
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
  const Field = documentQuerySelector('.css_folder_editor_field');
  const nameInputElement = elementQuerySelector(Field, '.css_folder_editor_body .css_folder_editor_groups .css_folder_editor_group[group="folder-name"] .css_folder_editor_group_body input');
  const iconInputElement = elementQuerySelector(Field, '.css_folder_editor_body .css_folder_editor_groups .css_folder_editor_group[group="folder-icon"] .css_folder_editor_group_body .css_folder_editor_icon_input input');
  var thisFolder: Folder = getFolder(folderID);
  thisFolder.name = nameInputElement.value;
  thisFolder.icon = iconInputElement.value;
  updateFolder(thisFolder);
  closeFolderEditor();
}
