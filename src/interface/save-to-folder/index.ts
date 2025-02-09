import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { GeneratedElement, pushPageHistory, revokePageHistory } from '../index';
import { booleanToString } from '../../tools/index';
import { listFoldersWithContent, FolderWithContent, saveStop, isFolderContentSaved, saveRoute } from '../../data/folder/index';
import { getIconHTML } from '../icons/index';
import { promptMessage } from '../prompt/index';

type SaveToFolderType = 'stop-on-route' | 'stop-on-location' | 'route' | 'bus';

const SaveToFolderField = documentQuerySelector('.css_save_to_folder_field');
const SaveToFolderBodyElement = elementQuerySelector(SaveToFolderField, '.css_save_to_folder_body');
const SaveToFolderListElement = elementQuerySelector(SaveToFolderBodyElement, '.css_save_to_folder_list');

function generateElementOfItem(item: FolderWithContent, type: SaveToFolderType, parameters: Array<any>): GeneratedElement {
  // const identifier = generateIdentifier('i');
  const element = document.createElement('div');
  element.classList.add('css_save_to_folder_list_item');
  // element.id = identifier;
  switch (type) {
    case 'stop-on-route':
      element.setAttribute('onclick', `bus.folder.saveStopItemOnRoute('${parameters[0]}', '${item.id}', ${parameters[1]}, ${parameters[2]})`);
      break;
    case 'stop-on-location':
      element.setAttribute('onclick', `bus.folder.saveStopItemOnLocation('${parameters[0]}', '${item.id}', ${parameters[1]}, ${parameters[2]})`);
      break;
    case 'route':
      element.setAttribute('onclick', `bus.folder.saveRouteOnDetailsPage('${item.id}', ${parameters[0]})`);
      break;
    case 'route-on-route':
      element.setAttribute('onclick', `bus.folder.saveRouteOnRoute('${item.id}', ${parameters[0]})`);
      break;
    case 'bus':
      break;
    default:
      break;
  }
  element.innerHTML = /*html*/ `<div class="css_save_to_folder_item_icon">${getIconHTML(item.icon)}</div><div class="css_save_to_folder_item_name">${item.name}</div>`;
  return {
    element: element,
    id: ''
  };
}

async function initializeSaveToFolderField(type: SaveToFolderType, parameters: Array<any>) {
  SaveToFolderListElement.innerHTML = '';
  const foldersWithContent = await listFoldersWithContent();
  for (const item of foldersWithContent) {
    const newItemElement = generateElementOfItem(item, type, parameters);
    SaveToFolderListElement.appendChild(newItemElement.element);
  }
}

export function openSaveToFolder(type: SaveToFolderType, parameters: Array<any>): void {
  pushPageHistory('SaveToFolder');
  SaveToFolderField.setAttribute('displayed', 'true');
  initializeSaveToFolderField(type, parameters);
}

export function closeSaveToFolder(): void {
  revokePageHistory('SaveToFolder');
  SaveToFolderField.setAttribute('displayed', 'false');
}

export function saveStopItemOnRoute(itemElementID: string, folderID: string, StopID: number, RouteID: number): void {
  const itemElement = documentQuerySelector(`.css_route_field .css_route_groups .css_route_group .css_route_group_tracks .css_route_group_items_track .css_route_group_item#${itemElementID}`);
  const saveToFolderButtonElement = elementQuerySelector(itemElement, '.css_route_group_item_body .css_route_group_item_buttons .css_route_group_item_button[type="save-to-folder"]');
  saveStop(folderID, StopID, RouteID).then((e) => {
    if (e) {
      isFolderContentSaved('stop', StopID).then((k) => {
        if (k) {
          saveToFolderButtonElement.setAttribute('highlighted', booleanToString(k));
          promptMessage('已儲存至資料夾', 'folder');
          closeSaveToFolder();
        }
      });
    } else {
      promptMessage('無法儲存', 'warning');
    }
  });
}

export function saveStopItemOnLocation(itemElementID: string, folderID: string, StopID: number, RouteID: number): void {
  const itemElement = documentQuerySelector(`.css_location_field .css_location_groups .css_location_group .css_location_group_items .css_location_group_item#${itemElementID}`);
  const saveToFolderButtonElement = elementQuerySelector(itemElement, '.css_location_group_item_body .css_location_group_item_buttons .css_location_group_item_button[type="save-to-folder"]');
  saveStop(folderID, StopID, RouteID).then((e) => {
    if (e) {
      isFolderContentSaved('stop', StopID).then((k) => {
        if (k) {
          saveToFolderButtonElement.setAttribute('highlighted', booleanToString(k));
          promptMessage('已儲存至資料夾', 'folder');
          closeSaveToFolder();
        }
      });
    } else {
      promptMessage('無法儲存', 'warning');
    }
  });
}

export function saveRouteOnDetailsPage(folderID: string, RouteID: number): void {
  const actionButtonElement = documentQuerySelector('.css_route_details_field .css_route_details_body .css_route_details_groups .css_route_details_group[group="actions"] .css_route_details_group_body .css_route_details_action_button[action="save-to-folder"]');
  saveRoute(folderID, RouteID).then((e) => {
    if (e) {
      isFolderContentSaved('route', RouteID).then((k) => {
        if (k) {
          actionButtonElement.setAttribute('highlighted', 'true');
          promptMessage('已儲存至資料夾', 'folder');
          closeSaveToFolder();
        }
      });
    } else {
      promptMessage('無法儲存', 'warning');
    }
  });
}

export function saveRouteOnRoute(folderID: string, RouteID: number): void {
  saveRoute(folderID, RouteID).then((e) => {
    if (e) {
      isFolderContentSaved('route', RouteID).then((k) => {
        if (k) {
          promptMessage('已儲存至資料夾', 'folder');
          closeSaveToFolder();
        }
      });
    } else {
      promptMessage('無法儲存', 'warning');
    }
  });
}
