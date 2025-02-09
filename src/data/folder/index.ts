import { EstimateTimeStatus, parseEstimateTime } from '../apis/index';
import { lfSetItem, lfGetItem, lfListItemKeys, registerStore, lfRemoveItem } from '../storage/index';
import { generateIdentifier } from '../../tools/index';
import { getSettingOptionValue, SettingSelectOptionRefreshIntervalValue } from '../settings/index';
import { getMaterialSymbols } from '../apis/getMaterialSymbols/index';
import { searchRouteByRouteID } from '../search/index';
import { deleteDataReceivingProgress, deleteDataUpdateTime, getDataUpdateTime, setDataReceivingProgress } from '../apis/loader';
import { EstimateTimeItem, getEstimateTime } from '../apis/getEstimateTime/index';
import { recordEstimateTimeForUpdateRate } from '../analytics/update-rate/index';
import { getStop, SimplifiedStop } from '../apis/getStop/index';
import { getLocation, SimplifiedLocation } from '../apis/getLocation/index';
import { getRoute, SimplifiedRoute, SimplifiedRouteItem } from '../apis/getRoute/index';
import { MaterialSymbols } from '../../interface/icons/material-symbols-type';
import { recordEstimateTimeForBusArrivalTime } from '../analytics/bus-arrival-time';

// const cloneDeep = require('lodash/cloneDeep');

interface FolderContentRouteEndPoints {
  departure: string;
  destination: string;
}

export interface FolderContentStopRoute {
  name: string;
  endPoints: FolderContentRouteEndPoints;
  id: number;
}

export interface FolderContentStop {
  type: 'stop';
  id: number;
  time: string;
  name: string;
  direction: number;
  route: FolderContentStopRoute;
  index: number;
}

export interface FolderContentRoute {
  type: 'route';
  id: number;
  time: string;
  name: string;
  endPoints: FolderContentRouteEndPoints;
  index: number;
}

export interface FolderContentBus {
  type: 'bus';
  id: number; // CarID
  time: string;
  busID: string; // BusID
  index: number;
}

export interface FolderContentEmpty {
  type: 'empty';
  id: number;
  index: number;
}

export type FolderContent = FolderContentStop | FolderContentRoute | FolderContentBus | FolderContentEmpty;

export type FolderContentType = FolderContent['type'];

export interface Folder {
  name: string;
  icon: MaterialSymbols;
  id: string;
  timestamp: number;
}

export type FolderArray = Array<Folder>;

export interface FolderWithContent extends Folder {
  content: Array<FolderContent>;
  contentLength: number;
}

export type FolderWithContentArray = Array<FolderWithContent>;

const Folders: { [key: string]: Folder } = {};

export async function initializeFolderStores() {
  const folderKeys = await lfListItemKeys(9);
  for (const folderKey of folderKeys) {
    const thisFolderJSON = await lfGetItem(9, folderKey);
    if (thisFolderJSON) {
      const thisFolderObject = JSON.parse(thisFolderJSON) as Folder;
      if (!Folders.hasOwnProperty(folderKey)) {
        Folders[folderKey] = thisFolderObject;
      }
    }
  }
}

export async function createFolder(name: Folder['name'], icon: Folder['icon']): Promise<boolean | string> {
  // Validate icon
  const requestID = generateIdentifier('r');
  const materialSymbols = await getMaterialSymbols(requestID);
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  if (materialSymbols.indexOf(icon) < 0) {
    return false;
  }

  // Check existence
  if (Folders.hasOwnProperty(folderKey)) {
    return false;
  }
  const existingFolder = await lfGetItem(9, folderKey);
  if (existingFolder) {
    return false;
  }

  // Generate folder
  const folderID = generateIdentifier();
  const folderKey = `f_${folderID}`;
  const nowTime = new Date().getTime();
  let newFolder: Folder = {
    name: name,
    icon: icon,
    id: folderID,
    timestamp: nowTime
  };

  // Save folder
  Folders[folderKey] = newFolder;
  await lfSetItem(9, folderKey, JSON.stringify(newFolder));
  return folderID;
}

