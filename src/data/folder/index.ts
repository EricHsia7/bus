import { getStop } from '../apis/getStop.ts';
import { getLocation } from '../apis/getLocation.ts';
import { getRoute } from '../apis/getRoute.ts';
import { lfSetItem, lfGetItem, lfListItem, registerStore } from '../storage/index.ts';
var md5 = require('md5');

var folders = {
  f_saved_stop: {
    name: 'Saved Stop',
    default: true,
    storeIndex: 5,
    contentType: ['stop'],
    id: 'saved_stop'
  }
};

export async function initializeFolderStores(): void {
  var folderKeys = await lfListItem(4);
  for (var folderKey of folderKeys) {
    var thisFolder = await lfGetItem(4, folderKey);
    if (thisFolder) {
      var thisFolderObject = JSON.parse(thisFolder);
      var storeIndex = await registerStore(thisFolderObject.name);
      thisFolder.storeIndex = storeIndex;
      if (!folders.hasOwnProperty(`f_${thisFolderObject.id}`)) {
        folders[`f_${thisFolderObject.id}`] = thisFolderObject;
      }
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
    id: idintifier
  };

  if (!folders.hasOwnProperty(`f_${idintifier}`)) {
    var existingFolder = await lfGetItem(4, `f_${idintifier}`);
    if (!existingFolder) {
      folders[`f_${idintifier}`] = object;
      await lfSetItem(4, `f_${idintifier}`, JSON.stringify(object));
      return true;
    }
    return false;
  }
  return false;
}

export async function listFolders(): [] {
  var result = [];
  for (var folder in folders) {
    result.push(folders[folder]);
  }
  return result;
}

export async function listFolderContent(folderID: string): [] {
  var result = [];
  var thisFolder = folders[`f_${folderID}`];
  var itemKeys = await lfListItem(thisFolder.storeIndex);
  for (var itemKey of itemKeys) {
    var item = await lfGetItem(thisFolder.storeIndex, itemKey);
    if (item) {
      var itemObject = JSON.parse(item);
      result.push(itemObject);
    }
  }
  return result;
}

export async function saveToFolder(folderID: string, content: object): boolean {
  var thisFolder = folders[`f_${folderID}`];
  if (thisFolder.contentType.indexOf(content.type) > -1) {
    await lfSetItem(thisFolder.storeIndex, `${content.type}_${content.id}`, JSON.stringify(content));
    return true;
  }
  return false;
}

export async function saveStop(folderID: string, StopID: number, RouteID: number): void {
  const requestID = `r_${md5(Math.random() * new Date().getTime())}`;
  var Stop = await getStop(requestID);
  var Location = await getLocation(requestID);
  var Route = await getRoute(requestID);
  var thisStop = Stop[`s_${StopID}`];
  var thisStopDirection = thisStop.goBack;
  var thisLocation = Location[`l_${thisStop.stopLocationId}`];
  var thisStopName = thisLocation.n;
  var thisRoute = Route[`r_${RouteID}`];
  var thisRouteName = thisRoute.n;
  var thisRouteDeparture = thisRoute.dep;
  var thisRouteDestination = thisRoute.des;
  var content = {
    type: 'stop',
    id: StopID,
    time: new Date().toISOString(),
    name: thisStopName,
    direction: thisStopDirection,
    route: {
      name: thisRouteName,
      endPoints: {
        departure: thisRouteDeparture,
        destination: thisRouteDestination
      },
      id: RouteID
    }
  };
  await saveToFolder(folderID, content);
  console.log(`Successfully saved ${thisStopName}!`);
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
