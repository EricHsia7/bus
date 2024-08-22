import { Folder, FolderContent, getFolder, listFolderContent, removeStop } from '../../data/folder/index.ts';
import { generateIdentifier } from '../../tools/index.ts';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector.ts';
import { GeneratedElement } from '../index.ts';
import { icons } from '../icons/index.ts';
import { prompt_message } from '../prompt/index.js';

function generateElementOfItem(folder: Folder, item: FolderContent): GeneratedElement {
  var identifier = `i_${generateIdentifier()}`;
  var element = document.createElement('div');
  element.id = identifier;
  switch (item.type) {
    case 'stop':
      element.classList.add('css_folder_editor_folder_content_stop_item');
      element.innerHTML = `<div class="css_folder_editor_folder_content_stop_item_route">${item.route ? item.route.name : ''} - 往${item.route ? [item.route.endPoints.destination, item.route.endPoints.departure, ''][item.direction ? item.direction : 0] : ''}</div><div class="css_folder_editor_folder_content_stop_item_name">${item.name}</div><div class="css_folder_editor_folder_content_stop_item_capsule"><div class="css_folder_editor_folder_content_stop_item_sort_control_up">${icons.expand}</div><div class="css_folder_editor_folder_content_stop_item_sort_control_down">${icons.expand}</div><div class="css_folder_editor_folder_content_stop_item_delete" onclick="bus.folder.removeStopItemOnFolderEditor('${identifier}', '${folder.id}', ${item.id})">${icons.delete}</div></div>`;
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

export function removeStopItemOnFolderEditor(itemID: string, folderID: string, StopID: number): void {
  const Field = documentQuerySelector('.css_folder_editor_field');
  var itemElement = elementQuerySelector(Field, `.css_folder_editor_body .css_folder_editor_groups .css_folder_editor_group[group="folder-content"] .css_folder_editor_group_body .css_folder_editor_folder_content_stop_item#${itemID}`);
  removeStop(folderID, StopID).then((e) => {
    if (e) {
      itemElement.remove();
      prompt_message('已移除站牌');
    } else {
      prompt_message('無法移除站牌');
    }
  });
}
