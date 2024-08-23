import { integrateStop, integrateEstimateTime2 } from '../apis/index.ts';
import { lfSetItem, lfGetItem, lfListItem, registerStore, lfRemoveItem } from '../storage/index.ts';
import { generateIdentifier } from '../../tools/index.ts';
import { formatEstimateTime } from '../../tools/format-time.ts';
import { getSettingOptionValue } from '../settings/index.ts';

var Folders = {
  f_saved_stop: {
    name: '已收藏站牌',
    icon: 'favorite',
    default: true,
    index: 0,
    storeIndex: 5,
    contentType: ['stop'],
    id: 'saved_stop'
  },
  f_saved_route: {
    name: '已收藏路線',
    icon: 'route',
    default: true,
    index: 1,
    storeIndex: 6,
    contentType: ['route'],
    id: 'saved_route'
  }
};

export type FolderContentType = 'stop' | 'route' | 'bus';

interface FolderStopRouteEndPoints {
  departure: string;
  destination: string;
}

interface FolderStopRoute {
  name: string;
  endPoints: FolderStopRouteEndPoints;
  id: number;
}

export interface FolderStop {
  type: 'stop';
  id: number;
  time: string;
  name: string;
  direction: number;
  route: FolderStopRoute;
  index: number;
}

export interface FolderRoute {
  type: 'route';
  id: number;
  time: string;
  name: string;
  index: number;
}

export interface Folder {
  name: string;
  icon: string;
  default: boolean;
  storeIndex: number | null;
  contentType: FolderContentType[];
  id: string;
  time: string;
  timeNumber: null | number;
}

export type FolderContent = FolderStop | FolderRoute;

export interface FoldersWithContent {
  folder: Folder;
  content: FolderContent[];
}

export async function initializeFolderStores(): void {
  var folderKeys = await lfListItem(4);
  var index = 2; // avoid overwriting the default folders
  for (var folderKey of folderKeys) {
    var thisFolder = await lfGetItem(4, folderKey);
    if (thisFolder) {
      if (!thisFolder.default) {
        var thisFolderObject: Folder = JSON.parse(thisFolder);
        var storeIndex = await registerStore(thisFolderObject.id);
        thisFolder.storeIndex = storeIndex;
        thisFolder.index = index;
        if (!Folders.hasOwnProperty(`f_${thisFolderObject.id}`)) {
          Folders[`f_${thisFolderObject.id}`] = thisFolderObject;
        }
        index += 1;
      }
    }
  }
}

export async function createFolder(name: string): boolean {
  var idintifier = `${generateIdentifier()}`;
  var object: Folder = {
    name: name,
    icon: 'none',
    default: false,
    storeIndex: null,
    contentType: ['stop', 'route', 'bus'],
    id: idintifier,
    time: new Date().toISOString()
  };

  if (!Folders.hasOwnProperty(`f_${idintifier}`)) {
    var existingFolder = await lfGetItem(4, `f_${idintifier}`);
    if (!existingFolder) {
      Folders[`f_${idintifier}`] = object;
      await lfSetItem(4, `f_${idintifier}`, JSON.stringify(object));
      return true;
    }
    return false;
  }
  return false;
}

export function getFolder(folderID: string): Folder {
  return Folders[`f_${folderID}`];
}

export async function listFolders(): Folder[] {
  var result = [];
  for (var folder in Folders) {
    result.push(Folders[folder]);
  }
  return result;
}

export async function listFolderContent(folderID: string): FolderContent[] {
  var result = [];
  var thisFolder = Folders[`f_${folderID}`];
  var itemKeys = await lfListItem(thisFolder.storeIndex);
  for (var itemKey of itemKeys) {
    var item = await lfGetItem(thisFolder.storeIndex, itemKey);
    if (item) {
      var itemObject: object = JSON.parse(item);
      result.push(itemObject);
    }
  }
  result = result.sort(function (a, b) {
    var c = a?.index || 0;
    var d = b?.index || 0;
    return c - d;
  });
  return result;
}

async function getFolderContentLength(folderID: string): number {
  var thisFolder = getFolder(folderID);
  var itemKeys = await lfListItem(thisFolder.storeIndex);
  return itemKeys.length;
}

export async function listFoldersWithContent(): FoldersWithContent[] {
  var Folders = await listFolders();
  var result = [];
  for (var folder of Folders) {
    var folderContent = await listFolderContent(folder.id);
    result.push({
      folder: folder,
      content: folderContent
    });
  }
  return result;
}

