import { integrateStop } from '../apis/index';
import { lfSetItem, lfGetItem, lfListItemKeys, registerStore, lfRemoveItem } from '../storage/index';
import { generateIdentifier } from '../../tools/index';
import { formatEstimateTime } from '../../tools/format-time';
import { getSettingOptionValue } from '../settings/index';
import { getMaterialSymbols } from '../apis/getMaterialSymbols';
import { searchRouteByRouteID } from '../search/searchRoute';
import { getRoute } from '../apis/getRoute/index';
import { dataUpdateTime, deleteDataReceivingProgress, deleteDataUpdateTime, setDataReceivingProgress } from '../apis/loader';
import { getEstimateTime } from '../apis/getEstimateTime';
import { recordEstimateTime } from '../analytics/update-rate';

const cloneDeep = require('lodash/cloneDeep');

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

const defaultFolderQuantity = 2;

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
  icon: string;
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

export async function initializeFolderStores(): void {
  var folderKeys = await lfListItemKeys(4);
  var index = defaultFolderQuantity; // avoid overwriting the default folders
  for (var folderKey of folderKeys) {
    var thisFolder: string = await lfGetItem(4, folderKey);
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

export async function createFolder(name: string, icon: string): Promise<boolean> {
  const requestID = `r_${generateIdentifier()}`;
  var materialSymbols = await getMaterialSymbols(requestID);
  if (materialSymbols.indexOf(icon) < 0) {
    return false;
  }

  var folderKeys = await lfListItemKeys(4);

  const identifier: string = generateIdentifier();
  if (!Folders.hasOwnProperty(`f_${identifier}`)) {
    var existingFolder = await lfGetItem(4, `f_${identifier}`);
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
      await lfSetItem(4, `f_${identifier}`, JSON.stringify(object));
      return true;
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
    var existingFolder: string = await lfGetItem(4, folderKey);
    if (existingFolder) {
      const requestID = `r_${generateIdentifier()}`;
      var materialSymbols = await getMaterialSymbols(requestID);
      if (materialSymbols.indexOf(folder.icon) < 0) {
        return false;
      } else {
        Folders[folderKey] = folder;
        await lfSetItem(4, folderKey, JSON.stringify(folder));
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

export async function listFoldersWithContent(): Promise<Array<FoldersWithContent>> {
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

function processEstimateTime(EstimateTime: Array, StopIDs: Array<number>): object {}

export async function integrateFolders(requestID: string): Promise<Array<object>> {
  setDataReceivingProgress(requestID, 'getEstimateTime_0', 0, false);
  setDataReceivingProgress(requestID, 'getEstimateTime_1', 0, false);
  setDataReceivingProgress(requestID, 'getRoute_0', 0, false);
  setDataReceivingProgress(requestID, 'getRoute_1', 0, false);

  const EstimateTime = await getEstimateTime(requestID);
  const Route = await getRoute(requestID, true);

  const foldersWithContent = await listFoldersWithContent();

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

  let integratedFolders = [];
  for (const folderWithContent2 of foldersWithContent) {
    var integratedFolder = {};
    integratedFolder.folder = folderWithContent2.folder;
    integratedFolder.content = [];
    for (let item of folderWithContent2.content) {
      let integratedItem = item;
      switch (item.type) {
        case 'stop':
          integratedItem._EstimateTime = processedEstimateTime[`s_${item.id}`];
          integratedItem._Route = Route[`r_${item.route.id}`];
          break;
        case 'route':
          integratedItem._Route = Route[`r_${item.id}`];
          break;
        case 'bus':
          break;
        case 'empty':
          break;
        default:
          break;
      }
      integratedFolder.content.push(integratedItem);
    }
    integratedFolders.push(integratedFolder);
  }

  const time_formatting_mode = getSettingOptionValue('time_formatting_mode');
  let foldedItems = {};
  let itemQuantity = {};
  let folderQuantity = 0;
  let folders = {};

  for (var item of integratedFolders) {
    var folderKey = `f_${item.folder.index}`;
    if (!foldedItems.hasOwnProperty(folderKey)) {
      foldedItems[folderKey] = [];
      itemQuantity[folderKey] = 0;
      folders[folderKey] = item.folder;
    }
    for (var item2 of item.content) {
      var formattedItem = item2;
      switch (item2.type) {
        case 'stop':
          formattedItem.status = formatEstimateTime(item2._EstimateTime.EstimateTime, time_formatting_mode);
          formattedItem.route.pathAttributeId = item2._Route.pid;
          break;
        case 'route':
          formattedItem.pathAttributeId = item2._Route.pid;
          break;
        case 'bus':
          break;
        case 'empty':
          break;
        default:
          break;
      }
      foldedItems[folderKey].push(formattedItem);
      itemQuantity[folderKey] = itemQuantity[folderKey] + 1;
    }
    folderQuantity += 1;
  }

  var result = {
    foldedItems: foldedItems,
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