export async function updateFolder(folderID: Folder['id'], name: Folder['name'], icon: Folder['icon']): Promise<boolean> {
  const folderKey: string = `f_${folderID}`;

  // Check existence
  const existingFolderJSON = await lfGetItem(9, folderKey);
  if (!existingFolderJSON) {
    return false;
  }
  const existingFolderObject = JSON.parse(existingFolderJSON) as Folder;

  // Validate icon
  const requestID = generateIdentifier('r');
  const materialSymbols = await getMaterialSymbols(requestID);
  if (materialSymbols.indexOf(icon) < 0) {
    return false;
  }
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);

  // Generate folder
  const modifiedFolder: Folder = {
    name: name,
    icon: icon,
    id: folderID,
    timestamp: existingFolderObject.timestamp
  };

  // Save folder
  Folders[folderKey] = modifiedFolder;
  await lfSetItem(9, folderKey, JSON.stringify(modifiedFolder));
  return true;
}

export function getFolder(folderID: Folder['id']): Folder | false {
  const folderKey: string = `f_${folderID}`;
  if (!Folders.hasOwnProperty(folderKey)) {
    return false;
  }
  const folderObject: Folder = {
    name: Folders[folderKey].name,
    icon: Folders[folderKey].icon,
    id: Folders[folderKey].id,
    timestamp: Folders[folderKey].timestamp
  };
  return folderObject;
  // return cloneDeep(Folders[folderKey]);
}

export function listFolders(): FolderArray {
  const result = [];
  for (const folderKey in Folders) {
    const folderObject: Folder = {
      name: Folders[folderKey].name,
      icon: Folders[folderKey].icon,
      id: Folders[folderKey].id,
      timestamp: Folders[folderKey].timestamp
    };
    result.push(folderObject);
  }
  result.sort(function (a, b) {
    return a.timestamp - b.timestamp;
  });
  return result;
}

export async function listFolderContent(folderID: string): Promise<Array<FolderContent>> {
  let result: Array<FolderContent> = [];

  const folderKey = `f_${folderID}`;
  const thisFolder = getFolder(folderID);
  if (typeof thisFolder === 'boolean' && thisFolder === false) {
    return result;
  }

  const thisFolderContentIndexJSON = await lfGetItem(10, folderKey);
  if (!thisFolderContentIndexJSON) {
    return result;
  }
  const thisFolderContentIndexArray = JSON.parse(thisFolderContentIndexJSON) as Array<string>;
  if (thisFolderContentIndexArray.length === 0) {
    const emptyItem: FolderContentEmpty = {
      type: 'empty',
      id: 0,
      index: 0
    };
    result.push(emptyItem);
    return result;
  }

  for (const thisFolderContentKey of thisFolderContentIndexArray) {
    const thisContentJSON = await lfGetItem(11, thisFolderContentKey);
    if (thisContentJSON) {
      const thisContentObject = JSON.parse(thisContentJSON) as FolderContent;
      result.push(thisContentObject);
    }
  }
  return result;
}

async function getFolderContentLength(folderID: string): Promise<number> {
  const folderKey = `f_${folderID}`;
  const thisFolderContentIndexJSON = await lfGetItem(10, folderKey);
  if (!thisFolderContentIndexJSON) {
    return 0;
  }
  const thisFolderContentIndexArray = JSON.parse(thisFolderContentIndexJSON) as Array<string>;
  return thisFolderContentIndexArray.length;
}

export async function listFoldersWithContent(): Promise<FolderWithContentArray> {
  const folders = await listFolders();
  const result: FolderWithContentArray = [];
  for (const folder of folders) {
    const folderContent = await listFolderContent(folder.id);
    const folderContentLength = await getFolderContentLength(folder.id);
    result.push({
      name: folder.name,
      icon: folder.icon,
      id: folder.id,
      timestamp: folder.timestamp,
      content: folderContent,
      contentLength: folderContentLength
    });
  }
  return result;
}

