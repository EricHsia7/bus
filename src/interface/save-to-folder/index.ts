import { FolderWithContent, isFolderContentSaved, listFoldersWithContent, saveLocation, saveRoute, saveStop } from '../../data/folder/index';
import { booleanToString } from '../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { getIconHTML } from '../icons/index';
import { GeneratedElement, pushPageHistory, revokePageHistory } from '../index';
import { promptMessage } from '../prompt/index';

type SaveToFolderType = 'stop-on-route' | 'stop-on-location' | 'route' | 'route-on-route' | 'bus' | 'location';

const SaveToFolderField = documentQuerySelector('.css_save_to_folder_field');
const SaveToFolderBodyElement = elementQuerySelector(SaveToFolderField, '.css_save_to_folder_body');
const SaveToFolderListElement = elementQuerySelector(SaveToFolderBodyElement, '.css_save_to_folder_list');

function generateElementOfItem(item: FolderWithContent, type: SaveToFolderType, parameters: Array<any>): GeneratedElement {
  const itemElement = document.createElement('div');
  itemElement.classList.add('css_save_to_folder_list_item');

  // Icon element
  const iconElement = document.createElement('div');
  iconElement.classList.add('css_save_to_folder_item_icon');
  const iconSpanElement = document.createElement('span');
  iconSpanElement.innerHTML = getIconHTML(item.icon);
  iconElement.appendChild(iconSpanElement);

  // Name element
  const nameElement = document.createElement('div');
  nameElement.classList.add('css_save_to_folder_item_name');
  nameElement.appendChild(document.createTextNode(item.name));

  // Event handler
  switch (type) {
    case 'stop-on-route':
      itemElement.onclick = function () {
        saveStopItemOnRoute(parameters[0], item.id, parameters[1], parameters[2]);
      };
      break;
    case 'stop-on-location':
      itemElement.onclick = function () {
        saveStopItemOnLocation(parameters[0], item.id, parameters[1], parameters[2]);
      };
      break;
    case 'route':
      itemElement.onclick = function () {
        saveRouteOnDetailsPage(item.id, parameters[0]);
      };
      break;
    case 'route-on-route':
      itemElement.onclick = function () {
        saveRouteOnRoute(item.id, parameters[0]);
      };
      break;
    case 'location':
      itemElement.onclick = function () {
        saveLocationOnDetailsPage(item.id, parameters[0]);
      };
      break;
    case 'bus':
      // No action
      break;
    default:
      break;
  }

  itemElement.appendChild(iconElement);
  itemElement.appendChild(nameElement);

  return {
    element: itemElement,
    id: ''
  };
}

async function initializeSaveToFolderField(type: SaveToFolderType, parameters: Array<any>) {
  const foldersWithContent = await listFoldersWithContent();
  SaveToFolderListElement.innerHTML = '';
  const fragment = new DocumentFragment();
  for (const item of foldersWithContent) {
    const newItemElement = generateElementOfItem(item, type, parameters);
    fragment.appendChild(newItemElement.element);
  }
  SaveToFolderListElement.append(fragment);
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

export function saveLocationOnDetailsPage(folderID: string, hash: string): void {
  const actionButtonElement = documentQuerySelector('.css_location_details_field .css_location_details_body .css_location_details_groups .css_location_details_group[group="actions"] .css_location_details_group_body .css_location_details_action_button[action="save-to-folder"]');
  saveLocation(folderID, hash).then((e) => {
    if (e) {
      isFolderContentSaved('location', hash).then((k) => {
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
