import { FoldersWithContent, listFoldersWithContent } from '../../data/folder/index.ts';
import { md5 } from '../../tools/index.ts';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector.ts';
import { icons } from '../icons/index.ts';
import { GeneratedElement } from '../index.ts';

function generateElementOfItem(item: FoldersWithContent): GeneratedElement {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('css_folder_manager_folder_item');
  element.id = identifier;
  element.innerHTML = `<div class="css_folder_manager_folder_item_icon">${icons.getIconHTML(item.folder.icon)}</div><div class="css_folder_manager_folder_item_name">${item.folder.name}</div><div class="css_folder_manager_folder_item_arrow">${icons.arrow}</div>`;
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
  var Field = documentQuerySelector('.css_folder_manager_field');
  Field.setAttribute('displayed', 'true');
  initializeFolderManagerField();
}

export function closeFolderManager(): void {
  var Field = documentQuerySelector('.css_folder_manager_field');
  Field.setAttribute('displayed', 'false');
}