export interface integratedFolderStopRoute extends FolderContentStopRoute {
  pathAttributeId: Array<number>;
}

export interface integratedFolderStop extends FolderContentStop {
  status: EstimateTimeStatus;
  route: integratedFolderStopRoute;
}

export interface integratedFolderRoute extends FolderContentRoute {
  pathAttributeId: Array<number>;
}

export interface integratedFolderBus extends FolderContentBus {}

export interface integratedFolderEmpty extends FolderContentEmpty {}

export type integratedFolderContent = integratedFolderStop | integratedFolderRoute | integratedFolderBus | integratedFolderEmpty;

export interface integratedFolder extends Folder {
  content: Array<integratedFolderContent>;
  contentLength: number;
}

export interface integratedFolders {
  folders: Array<integratedFolder>;
  dataUpdateTime: number;
}

export async function integrateFolders(requestID: string): Promise<integratedFolders> {
  setDataReceivingProgress(requestID, 'getEstimateTime_0', 0, false);
  setDataReceivingProgress(requestID, 'getEstimateTime_1', 0, false);
  setDataReceivingProgress(requestID, 'getRoute_0', 0, false);
  setDataReceivingProgress(requestID, 'getRoute_1', 0, false);

  const EstimateTime = await getEstimateTime(requestID);
  const Route = (await getRoute(requestID, true)) as SimplifiedRoute;

  const foldersWithContent = await listFoldersWithContent();

  const time_formatting_mode = getSettingOptionValue('time_formatting_mode') as number;
  const power_saving = getSettingOptionValue('power_saving') as boolean;
  const refresh_interval_setting = getSettingOptionValue('refresh_interval') as SettingSelectOptionRefreshIntervalValue;

  let StopIDs = [] as Array<number>;
  for (const folderWithContent1 of foldersWithContent) {
    StopIDs = StopIDs.concat(
      folderWithContent1.content
        .filter((m) => {
          return m.type === 'stop' ? true : false;
        })
        .map((e) => e.id)
    );
  }

  let processedEstimateTime: { [key: string]: EstimateTimeItem } = {};
  for (const EstimateTimeItem of EstimateTime) {
    if (StopIDs.indexOf(EstimateTimeItem.StopID) > -1) {
      // parseInt?
      const thisStopKey: string = `s_${EstimateTimeItem.StopID}`;
      processedEstimateTime[thisStopKey] = EstimateTimeItem;
    }
  }

  let foldedContent: integratedFolders['foldedContent'] = {};
  let itemQuantity: integratedFolders['itemQuantity'] = {};
  let folderQuantity: integratedFolders['folderQuantity'] = 0;
  let folders: integratedFolders['folders'] = {};

  let index = 0;
  for (const folderWithContent2 of foldersWithContent) {
    const folderKey = `f_${index}`;
    if (!foldedContent.hasOwnProperty(folderKey)) {
      foldedContent[folderKey] = [];
      itemQuantity[folderKey] = 0;
    }

    for (let item of folderWithContent2.content) {
      let integratedItem = item as integratedFolderContent;

      let thisStopKey: string = '';
      let thisProcessedEstimateTime = {} as EstimateTimeItem;

      let thisRouteKey: string = '';
      let thisRoute = {} as SimplifiedRouteItem;

      switch (integratedItem.type) {
        case 'stop':
          thisStopKey = `s_${integratedItem.id}`;
          if (processedEstimateTime.hasOwnProperty(thisStopKey)) {
            thisProcessedEstimateTime = processedEstimateTime[thisStopKey];
          }
          integratedItem.status = parseEstimateTime(thisProcessedEstimateTime?.EstimateTime, time_formatting_mode);
          thisRouteKey = `r_${integratedItem.route.id}`;
          thisRoute = Route[thisRouteKey];
          integratedItem.route.pathAttributeId = thisRoute.pid;
          break;
        case 'route':
          thisRouteKey = `r_${integratedItem.id}`;
          thisRoute = Route[thisRouteKey];
          integratedItem.pathAttributeId = thisRoute.pid;
          break;
        case 'bus':
          break;
        case 'empty':
          break;
        default:
          break;
      }
      foldedContent[folderKey].push(integratedItem);
      itemQuantity[folderKey] = itemQuantity[folderKey] + 1;
    }
    folders[folderKey] = folderWithContent2;
    folderQuantity += 1;
    index += 1;
  }

  const result: integratedFolders = {
    foldedContent: foldedContent,
    folders: folders,
    folderQuantity: folderQuantity,
    itemQuantity: itemQuantity,
    dataUpdateTime: getDataUpdateTime(requestID)
  };
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  if (!power_saving) {
    if (refresh_interval_setting.dynamic) {
      await recordEstimateTimeForUpdateRate(EstimateTime);
    }
    await recordEstimateTimeForBusArrivalTime(EstimateTime);
  }
  return result;
}

