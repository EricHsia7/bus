import { FoldersWithContent, listFoldersWithContent } from '../../data/folder/index';
import { generateIdentifier } from '../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { getIconHTML } from '../icons/index';
import { GeneratedElement, pushPageHistory, revokePageHistory } from '../index';

function generateElementOfItem(item: FoldersWithContent): GeneratedElement {
  var identifier = generateIdentifier('i');
  var element = document.createElement('div');
  element.classList.add('css_folder_manager_folder_item');
  element.id = identifier;
  element.setAttribute('onclick', `bus.folder.openFolderEditor('${item.folder.id}')`);
  element.innerHTML = `<div class="css_folder_manager_folder_item_icon">${getIconHTML(item.folder.icon)}</div><div class="css_folder_manager_folder_item_name">${item.folder.name}</div><div class="css_folder_manager_folder_item_status">${item.contentLength}</div><div class="css_folder_manager_folder_item_arrow">${getIconHTML('arrow_forward_ios')}</div>`;
  return {
    element: element,
    id: identifier
  };
}

async function initializeFolderManagerField(): void {
  var Field = documentQuerySelector('.css_folder_manager_field');
  var ListElement = elementQuerySelector(Field, '.css_folder_manager_body .css_folder_manager_folder_list');
  ListElement.innerHTML = '';
  var foldersWithContent = await listFoldersWithContent();
  for (var item of foldersWithContent) {
    var thisElement = generateElementOfItem(item);
    ListElement.appendChild(thisElement.element);
  }
}

export function openFolderManager(): void {
  pushPageHistory('FolderManager');
  var Field = documentQuerySelector('.css_folder_manager_field');
  Field.setAttribute('displayed', 'true');
  initializeFolderManagerField();
}

export function closeFolderManager(): void {
  revokePageHistory('FolderManager');
  var Field = documentQuerySelector('.css_folder_manager_field');
  Field.setAttribute('displayed', 'false');
}
