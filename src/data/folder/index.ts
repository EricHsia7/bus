import { MaterialSymbols } from '../../interface/icons/material-symbols-type';
// import { generateLabelFromAddresses } from '../../tools/address';
// import { CardinalDirection, getCardinalDirectionFromVector } from '../../tools/cardinal-direction';
import { generateIdentifier, hasOwnProperty } from '../../tools/index';
// import { generateDirectionLabels, generateLetterLabels } from '../../tools/labels';
// import { normalizeVector } from '../../tools/math';
import { collectBusArrivalTimeData } from '../analytics/bus-arrival-time/index';
import { collectUpdateRateData } from '../analytics/update-rate/index';
import { EstimateTimeItem, getEstimateTime } from '../apis/getEstimateTime/index';
import { getLocation, MergedLocation, MergedLocationItem, SimplifiedLocation } from '../apis/getLocation/index';
import { getMaterialSymbolsSearchIndex } from '../apis/getMaterialSymbolsSearchIndex/index';
import { getRoute, SimplifiedRoute, SimplifiedRouteItem } from '../apis/getRoute/index';
import { getStop, SimplifiedStop } from '../apis/getStop/index';
import { EstimateTimeStatus, parseEstimateTime } from '../apis/index';
import { deleteDataReceivingProgress, deleteDataUpdateTime, getDataUpdateTime, setDataReceivingProgress } from '../apis/loader';
import { getSettingOptionValue, SettingSelectOptionRefreshIntervalValue } from '../settings/index';
import { lfGetItem, lfListItemKeys, lfRemoveItem, lfSetItem } from '../storage/index';

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
  timestamp: number;
  name: string;
  direction: number;
  route: FolderContentStopRoute;
}

export interface FolderContentRoute {
  type: 'route';
  id: number;
  timestamp: number;
  name: string;
  endPoints: FolderContentRouteEndPoints;
}

export interface FolderContentLocation {
  type: 'location';
  id: string; // hash
  timestamp: number;
  name: string;
}

export interface FolderContentBus {
  type: 'bus';
  id: number; // CarID
  timestamp: number;
  busID: string; // BusID
}

export interface FolderContentEmpty {
  type: 'empty';
  id: number;
}

export type FolderContent = FolderContentStop | FolderContentRoute | FolderContentLocation | FolderContentBus | FolderContentEmpty;

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

const FolderList: { [key: string]: Folder } = {};

export async function initializeFolderList() {
  const folderKeys = await lfListItemKeys(11);
  for (const folderKey of folderKeys) {
    const thisFolderJSON = await lfGetItem(11, folderKey);
    if (thisFolderJSON) {
      const thisFolderObject = JSON.parse(thisFolderJSON) as Folder;
      if (!hasOwnProperty(FolderList, folderKey)) {
        FolderList[folderKey] = thisFolderObject;
      }
    }
  }
}

export async function createFolder(name: Folder['name'], icon: Folder['icon']): Promise<Folder['id'] | false> {
  // Validate icon
  const requestID = generateIdentifier();
  const materialSymbolsSearchIndex = await getMaterialSymbolsSearchIndex(requestID);
  deleteDataReceivingProgress(requestID);
  const iconComponents = icon.split('_');
  const dictionary = materialSymbolsSearchIndex.dictionary.split(',');
  for (let i = iconComponents.length - 1; i >= 0; i--) {
    iconComponents.splice(i, 1, dictionary.indexOf(iconComponents[i]).toString());
  }
  const symbolKey = iconComponents.join('_');
  if (!hasOwnProperty(materialSymbolsSearchIndex.symbols, symbolKey)) return false;

  // Check existence
  const folderID = generateIdentifier();
  const folderKey = `f_${folderID}`;
  if (hasOwnProperty(FolderList, folderKey)) {
    return false;
  }
  const existingFolder = await lfGetItem(11, folderKey);
  if (existingFolder) {
    return false;
  }

  // Generate folder
  const nowTime = new Date().getTime();
  let newFolder: Folder = {
    name: name,
    icon: icon,
    id: folderID,
    timestamp: nowTime
  };

  // Save folder
  FolderList[folderKey] = newFolder;
  await lfSetItem(11, folderKey, JSON.stringify(newFolder));
  await lfSetItem(12, folderKey, JSON.stringify([]));
  return folderID;
}

