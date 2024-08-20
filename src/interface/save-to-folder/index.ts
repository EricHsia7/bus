import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector.ts';
import { GeneratedElement } from '../index.ts';
import { md5 } from '../../tools/index.ts';
import { listFoldersWithContent, FoldersWithContent, FolderContentType } from '../../data/folder/index';
import { icons } from '../icons/index.ts';

function generateElementOfItem(item: FoldersWithContent, type: FolderContentType, parameters: []): GeneratedElement {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('css_save_to_folder_list_item');
  element.id = identifier;
  switch (type) {
    case 'stop':
      element.setAttribute('onclick', `bus.route.saveItemAsStop('${parameters[2]}', '${item.folder.id}', ${parameters[0]}, ${parameters[1]})`); // TODO: set up folder id and content
      break;
    case 'route':
      break;
    case 'bus':
      break;
    default:
      break;
  }
  var iconHTML = '';
  if (item.folder.icon.source === 'icons') {
    iconHTML = icons[item.folder.icon.id];
  }
  if (item.folder.icon.source === 'svg') {
    iconHTML = item.folder.icon.content;
  }
  element.innerHTML = `<div class="css_save_to_folder_item_icon">${iconHTML}</div><div class="css_save_to_folder_item_name">${item.folder.name}</div>`;
  return {
    element: element,
    id: identifier
  };
}

async function initializeSaveToFolderField(type: FolderContentType, parameters: []): void {
  var Field = documentQuerySelector('.css_save_to_folder_field');
  elementQuerySelector(Field, '.css_save_to_folder_body .css_save_to_folder_list').innerHTML = '';
  var foldersWithContent = await listFoldersWithContent();
  for (var item of foldersWithContent) {
    var thisElement = generateElementOfItem(item, type, parameters);
    elementQuerySelector(Field, '.css_save_to_folder_body .css_save_to_folder_list').appendChild(thisElement.element);
  }
}

export function openSaveToFolder(type: FolderContentType, parameters: []): void {
  var Field = documentQuerySelector('.css_save_to_folder_field');
  Field.setAttribute('displayed', 'true');
  initializeSaveToFolderField(type, parameters);
}
