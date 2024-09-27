import { parseEstimateTime } from '../apis/index';
import { lfSetItem, lfGetItem, lfListItemKeys, registerStore, lfRemoveItem } from '../storage/index';
import { generateIdentifier } from '../../tools/index';
import { getSettingOptionValue } from '../settings/index';
import { getMaterialSymbols } from '../apis/getMaterialSymbols/index';
import { searchRouteByRouteID } from '../search/index';
import { dataUpdateTime, deleteDataReceivingProgress, deleteDataUpdateTime, setDataReceivingProgress } from '../apis/loader';
import { EstimateTimeItem, getEstimateTime } from '../apis/getEstimateTime/index';
import { recordEstimateTime } from '../analytics/update-rate';
import { getStop } from '../apis/getStop/index';
import { getLocation } from '../apis/getLocation/index';
import { getRoute, SimplifiedRouteItem } from '../apis/getRoute/index';
import { MaterialSymbols } from '../../interface/icons/material-symbols-type';

const cloneDeep = require('lodash/cloneDeep');

export type FolderContentType = 'stop' | 'route' | 'bus' | 'empty';

interface FolderRouteEndPoints {
  departure: string;
  destination: string;
}

interface FolderStopRoute {
  name: string;
  endPoints: FolderRouteEndPoints;
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
  endPoints: FolderRouteEndPoints;
  index: number;
}

export interface FolderBus {
  type: 'bus';
  id: number; // CarID
  time: string;
  busID: string; // BusID
  index: number;
}

export interface FolderEmpty {
  type: 'empty';
  id: number;
  index: number;
}

export interface Folder {
  name: string;
  icon: MaterialSymbols;
  default: boolean;
  storeIndex: number | null;
  index: number | null;
  contentType: Array<FolderContentType>;
  id: string;
  time: string;
  timeNumber: null | number;
}

export type FolderContent = FolderStop | FolderRoute | FolderBus | FolderEmpty;

export interface FoldersWithContent {
  folder: Folder;
  content: Array<FolderContent>;
  contentLength: number;
}

export type FoldersWithContentArray = Array<FoldersWithContent>;

var Folders: { [key: string]: Folder } = {
  f_saved_stop: {
    name: '已收藏站牌',
    icon: 'location_on',
    default: true,
    index: 0,
    storeIndex: 7,
    contentType: ['stop'],
    id: 'saved_stop'
  },
  f_saved_route: {
    name: '已收藏路線',
    icon: 'route',
    default: true,
    index: 1,
    storeIndex: 8,
    contentType: ['route'],
    id: 'saved_route'
  }
};

const defaultFolderQuantity = 2;

export async function initializeFolderStores(): void {
  var folderKeys = await lfListItemKeys(6);
  var index = defaultFolderQuantity; // avoid overwriting the default folders
  for (var folderKey of folderKeys) {
    var thisFolder: string = await lfGetItem(6, folderKey);
    if (thisFolder) {
      if (!thisFolder.default) {
        var thisFolderObject: Folder = JSON.parse(thisFolder);
        var storeIndex = await registerStore(thisFolderObject.id);
        thisFolderObject.storeIndex = storeIndex; // assign a new store index
        thisFolderObject.index = index;
        if (!Folders.hasOwnProperty(`f_${thisFolderObject.id}`)) {
          Folders[`f_${thisFolderObject.id}`] = thisFolderObject;
        }
        index += 1;
      }
    }
  }
}