export async function updateFolder(folderID: Folder['id'], name: Folder['name'], icon: Folder['icon']): Promise<boolean> {
  const folderKey: string = `f_${folderID}`;

  // Check existence
  const existingFolderJSON = await lfGetItem(11, folderKey);
  if (!existingFolderJSON) {
    return false;
  }
  const existingFolderObject = JSON.parse(existingFolderJSON) as Folder;

  // Validate icon
  const requestID = generateIdentifier();
  const materialSymbolsSearchIndex = await getMaterialSymbolsSearchIndex(requestID);
  deleteDataReceivingProgress(requestID);
  const iconComponents = icon.split('_');
  const dictionary = materialSymbolsSearchIndex.dictionary.split(',');
  for (let i = iconComponents.length - 1; i >= 0; i--) {
    iconComponents.splice(i, 1, dictionary.indexOf(iconComponents[i]).toString());
  }
  const symbolKey = iconComponents.join('_');
  if (!hasOwnProperty(materialSymbolsSearchIndex.symbols, symbolKey)) return false;

  // Generate folder
  const modifiedFolder: Folder = {
    name: name,
    icon: icon,
    id: folderID,
    timestamp: existingFolderObject.timestamp
  };

  // Save folder
  FolderList[folderKey] = modifiedFolder;
  await lfSetItem(11, folderKey, JSON.stringify(modifiedFolder));
  return true;
}

export function getFolder(folderID: Folder['id']): Folder | false {
  const folderKey: string = `f_${folderID}`;
  if (!hasOwnProperty(FolderList, folderKey)) {
    return false;
  }
  const folderObject: Folder = {
    name: FolderList[folderKey].name,
    icon: FolderList[folderKey].icon,
    id: FolderList[folderKey].id,
    timestamp: FolderList[folderKey].timestamp
  };
  return folderObject;
  // return cloneDeep(Folders[folderKey]);
}

export function listFolders(): FolderArray {
  const result = [];
  for (const folderKey in FolderList) {
    const folderObject: Folder = {
      name: FolderList[folderKey].name,
      icon: FolderList[folderKey].icon,
      id: FolderList[folderKey].id,
      timestamp: FolderList[folderKey].timestamp
    };
    result.push(folderObject);
  }
  result.sort(function (a, b) {
    return a.timestamp - b.timestamp;
  });
  return result;
}

export async function listFolderContent(folderID: Folder['id']): Promise<Array<FolderContent>> {
  const result: Array<FolderContent> = [];

  const folderKey: string = `f_${folderID}`;
  const thisFolder = getFolder(folderID);
  if (typeof thisFolder === 'boolean' && thisFolder === false) {
    return result;
  }

  const thisFolderContentIndexJSON = await lfGetItem(12, folderKey);
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
    const thisContentJSON = await lfGetItem(13, thisFolderContentKey);
    if (thisContentJSON) {
      const thisContentObject = JSON.parse(thisContentJSON) as FolderContent;
      result.push(thisContentObject);
    }
  }
  return result;
}

