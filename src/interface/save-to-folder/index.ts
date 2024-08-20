import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector.ts';
import { GeneratedElement } from '../index.ts';
import { md5 } from '../../tools/index.ts';
import { listFoldersWithContent, FoldersWithContent, FolderContentType } from '../../data/folder/index';

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
  element.innerHTML = `<div class="css_save_to_folder_item_icon">${icons[item.folder.icon]}</div><div class="css_save_to_folder_item_name">${item.name}</div>`;
  return {
    element: element,
    id: identifier
  };
}

async function initializeSaveToFolderField(type: FolderContentType, parameters: []): void {
  var Field = documentQuerySelector('.css_route_field');
  elementQuerySelector(Field, '.css_save_to_folder_body .css_save_to_folder_list').innerHTML = '';
  var foldersWithContent = await listFoldersWithContent();
  for (var item of foldersWithContent) {
    var thisElement = generateElementOfItem(item, type, parameters);
    elementQuerySelector(Field, '.css_save_to_folder_body .css_save_to_folder_list').appendChild(thisElement.element);
  }
}

export function openSaveToFolder(type: FolderContentType, parameters: []): void {
  var Field = documentQuerySelector('.css_route_field');
  Field.setAttribute('displayed', 'true');
  initializeSaveToFolderField(type, parameters);
}