export async function integrateFolders(requestID: string): [] {
  var foldersWithContent = await listFoldersWithContent();
  var StopIDs = [];
  for (var item of foldersWithContent) {
    StopIDs = StopIDs.concat(
      item.content
        .filter((m) => {
          return m.type === 'stop' ? true : false;
        })
        .map((e) => e.id)
    );
  }
  var array = [];
  var EstimateTime2 = await integrateEstimateTime2(requestID, StopIDs);
  for (var folder of foldersWithContent) {
    var integratedFolder = {};
    integratedFolder.folder = folder.folder;
    integratedFolder.content = [];
    for (var item of folder.content) {
      var integratedItem = item;
      integratedItem._EstimateTime = EstimateTime2.items[`s_${item.id}`];
      integratedFolder.content.push(integratedItem);
    }
    array.push(integratedFolder);
  }

  var time_formatting_mode = getSettingOptionValue('time_formatting_mode');
  var foldedItems = {};
  var itemQuantity = {};
  var folderQuantity = 0;
  var folders = {};

  for (var item of array) {
    var folderKey = `f_${item.folder.index}`;
    if (!foldedItems.hasOwnProperty(folderKey)) {
      foldedItems[folderKey] = [];
      itemQuantity[folderKey] = 0;
      folders[folderKey] = item.folder;
    }
    for (var item2 of item.content) {
      var formattedItem = item2;
      formattedItem.status = formatEstimateTime(item2._EstimateTime.EstimateTime, time_formatting_mode);
      foldedItems[folderKey].push(formattedItem);
      itemQuantity[folderKey] = itemQuantity[folderKey] + 1;
    }
    folderQuantity += 1;
  }

  return {
    foldedItems: foldedItems,
    folders: folders,
    folderQuantity: folderQuantity,
    itemQuantity: itemQuantity,
    dataUpdateTime: EstimateTime2.dataUpdateTime
  };
}

export async function saveToFolder(folderID: string, content: object): boolean {
  var thisFolder: Folder = Folders[`f_${folderID}`];
  if (thisFolder.contentType.indexOf(content.type) > -1) {
    await lfSetItem(thisFolder.storeIndex, `${content.type}_${content.id}`, JSON.stringify(content));
    return true;
  }
  return false;
}

export async function isSaved(type: FolderContentType, id: number | string): boolean {
  var folderList = await listFolders();
  for (var folder of folderList) {
    if (folder.contentType.indexOf(type) > -1) {
      var itemKeys = await lfListItem(folder.storeIndex);
      for (var itemKey of itemKeys) {
        if (itemKey.indexOf(`${type}_${id}`) > -1) {
          return true;
        }
      }
    }
  }
  return false;
}

export async function removeFromFolder(folderID: string, type: FolderContentType, id: number): boolean {
  var thisFolder: Folder = Folders[`f_${folderID}`];
  var existence = await isSaved(type, id);
  if (existence) {
    await lfRemoveItem(thisFolder.storeIndex, `${type}_${id}`);
    return true;
  } else {
    return false;
  }
}

export async function saveStop(folderID: string, StopID: number, RouteID: number): boolean {
  var integration = await integrateStop(StopID, RouteID);
  var folderContentLength = await getFolderContentLength(folderID);
  var content: FolderStop = {
    type: 'stop',
    id: StopID,
    time: new Date().toISOString(),
    name: integration.thisStopName,
    direction: integration.thisStopDirection,
    route: {
      name: integration.thisRouteName,
      endPoints: {
        departure: integration.thisRouteDeparture,
        destination: integration.thisRouteDestination
      },
      id: RouteID
    },
    index: folderContentLength
  };
  var save = await saveToFolder(folderID, content);
  return save;
}

//TODO: saveRoute, saveBus

export async function updateFolderContentIndex(folderID: string, type: FolderContentType, id: number, direction: 'up' | 'down'): boolean {
  var thisFolder = getFolder(folderID);
  var thisFolderContent = await listFolderContent(folderID);
  var thisContentKey = `${type}_${id}`;
  var thisContent = await lfGetItem(thisFolder.storeIndex, thisContentKey);
  if (thisContent) {
    var thisContentObject: FolderContent = JSON.parse(thisContent);
    var offset: number = 0;
    switch (direction) {
      case 'up':
        offset = -1;
        break;
      case 'down':
        offset = 1;
        break;
      default:
        offset = 0;
        break;
    }
    var adjacentContentObject = thisFolderContent[thisContentObject.index + offset];
    if (adjacentContentObject) {
      var adjacentContentKey = `${adjacentContentObject.type}_${adjacentContentObject.id}`;

      var thisContentIndex = thisContentObject.index;
      var adjacentContentIndex = adjacentContentObject.index;
      thisContentObject.index = adjacentContentIndex;
      adjacentContentObject.index = thisContentIndex;
      await lfSetItem(thisFolder.storeIndex, thisContentKey, JSON.stringify(thisContentObject));
      await lfSetItem(thisFolder.storeIndex, adjacentContentKey, JSON.stringify(adjacentContentObject));
      return true;
    }
  } else {
    return false; // content dosen't exist
  }
}