async function getFolderContentLength(folderID: Folder['id']): Promise<number> {
  const folderKey: string = `f_${folderID}`;
  const thisFolderContentIndexJSON = await lfGetItem(12, folderKey);
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

export async function listAllFolderContent(types: Array<FolderContent['type']>): Promise<Array<FolderContent>> {
  let useFilter: boolean = true;
  if (typeof types !== 'object' || !Array.isArray(types)) {
    useFilter = false;
  }
  const result: Array<FolderContent> = [];
  const keys = await lfListItemKeys(13);
  for (const key of keys) {
    const json = await lfGetItem(13, key);
    if (json) {
      const object = JSON.parse(json) as FolderContent;
      if (useFilter) {
        if (types.indexOf(object.type) > -1) {
          result.push(object);
        }
      } else {
        result.push(object);
      }
    }
  }
  return result;
}

export interface integratedFolderContentStopRoute extends FolderContentStopRoute {
  pathAttributeId: Array<number>;
}

export interface integratedFolderContentStop extends FolderContentStop {
  status: EstimateTimeStatus;
  route: integratedFolderContentStopRoute;
}

export interface integratedFolderContentRoute extends FolderContentRoute {
  pathAttributeId: Array<number>;
}

export interface integratedFolderContentLocation extends FolderContentLocation {
  // labels: string;
}

export interface integratedFolderContentBus extends FolderContentBus {}

export interface integratedFolderContentEmpty extends FolderContentEmpty {}

export type integratedFolderContent = integratedFolderContentStop | integratedFolderContentRoute | integratedFolderContentLocation | integratedFolderContentBus | integratedFolderContentEmpty;

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
  // const Location = (await getLocation(requestID, 1)) as MergedLocation;

  const foldersWithContent = await listFoldersWithContent();

  const time_formatting_mode = getSettingOptionValue('time_formatting_mode') as number;
  // const location_labels = getSettingOptionValue('location_labels');
  const power_saving = getSettingOptionValue('power_saving') as boolean;
  const refresh_interval_setting = getSettingOptionValue('refresh_interval') as SettingSelectOptionRefreshIntervalValue;

  let StopIDs = [] as Array<number>;
  for (const folderWithContent1 of foldersWithContent) {
    StopIDs = StopIDs.concat(
      folderWithContent1.content
        .filter((m) => {
          return m.type === 'stop' ? true : false;
        })
        .map((e) => e.id as number)
    );
  }

  const batchFoundEstimateTime: { [key: string]: EstimateTimeItem } = {};
  for (const EstimateTimeItem of EstimateTime) {
    if (StopIDs.indexOf(EstimateTimeItem.StopID) > -1) {
      const thisStopKey: string = `s_${EstimateTimeItem.StopID}`;
      batchFoundEstimateTime[thisStopKey] = EstimateTimeItem;
    }
  }

  const folders: integratedFolders['folders'] = [];

  for (const folderWithContent2 of foldersWithContent) {
    // Initialize integratedFolder
    const integratedFolder: integratedFolder = {
      name: folderWithContent2.name,
      icon: folderWithContent2.icon,
      id: folderWithContent2.id,
      timestamp: folderWithContent2.timestamp,
      content: [],
      contentLength: folderWithContent2.contentLength
    };

    for (const item of folderWithContent2.content) {
      const integratedItem = item as integratedFolderContent;
      switch (integratedItem.type) {
        case 'stop': {
          const thisStopKey = `s_${integratedItem.id}`;
          let thisEstimateTime = {} as EstimateTimeItem;
          if (hasOwnProperty(batchFoundEstimateTime, thisStopKey)) {
            thisEstimateTime = batchFoundEstimateTime[thisStopKey];
          } else {
            break;
          }
          integratedItem.status = parseEstimateTime(thisEstimateTime.EstimateTime, time_formatting_mode);
          const thisRouteKey = `r_${integratedItem.route.id}`;
          const thisRoute = Route[thisRouteKey] as SimplifiedRouteItem;
          integratedItem.route.pathAttributeId = thisRoute.pid;
          break;
        }
        case 'route': {
          const thisRouteKey = `r_${integratedItem.id}`;
          const thisRoute = Route[thisRouteKey] as SimplifiedRouteItem;
          integratedItem.pathAttributeId = thisRoute.pid;
          break;
        }
        case 'location': {
          /*
          const thisLocationKey = `ml_${integratedItem.id}`;
          const thisLocation = Location[thisLocationKey] as MergedLocationItem;
          let labels: Array<string> = [];
          switch (location_labels) {
            case 'address':
              labels = generateLabelFromAddresses(thisLocation.a);
              break;
            case 'letters':
              const stopLocationIds = thisLocation.id;
              const stopLocationQuantity = stopLocationIds.length;
              labels = generateLetterLabels(stopLocationQuantity);
              break;
            case 'directions':
              const setsOfVectors = thisLocation.v;
              const cardinalDirections: Array<CardinalDirection> = [];
              for (const vectorSet of setsOfVectors) {
                let x: number = 0;
                let y: number = 0;
                for (const vector of vectorSet) {
                  x += vector[0];
                  y += vector[1];
                }
                const meanVector = normalizeVector([x, y]) as [number, number];
                const cardinalDirection = getCardinalDirectionFromVector(meanVector);
                cardinalDirections.push(cardinalDirection);
              }

              labels = generateDirectionLabels(cardinalDirections);
              break;
            default:
              break;
          }
          integratedItem.labels = labels.join(' - ');
          */
          break;
        }
        case 'bus':
          break;
        case 'empty':
          break;
        default:
          break;
      }
      integratedFolder.content.push(integratedItem);
    }
    folders.push(integratedFolder);
  }

  const result: integratedFolders = {
    folders: folders,
    dataUpdateTime: getDataUpdateTime(requestID)
  };

  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);

  if (!power_saving) {
    if (refresh_interval_setting.dynamic) {
      await collectUpdateRateData(EstimateTime);
    }
    await collectBusArrivalTimeData(EstimateTime);
  }

  return result;
}

