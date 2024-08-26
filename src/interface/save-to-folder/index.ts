import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { GeneratedElement } from '../index';
import { generateIdentifier } from '../../tools/index';
import { listFoldersWithContent, FoldersWithContent, FolderContentType, saveStop, isSaved, saveRoute } from '../../data/folder/index';
import { getIconHTML } from '../icons/index';
import { prompt_message } from '../prompt/index';

function generateElementOfItem(item: FoldersWithContent, type: FolderContentType, parameters: []): GeneratedElement {
  var identifier = `i_${generateIdentifier()}`;
  var element = document.createElement('div');
  element.classList.add('css_save_to_folder_list_item');
  element.id = identifier;
  switch (type) {
    case 'stop':
      element.setAttribute('onclick', `bus.folder.saveStopItemOnRoute('${parameters[0]}', '${item.folder.id}', ${parameters[1]}, ${parameters[2]})`);
      break;
    case 'route':
      element.setAttribute('onclick', `bus.folder.saveRouteOnDetailsPage('${item.folder.id}', ${parameters[0]})`);
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

export function saveStopItemOnRoute(itemElementID: string, folderID: string, StopID: number, RouteID: number): void {
  var itemElement = documentQuerySelector(`.css_route_field .css_route_groups .css_item#${itemElementID}`);
  var actionButtonElement = elementQuerySelector(itemElement, '.css_action_button[type="save-to-folder"]');
  saveStop(folderID, StopID, RouteID).then((e) => {
    if (e) {
      isSaved('stop', StopID).then((k) => {
        if (k) {
          actionButtonElement.setAttribute('highlighted', k);
          prompt_message('已儲存至資料夾');
          closeSaveToFolder();
        }
      });
    } else {
      prompt_message('此資料夾不支援站牌類型項目');
    }
  });
}

export function saveRouteOnDetailsPage(folderID: string, RouteID: number): void {
  saveRoute(folderID, RouteID).then((e) => {
    if (e) {
      isSaved('route', RouteID).then((k) => {
        if (k) {
          prompt_message('已儲存至資料夾');
        }
      });
    } else {
      prompt_message('此資料夾不支援路線類型項目');
    }
  });
}