export async function saveToFolder(folderID: string, content: FolderContent): Promise<boolean> {
  const thisFolder = Folders[`f_${folderID}`];
  if (thisFolder.contentType.indexOf(content.type) > -1) {
    if (typeof thisFolder.storeIndex === 'number') {
      await lfSetItem(thisFolder.storeIndex, `${content.type}_${content.id}`, JSON.stringify(content));
    }
    return true;
  }
  return false;
}

export async function isSaved(type: FolderContentType, id: number | string): Promise<boolean> {
  const folderList = await listFolders();
  for (const folder of folderList) {
    if (folder.contentType.indexOf(type) > -1) {
      if (typeof folder.storeIndex === 'number') {
        const itemKeys = await lfListItemKeys(folder.storeIndex);
        for (const itemKey of itemKeys) {
          if (itemKey.indexOf(`${type}_${id}`) > -1) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

export async function removeFromFolder(folderID: string, type: FolderContentType, id: number): Promise<boolean> {
  var thisFolder: Folder = Folders[`f_${folderID}`];
  var existence = await isSaved(type, id);
  if (existence) {
    await lfRemoveItem(thisFolder.storeIndex, `${type}_${id}`);
    return true;
  } else {
    return false;
  }
}

export async function saveStop(folderID: string, StopID: number, RouteID: number): Promise<boolean> {
  const requestID = generateIdentifier('r');
  const Stop = (await getStop(requestID)) as SimplifiedStop;
  const Location = (await getLocation(requestID, false)) as SimplifiedLocation;
  const Route = (await getRoute(requestID, true)) as SimplifiedRoute;

  const thisStop = Stop[`s_${StopID}`];
  const thisStopDirection: number = parseInt(thisStop.goBack);
  const thisLocation = Location[`l_${thisStop.stopLocationId}`];
  const thisStopName: string = thisLocation.n;

  const thisRoute = Route[`r_${RouteID}`];
  const thisRouteName: string = thisRoute.n;
  const thisRouteDeparture: string = thisRoute.dep;
  const thisRouteDestination: string = thisRoute.des;

  var folderContentLength = await getFolderContentLength(folderID);
  var content: FolderContentStop = {
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
    },
    index: folderContentLength
  };
  var save = await saveToFolder(folderID, content);
  return save;
}

export async function saveRoute(folderID: string, RouteID: number): Promise<boolean> {
  var folderContentLength = await getFolderContentLength(folderID);
  var searchedRoute = await searchRouteByRouteID(RouteID);
  if (searchedRoute.length > 0) {
    var Route = searchedRoute[0];
    var content: FolderContentRoute = {
      type: 'route',
      id: RouteID,
      time: new Date().toISOString(),
      name: Route.n,
      endPoints: {
        departure: Route.dep,
        destination: Route.des
      },
      index: folderContentLength
    };
    var save = await saveToFolder(folderID, content);
    return save;
  } else {
    return false;
  }
}
//TODO: saveBus

export async function updateFolderContentIndex(folderID: string, type: FolderContentType, id: number, direction: 'up' | 'down'): Promise<boolean> {
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