export async function saveToFolder(folderID: Folder['id'], content: FolderContent): Promise<boolean> {
  const folderKey = `f_${folderID}`;
  const contentKey = `${content.type}_${content.id}`;
  const thisFolder = getFolder(folderID);

  if (typeof thisFolder === 'boolean' && thisFolder === false) {
    return false;
  }

  const thisFolderContentIndexJSON = (await lfGetItem(12, folderKey)) as string;
  if (!thisFolderContentIndexJSON) {
    return false;
  }

  const thisFolderContentIndexArray = JSON.parse(thisFolderContentIndexJSON) as Array<string>;
  if (thisFolderContentIndexArray.length === 0 || thisFolderContentIndexArray.indexOf(contentKey) < 0) {
    await lfSetItem(12, folderKey, JSON.stringify(thisFolderContentIndexArray.concat(contentKey)));
    await lfSetItem(13, contentKey, JSON.stringify(content));
    return true;
  } else {
    return false;
  }
}

export async function isFolderContentSaved(type: FolderContent['type'], id: FolderContent['id']): Promise<boolean> {
  const folderContentKeyToCheck = `${type}_${id}`;

  const keys = await lfListItemKeys(12);
  for (const key of keys) {
    const thisFolderContentIndexJSON = (await lfGetItem(12, key)) as string;
    if (!thisFolderContentIndexJSON) {
      continue;
    }
    const thisFolderContentIndexArray = JSON.parse(thisFolderContentIndexJSON) as Array<string>;
    if (thisFolderContentIndexArray.indexOf(folderContentKeyToCheck) > -1) {
      return true;
    }
  }
  return false;
}

export async function removeFromFolder(folderID: Folder['id'], type: FolderContent['type'], id: FolderContent['id']): Promise<boolean> {
  const folderKey = `f_${folderID}`;
  const thisFolderContentKey = `${type}_${id}`;

  // Check existence
  const thisFolder = getFolder(folderID);
  if (typeof thisFolder === 'boolean' && thisFolder === false) {
    return false;
  }

  // Remove reference from folder content index
  const thisFolderContentIndexJSON = (await lfGetItem(12, folderKey)) as string;
  if (!thisFolderContentIndexJSON) {
    return false;
  }
  const thisFolderContentIndexArray = JSON.parse(thisFolderContentIndexJSON) as Array<string>;
  const index = thisFolderContentIndexArray.indexOf(thisFolderContentKey);
  if (index > -1 && thisFolderContentIndexArray.length > 0) {
    thisFolderContentIndexArray.splice(index, 1);
    await lfSetItem(12, folderKey, JSON.stringify(thisFolderContentIndexArray));
  }

  // Remove content if there are no other references
  const isSaved = await isFolderContentSaved(type, id);
  if (isSaved === false) {
    await lfRemoveItem(13, thisFolderContentKey);
  }
  return true;
}

