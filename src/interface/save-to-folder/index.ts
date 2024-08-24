import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector.ts';
import { GeneratedElement } from '../index.ts';
import { generateIdentifier } from '../../tools/index.ts';
import { listFoldersWithContent, FoldersWithContent, FolderContentType, saveStop, isSaved } from '../../data/folder/index.ts';
import { getIconHTML } from '../icons/index.ts';
import { prompt_message } from '../prompt/index.ts';

function generateElementOfItem(item: FoldersWithContent, type: FolderContentType, parameters: []): GeneratedElement {
  var identifier = `i_${generateIdentifier()}`;
  var element = document.createElement('div');
  element.classList.add('css_save_to_folder_list_item');
  element.id = identifier;
  switch (type) {
    case 'stop':
      element.setAttribute('onclick', `bus.folder.saveStopItemOnRoute('${parameters[2]}', '${item.folder.id}', ${parameters[0]}, ${parameters[1]})`); // TODO: set up folder id and content
      break;
    case 'route':
      break;
    case 'bus':
      break;
    default:
      break;
  }
  element.innerHTML = `<div class="css_save_to_folder_item_icon">${getIconHTML(item.folder.icon)}</div><div class="css_save_to_folder_item_name">${item.folder.name}</div>`;
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

export function closeSaveToFolder(): void {
  var Field = documentQuerySelector('.css_save_to_folder_field');
  Field.setAttribute('displayed', 'false');
}

export function saveStopItemOnRoute(itemID: string, folderID: string, StopID: number, RouteID: number) {
  var itemElement = documentQuerySelector(`.css_route_field .css_route_groups .css_item#${itemID}`);
  var actionButtonElement = elementQuerySelector(itemElement, '.css_action_button[type="save-to-folder"]');
  saveStop(folderID, StopID, RouteID).then((e) => {
    if (e) {
      isSaved('stop', StopID).then((k) => {
        actionButtonElement.setAttribute('highlighted', k);
        prompt_message('已儲存至資料夾');
        closeSaveToFolder();
      });
    } else {
      prompt_message('此資料夾不支援站牌類型項目');
    }
  });
}
