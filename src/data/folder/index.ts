import { integrateStop, integrateEstimateTime2 } from '../apis/index.ts';
import { lfSetItem, lfGetItem, lfListItem, registerStore } from '../storage/index.ts';
import { md5 } from '../../tools/index.ts';
import { getSettingOptionValue } from '../settings/index.ts';

var Folders = {
  f_saved_stop: {
    name: '已收藏站牌',
    icon: {
      source: 'icons',
      id: 'favorite'
    },
    default: true,
    index: 0,
    storeIndex: 5,
    contentType: ['stop'],
    id: 'saved_stop'
  }
};

export async function initializeFolderStores(): void {
  var folderKeys = await lfListItem(4);
  var index = 1;
  for (var folderKey of folderKeys) {
    var thisFolder = await lfGetItem(4, folderKey);
    if (thisFolder) {
      var thisFolderObject = JSON.parse(thisFolder);
      var storeIndex = await registerStore(thisFolderObject.name);
      thisFolder.storeIndex = storeIndex;
      thisFolder.index = index;
      if (!Folders.hasOwnProperty(`f_${thisFolderObject.id}`)) {
        Folders[`f_${thisFolderObject.id}`] = thisFolderObject;
      }
      index += 1;
    }
  }
}

export async function createFolder(name: string): boolean {
  var idintifier = `${md5(new Date().getTime() * Math.random())}`;
  var object = {
    name: name,
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

export function getFolder(folderID: string): object {
  return Folders[`f_${folderID}`];
}

export async function listFolders(): [] {
  var result = [];
  for (var folder in Folders) {
    result.push(Folders[folder]);
  }
  return result;
}

export async function listFolderContent(folderID: string): [] {
  var result = [];
  var thisFolder = Folders[`f_${folderID}`];
  var itemKeys = await lfListItem(thisFolder.storeIndex);
  for (var itemKey of itemKeys) {
    var item = await lfGetItem(thisFolder.storeIndex, itemKey);
    if (item) {
      var itemObject = JSON.parse(item);
      itemObject.timeNumber = new Date(itemObject.time).getTime();
      result.push(itemObject);
    }
  }
  result = result.sort(function (a, b) {
    return a.timeNumber - b.timeNumber;
  });
  return result;
}

export async function listFoldersWithContent(): [] {
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
  var thisFolder = Folders[`f_${folderID}`];
  if (thisFolder.contentType.indexOf(content.type) > -1) {
    await lfSetItem(thisFolder.storeIndex, `${content.type}_${content.id}`, JSON.stringify(content));
    return true;
  }
  return false;
}

export async function saveStop(folderID: string, StopID: number, RouteID: number): void {
  var integration = await integrateStop(StopID, RouteID);
  var content = {
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
    }
  };
  await saveToFolder(folderID, content);
  //console.log(`Successfully saved ${integration.thisStopName}!`);
}

export async function isSaved(type: string, id: number | string): boolean {
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