export async function saveStop(folderID: Folder['id'], StopID: number, RouteID: number): Promise<boolean> {
  const requestID = generateIdentifier();
  const Stop = (await getStop(requestID)) as SimplifiedStop;
  const Location = (await getLocation(requestID, 0)) as SimplifiedLocation;
  const Route = (await getRoute(requestID, true)) as SimplifiedRoute;

  const thisStop = Stop[`s_${StopID}`];
  const thisStopDirection: number = parseInt(thisStop.goBack);
  const thisLocation = Location[`l_${thisStop.stopLocationId}`];
  const thisStopName: string = thisLocation.n;

  const thisRoute = Route[`r_${RouteID}`];
  const thisRouteName: string = thisRoute.n;
  const thisRouteDeparture: string = thisRoute.dep;
  const thisRouteDestination: string = thisRoute.des;

  const newContent: FolderContentStop = {
    type: 'stop',
    id: StopID,
    timestamp: new Date().getTime(),
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
  const save = await saveToFolder(folderID, newContent);
  return save;
}

export async function saveRoute(folderID: Folder['id'], RouteID: number): Promise<boolean> {
  const requestID = generateIdentifier();
  const Route = (await getRoute(requestID, true)) as SimplifiedRoute;
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  const thisRouteKey = `r_${RouteID}`;
  let thisRoute = {} as SimplifiedRouteItem;
  if (hasOwnProperty(Route, thisRouteKey)) {
    thisRoute = Route[thisRouteKey];
  } else {
    return false;
  }

  const newContent: FolderContentRoute = {
    type: 'route',
    id: RouteID,
    timestamp: new Date().getTime(),
    name: thisRoute.n,
    endPoints: {
      departure: thisRoute.dep,
      destination: thisRoute.des
    }
  };
  const save = await saveToFolder(folderID, newContent);
  return save;
}

export async function saveLocation(folderID: Folder['id'], hash: string): Promise<boolean> {
  const requestID = generateIdentifier();
  const Location = (await getLocation(requestID, 1)) as MergedLocation;
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  const thisLocationKey = `ml_${hash}`;
  let thisLocation = {} as MergedLocationItem;
  if (hasOwnProperty(Location, thisLocationKey)) {
    thisLocation = Location[thisLocationKey];
  } else {
    return false;
  }

  const newContent: FolderContentLocation = {
    type: 'location',
    id: hash,
    timestamp: new Date().getTime(),
    name: thisLocation.n
  };
  const save = await saveToFolder(folderID, newContent);
  return save;
}

// TODO: Save Bus

export async function updateFolderContentIndex(folderID: Folder['id'], type: FolderContent['type'], id: FolderContent['id'], direction: 'up' | 'down'): Promise<boolean> {
  const folderKey = `f_${folderID}`;
  const thisFolderContentKey = `${type}_${id}`;
  const thisFolder = getFolder(folderID);
  if (typeof thisFolder === 'boolean' && thisFolder === false) {
    return false;
  }

  const thisFolderContentIndexJSON = (await lfGetItem(12, folderKey)) as string;
  if (!thisFolderContentIndexJSON) {
    return false;
  }
  const thisFolderContentIndexArray = JSON.parse(thisFolderContentIndexJSON) as Array<string>;

  const index = thisFolderContentIndexArray.indexOf(thisFolderContentKey);
  if (index > -1 && thisFolderContentIndexArray.length > 1) {
    let offset: number = 0;
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
    thisFolderContentIndexArray.splice(index, 1);
    thisFolderContentIndexArray.splice(index + offset, 0, thisFolderContentKey);
    await lfSetItem(12, folderKey, JSON.stringify(thisFolderContentIndexArray));
    return true;
  } else {
    return false;
  }
}