export async function createFolder(name: string, icon: string): Promise<boolean | string> {
  const requestID = generateIdentifier('r');
  var materialSymbols = await getMaterialSymbols(requestID);
  if (materialSymbols.indexOf(icon) < 0) {
    return false;
  }

  var folderKeys = await lfListItemKeys(6);

  const identifier: string = generateIdentifier();
  if (!Folders.hasOwnProperty(`f_${identifier}`)) {
    const existingFolder = await lfGetItem(6, `f_${identifier}`);
    if (!existingFolder) {
      const storeIndex = await registerStore(identifier);
      var object: Folder = {
        name: name,
        icon: icon,
        default: false,
        storeIndex: storeIndex,
        index: folderKeys.length + defaultFolderQuantity,
        contentType: ['stop', 'route', 'bus'],
        id: identifier,
        time: new Date().toISOString()
      };
      Folders[`f_${identifier}`] = object;
      await lfSetItem(6, `f_${identifier}`, JSON.stringify(object));
      return identifier;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export async function updateFolder(folder: Folder): Promise<boolean> {
  if (['saved_stop', 'saved_route'].indexOf(folder.id) < 0 && !folder.default) {
    const folderKey: string = `f_${folder.id}`;
    const existingFolder: string = await lfGetItem(6, folderKey);
    if (existingFolder) {
      const requestID = generateIdentifier('r');
      const materialSymbols = await getMaterialSymbols(requestID);
      if (materialSymbols.indexOf(folder.icon) < 0) {
        return false;
      } else {
        Folders[folderKey] = folder;
        await lfSetItem(6, folderKey, JSON.stringify(folder));
        return true;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function getFolder(folderID: string): Folder {
  return cloneDeep(Folders[`f_${folderID}`]);
}

export async function listFolders(): Promise<Array<Folder>> {
  var result = [];
  for (var folder in Folders) {
    result.push(Folders[folder]);
  }
  return result;
}

export async function listFolderContent(folderID: string): Promise<Array<FolderContent>> {
  var result = [];
  var thisFolder = Folders[`f_${folderID}`];
  var itemKeys = await lfListItemKeys(thisFolder.storeIndex);
  if (itemKeys.length > 0) {
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
  } else {
    result.push({
      type: 'empty',
      id: 0,
      index: 0
    });
  }
  return result;
}

async function getFolderContentLength(folderID: string): Promise<number> {
  const thisFolder = getFolder(folderID);
  const itemKeys = await lfListItemKeys(thisFolder.storeIndex);
  if (itemKeys.length === 1) {
    const folderContent = await listFolderContent(folderID);
    const firstItem = folderContent[0];
    if (firstItem.type === 'empty') {
      return 0;
    } else {
      return 1;
    }
  } else {
    return itemKeys.length;
  }
}

export async function listFoldersWithContent(): Promise<FoldersWithContentArray> {
  var Folders = await listFolders();
  var result = [];
  for (var folder of Folders) {
    var folderContent = await listFolderContent(folder.id);
    var folderContentLength = await getFolderContentLength(folder.id);
    result.push({
      folder: folder,
      content: folderContent,
      contentLength: folderContentLength
    });
  }
  return result;
}

interface integratedFolders {
  foldedContent: { [key: string]: Array<FolderContent> }; // TODO: integratedFolderContent
  folders: { [key: string]: Folder };
  folderQuantity: number;
  itemQuantity: { [key: string]: number };
  dataUpdateTime: any;
}

export async function integrateFolders(requestID: string): Promise<integratedFolders> {
  setDataReceivingProgress(requestID, 'getEstimateTime_0', 0, false);
  setDataReceivingProgress(requestID, 'getEstimateTime_1', 0, false);
  setDataReceivingProgress(requestID, 'getRoute_0', 0, false);
  setDataReceivingProgress(requestID, 'getRoute_1', 0, false);

  const EstimateTime = await getEstimateTime(requestID);
  const Route = await getRoute(requestID, true);

  const foldersWithContent = await listFoldersWithContent();

  const time_formatting_mode = getSettingOptionValue('time_formatting_mode');

  let StopIDs = [];
  for (const folderWithContent1 of foldersWithContent) {
    StopIDs = StopIDs.concat(
      folderWithContent1.content
        .filter((m) => {
          return m.type === 'stop' ? true : false;
        })
        .map((e) => e.id)
    );
  }

  let processedEstimateTime = {};
  for (const EstimateTimeItem of EstimateTime) {
    if (StopIDs.indexOf(parseInt(EstimateTimeItem.StopID)) > -1) {
      processedEstimateTime[`s_${EstimateTimeItem.StopID}`] = EstimateTimeItem;
    }
  }

  let foldedContent = {};
  let itemQuantity = {};
  let folderQuantity = 0;
  let folders = {};

  for (const folderWithContent2 of foldersWithContent) {
    const folderKey = `f_${folderWithContent2.folder.index}`;
    if (!foldedContent.hasOwnProperty(folderKey)) {
      foldedContent[folderKey] = [];
      itemQuantity[folderKey] = 0;
    }

    for (let item of folderWithContent2.content) {
      let integratedItem = item;

      let thisStopKey: string = '';
      let thisProcessedEstimateTime: EstimateTimeItem = {};

      let thisRouteKey: string = '';
      let thisRoute: SimplifiedRouteItem = {};

      switch (item.type) {
        case 'stop':
          thisStopKey = `s_${item.id}`;
          if (processedEstimateTime.hasOwnProperty(thisStopKey)) {
            thisProcessedEstimateTime = processedEstimateTime[thisStopKey];
          }
          integratedItem.status = parseEstimateTime(thisProcessedEstimateTime?.EstimateTime, time_formatting_mode);
          thisRouteKey = `r_${item.route.id}`;
          thisRoute = Route[thisRouteKey];
          integratedItem.route.pathAttributeId = thisRoute.pid;
          break;
        case 'route':
          thisRouteKey = `r_${item.id}`;
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
    folders[folderKey] = folderWithContent2.folder;
    folderQuantity += 1;
  }

  const result: integratedFolders = {
    foldedContent: foldedContent,
    folders: folders,
    folderQuantity: folderQuantity,
    itemQuantity: itemQuantity,
    dataUpdateTime: dataUpdateTime[requestID]
  };
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  await recordEstimateTime(EstimateTime);
  return result;
}

export async function saveToFolder(folderID: string, content: object): Promise<boolean> {
  var thisFolder: Folder = Folders[`f_${folderID}`];
  if (thisFolder.contentType.indexOf(content.type) > -1) {
    await lfSetItem(thisFolder.storeIndex, `${content.type}_${content.id}`, JSON.stringify(content));
    return true;
  }
  return false;
}

export async function isSaved(type: FolderContentType, id: number | string): Promise<boolean> {
  var folderList = await listFolders();
  for (var folder of folderList) {
    if (folder.contentType.indexOf(type) > -1) {
      var itemKeys = await lfListItemKeys(folder.storeIndex);
      for (var itemKey of itemKeys) {
        if (itemKey.indexOf(`${type}_${id}`) > -1) {
          return true;
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
  const Stop = await getStop(requestID);
  const Location = await getLocation(requestID, false);
  const Route = await getRoute(requestID);

  const thisStop: object = Stop[`s_${StopID}`];
  const thisStopDirection: number = parseInt(thisStop.goBack);
  const thisLocation: object = Location[`l_${thisStop.stopLocationId}`];
  const thisStopName: string = thisLocation.n;

  const thisRoute: object = Route[`r_${RouteID}`];
  const thisRouteName: string = thisRoute.n;
  const thisRouteDeparture: string = thisRoute.dep;
  const thisRouteDestination: string = thisRoute.des;

  var folderContentLength = await getFolderContentLength(folderID);
  var content: FolderStop = {
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
    var content: FolderRoute = {
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
