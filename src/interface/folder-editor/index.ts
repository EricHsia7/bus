import { Folder, FolderContent, FolderContentType, getFolder, listFolderContent, removeFromFolder, updateFolderContentIndex } from '../../data/folder/index.ts';
import { generateIdentifier } from '../../tools/index.ts';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector.ts';
import { GeneratedElement } from '../index.ts';
import { icons } from '../icons/index.ts';
import { prompt_message } from '../prompt/index.ts';

function generateElementOfItem(folder: Folder, item: FolderContent): GeneratedElement {
  var identifier = `i_${generateIdentifier()}`;
  var element = document.createElement('div');
  element.id = identifier;
  switch (item.type) {
    case 'stop':
      element.classList.add('css_folder_editor_folder_content_stop_item');
      element.innerHTML = `<div class="css_folder_editor_folder_content_stop_item_route">${item.route ? item.route.name : ''} - 往${item.route ? [item.route.endPoints.destination, item.route.endPoints.departure, ''][item.direction ? item.direction : 0] : ''}</div><div class="css_folder_editor_folder_content_stop_item_name">${item.name}</div><div class="css_folder_editor_folder_content_stop_item_capsule"><div class="css_folder_editor_folder_content_stop_item_sort_control_up" onclick="bus.folder.moveItemOnFolderEditor('${identifier}', '${folder.id}', '${item.type}', ${item.id}, 'up')">${icons.expand}</div><div class="css_folder_editor_folder_content_stop_item_sort_control_down" onclick="bus.folder.moveItemOnFolderEditor('${identifier}', '${folder.id}', '${item.type}', ${item.id}, 'down')">${icons.expand}</div><div class="css_folder_editor_folder_content_stop_item_delete" onclick="bus.folder.removeItemOnFolderEditor('${identifier}', '${folder.id}', '${item.type}', ${item.id})">${icons.delete}</div></div>`;
      break;
    default:
      element.innerHTML = '';
      break;
  }
  return {
    element: element,
    id: identifier
  };
}

function updateFolderEditorField(folder: Folder, content: FolderContent[]): void {
  const Field = documentQuerySelector('.css_folder_editor_field');
  const nameInputElement = elementQuerySelector(Field, '.css_folder_editor_body .css_folder_editor_groups .css_folder_editor_group[group="folder-name"] .css_folder_editor_group_body input');
  nameInputElement.value = folder.name;
  //const iconSelectElement;
  //const iconInputElement;
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
  var className = '';
  switch (type) {
    case 'stop':
      className = 'css_folder_editor_folder_content_stop_item';
      break;
    default:
      className = '';
      break;
  }
  var itemElement = elementQuerySelector(Field, `.css_folder_editor_body .css_folder_editor_groups .css_folder_editor_group[group="folder-content"] .css_folder_editor_group_body .${className}#${itemID}`);
  removeFromFolder(folderID, type, id).then((e) => {
    if (e) {
      itemElement.remove();
      switch (type) {
        case 'stop':
          prompt_message('已移除站牌');
          break;
        default:
          break;
      }
    } else {
      prompt_message('無法移除站牌');
    }
  });
}

export function moveItemOnFolderEditor(itemID: string, folderID: string, type: FolderContentType, id: number, direction: 'up' | 'down'): void {
  const Field = documentQuerySelector('.css_folder_editor_field');
  var className = '';
  switch (type) {
    case 'stop':
      className = 'css_folder_editor_folder_content_stop_item';
      break;
    default:
      className = '';
      break;
  }
  const itemElement = elementQuerySelector(Field, `.css_folder_editor_body .css_folder_editor_groups .css_folder_editor_group[group="folder-content"] .css_folder_editor_group_body .${className}#${itemID}`);
  updateFolderContentIndex(folderID, type, id, direction).then((e) => {
    if (e) {
      switch (direction) {
        case 'up':
          const previousSibling = itemElement.previousElementSibling;
          if (previousSibling) {
            itemElement.parentNode.insertBefore(itemElement, previousSibling);
          }
          prompt_message('已往上移');
          break;
        case 'down':
          const nextSibling = itemElement.nextElementSibling;
          if (nextSibling) {
            itemElement.parentNode.insertBefore(nextSibling, itemElement);
          }
          prompt_message('已往下移');
          break;
        default:
          break;
      }
    } else {
      prompt_message('無法移動');
    }
  });
}
