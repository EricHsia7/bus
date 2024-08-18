import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector.ts';
import { GeneratedElement } from '../index.ts';
import { md5 } from '../../tools/index.ts';
import { listFoldersWithContent, FoldersWithContent } from '../../data/folder/index';

function generateElementOfItem(item: FoldersWithContent): GeneratedElement {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('css_save_to_folder_list_item');
  element.id = identifier;
  element.setAttribute('onclick', `bus.folder.saveToFolder()`); // TODO: set up folder id and content
  element.innerHTML = `<div class="css_save_to_folder_item_icon">${icons[item.folder.icon]}</div><div class="css_save_to_folder_item_name">${item.name}</div>`;
  return {
    element: element,
    id: identifier
  };
}

async function initializeSaveToFolderField(): void {
  var Field = documentQuerySelector('.css_route_field');
  elementQuerySelector(Field, '.css_save_to_folder_body .css_save_to_folder_list').innerHTML = '';
  var foldersWithContent = await listFoldersWithContent();
  for (var item of foldersWithContent) {
    var thisElement = generateElementOfItem(item);
    elementQuerySelector(Field, '.css_save_to_folder_body .css_save_to_folder_list').appendChild(thisElement.element);
  }
}

export function openSaveToFolder(): void {
  var Field = documentQuerySelector('.css_route_field');
  Field.setAttribute('displayed', 'true');
  initializeSaveToFolderField();
}
