import { MaterialSymbol } from '../../interface/icons/material-symbols-type';
import { generateIdentifier, hasOwnProperty } from '../../tools/index';
import { Progress, ProgressCallback } from '../../tools/progress';
import { collectBusArrivalTimeData } from '../analytics/bus-arrival-time/index';
import { collectUpdateRateData } from '../analytics/update-rate/index';
import { EstimateTime, EstimateTimeItem, getEstimateTime } from '../apis/getEstimateTime/index';
import { getLocation, MergedLocation, SimplifiedLocation } from '../apis/getLocation/index';
import { getMaterialSymbolsList } from '../apis/getMaterialSymbolsList';
import { getRoute, SimplifiedRoute } from '../apis/getRoute/index';
import { getStop, SimplifiedStop } from '../apis/getStop/index';
import { batchFindEstimateTime, EstimateTimeStatus, parseEstimateTime } from '../apis/index';
import { getSettingOptionValue, SettingSelectOptionRefreshIntervalValue } from '../settings/index';
import { lfGetItem, lfListItemKeys, lfRemoveItem, lfSetItem } from '../storage/index';

export interface FolderContentRouteEndPoints {
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
  icon: MaterialSymbol;
  id: string;
  timestamp: number;
}

export type FolderArray = Array<Folder>;

export interface FolderWithContent extends Folder {
  content: Array<FolderContent>;
  contentLength: number;
}

export type FolderWithContentArray = Array<FolderWithContent>;

export interface FolderWithContentLength extends Folder {
  contentLength: number;
}

export type FolderWithContentLengthArray = Array<FolderWithContentLength>;

const Folders = new Map<string, Folder>(); // folderKey -> folder
const FolderContents = new Map<string, FolderContent>(); // contentKey -> content
const FolderContentIndices = new Map<string, Array<string>>(); // folderKey -> contentKey(n)
const FolderIndex: Array<string> = []; // folderKey(n)

export async function initializeFolders() {
  const folderIndexJSON = await lfGetItem(10, 'folderIndex');
  let folderIndexArray: Array<string> = [];
  if (folderIndexJSON) {
    folderIndexArray = JSON.parse(folderIndexJSON) as Array<string>;
  } else {
    await lfSetItem(10, 'folderIndex', JSON.stringify(folderIndexArray));
  }

  for (const folderKey of folderIndexArray) {
    const thisFolderJSON = await lfGetItem(11, folderKey);
    if (!thisFolderJSON) continue;
    const thisFolderObject = JSON.parse(thisFolderJSON) as Folder;

    Folders.set(folderKey, thisFolderObject);
    FolderIndex.push(folderKey);

    let thisFolderContentIndexArray: Array<string> = [];
    const thisFolderContentIndexJSON = await lfGetItem(12, folderKey);
    if (thisFolderContentIndexJSON) {
      thisFolderContentIndexArray = JSON.parse(thisFolderContentIndexJSON) as Array<string>;
    }
    FolderContentIndices.set(folderKey, thisFolderContentIndexArray);
  }

  const folderContentKeys = await lfListItemKeys(13);
  for (const contentKey of folderContentKeys) {
    if (FolderContents.has(contentKey)) continue;
    const thisFolderContentJSON = await lfGetItem(13, contentKey);
    if (!thisFolderContentJSON) continue;
    const thisFolderContentObject = JSON.parse(thisFolderContentJSON) as FolderContent;
    FolderContents.set(contentKey, thisFolderContentObject);
  }
}

export async function createFolder(name: Folder['name'], icon: Folder['icon']): Promise<Folder['id'] | false> {
  // Validate icon
  const progress = new Progress(1, function () {});
  const materialSymbolsList = await getMaterialSymbolsList(progress);
  progress.terminate();
  if (materialSymbolsList.indexOf(icon) < 0) return false;

  // Check existence
  const folderID = generateIdentifier();
  const folderKey = `f_${folderID}`;
  if (Folders.has(folderKey)) {
    return false;
  }
  const folderIndexJSON = await lfGetItem(10, 'folderIndex');
  const folderIndexArray = JSON.parse(folderIndexJSON) as Array<string>;
  if (folderIndexArray.indexOf(folderKey) > -1) {
    return false;
  }
  const existingFolder = await lfGetItem(11, folderKey);
  if (existingFolder) {
    return false;
  }

  // Generate folder
  const nowTime = new Date().getTime();
  const newFolder: Folder = {
    name: name,
    icon: icon,
    id: folderID,
    timestamp: nowTime
  };

  // Save folder
  Folders.set(folderKey, newFolder);
  FolderContentIndices.set(folderKey, []);
  FolderIndex.push(folderKey);
  folderIndexArray.push(folderKey);
  await lfSetItem(10, 'folderIndex', JSON.stringify(folderIndexArray));
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
  const progress = new Progress(1, function () {});
  const materialSymbolsSearchList = await getMaterialSymbolsList(progress);
  progress.terminate();
  if (materialSymbolsSearchList.indexOf(icon) < 0) return false;

  // Generate folder
  const modifiedFolder: Folder = {
    name: name,
    icon: icon,
    id: folderID,
    timestamp: existingFolderObject.timestamp
  };

  // Save folder
  Folders.set(folderKey, modifiedFolder);
  await lfSetItem(11, folderKey, JSON.stringify(modifiedFolder));
  return true;
}

export async function updateFolderIndex(folderID: Folder['id'], direction: 'up' | 'down'): Promise<boolean> {
  const folderKey = `f_${folderID}`;

  const folderIndexJSON = await lfGetItem(10, 'folderIndex');
  if (!folderIndexJSON) {
    return false;
  }
  const folderIndexArray = JSON.parse(folderIndexJSON) as Array<string>;

  const index = folderIndexArray.indexOf(folderKey);
  if (index > -1 && folderIndexArray.length > 1) {
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
    folderIndexArray.splice(index, 1);
    folderIndexArray.splice(index + offset, 0, folderKey);
    FolderIndex.splice(index, 1);
    FolderIndex.splice(index + offset, 0, folderKey);
    await lfSetItem(10, 'folderIndex', JSON.stringify(folderIndexArray));
    return true;
  } else {
    return false;
  }
}

export async function removeFolder(folderID: Folder['id']): Promise<boolean> {
  const folderKey = `f_${folderID}`;
  if (!Folders.has(folderKey)) {
    return false;
  }

  const folderIndexJSON = await lfGetItem(10, 'folderIndex');
  if (!folderIndexJSON) {
    return false;
  }

  const folderIndexArray = JSON.parse(folderIndexJSON) as Array<string>;
  const thisFolderIndex = folderIndexArray.indexOf(folderKey);
  if (thisFolderIndex < 0) {
    return false;
  }

  const thisFolderJSON = await lfGetItem(11, folderKey);
  if (!thisFolderJSON) {
    return false;
  }

  const thisFolderContentIndexJSON = await lfGetItem(12, folderKey);
  if (!thisFolderContentIndexJSON) {
    return false;
  }

  Folders.delete(folderKey);
  FolderContentIndices.delete(folderKey);
  FolderIndex.splice(thisFolderIndex, 1);
  folderIndexArray.splice(thisFolderIndex, 1);
  await lfSetItem(10, 'folderIndex', JSON.stringify(folderIndexArray));
  await lfRemoveItem(11, folderKey);
  await lfRemoveItem(12, folderKey);

  let folderContentIndexArray: Array<string> = [];
  for (const key of folderIndexArray) {
    folderContentIndexArray = folderContentIndexArray.concat(FolderContentIndices.get(key) || []);
  }

  const thisFolderContentIndexArray = FolderContentIndices.get(folderKey);
  if (thisFolderContentIndexArray) {
    for (const key of thisFolderContentIndexArray) {
      // Remove contents without references
      if (folderContentIndexArray.indexOf(key) < 0) {
        FolderContents.delete(key);
        await lfRemoveItem(13, key);
      }
    }
  }

  return true;
}

export function getFolder(folderID: Folder['id']): Folder | false {
  const folderKey: string = `f_${folderID}`;
  if (!Folders.has(folderKey)) {
    return false;
  }
  const thisFolder = Folders.get(folderKey) as Folder;
  const copy: Folder = {
    name: thisFolder.name,
    icon: thisFolder.icon,
    id: thisFolder.id,
    timestamp: thisFolder.timestamp
  };
  return copy;
}

export function listFolders(): FolderArray {
  const result = [];
  for (const folderKey of FolderIndex) {
    const thisFolder = Folders.get(folderKey);
    if (thisFolder) {
      const copy: Folder = {
        name: thisFolder.name,
        icon: thisFolder.icon,
        id: thisFolder.id,
        timestamp: thisFolder.timestamp
      };
      result.push(copy);
    }
  }
  return result;
}

export function listFolderContent(folderID: Folder['id']): Array<FolderContent> {
  const result: Array<FolderContent> = [];

  const folderKey: string = `f_${folderID}`;
  const thisFolder = getFolder(folderID);
  if (typeof thisFolder === 'boolean' && thisFolder === false) {
    return result;
  }

  const thisFolderContentIndexArray = FolderContentIndices.get(folderKey);
  if (!thisFolderContentIndexArray) {
    return result;
  }

  if (thisFolderContentIndexArray.length === 0) {
    const emptyItem: FolderContentEmpty = {
      type: 'empty',
      id: 0
    };
    result.push(emptyItem);
    return result;
  }

  for (const thisFolderContentKey of thisFolderContentIndexArray) {
    const thisContentObject = FolderContents.get(thisFolderContentKey); // TODO: copy?
    if (thisContentObject) {
      result.push(thisContentObject);
    }
  }
  return result;
}

function getFolderContentLength(folderID: Folder['id']): number {
  const folderKey: string = `f_${folderID}`;
  const thisFolderContentIndexArray = FolderContentIndices.get(folderKey);
  if (thisFolderContentIndexArray) {
    return thisFolderContentIndexArray.length;
  } else {
    return 0;
  }
}

export function listFoldersWithContent(): FolderWithContentArray {
  const folders = listFolders();
  const result: FolderWithContentArray = [];
  for (const folder of folders) {
    const folderContent = listFolderContent(folder.id);
    const folderContentLength = getFolderContentLength(folder.id);
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

export function listFoldersWithContentLength(): FolderWithContentLengthArray {
  const folders = listFolders();
  const result: FolderWithContentLengthArray = [];
  for (const folder of folders) {
    const folderContentLength = getFolderContentLength(folder.id);
    result.push({
      name: folder.name,
      icon: folder.icon,
      id: folder.id,
      timestamp: folder.timestamp,
      contentLength: folderContentLength
    });
  }
  return result;
}

export function listAllFolderContent(types: Array<FolderContent['type']>): Array<FolderContent> {
  let useFilter: boolean = true;
  if (typeof types !== 'object' || !Array.isArray(types)) {
    useFilter = false;
  }
  const result: Array<FolderContent> = [];
  for (const content of FolderContents.values()) {
    if (useFilter) {
      if (types.indexOf(content.type) > -1) {
        result.push(content);
      }
    } else {
      result.push(content);
    }
  }
  return result;
}

export interface integratedFolderContentStop extends FolderContentStop {
  status: EstimateTimeStatus;
}

export interface integratedFolderContentRoute extends FolderContentRoute {}

export interface integratedFolderContentLocation extends FolderContentLocation {}

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

export async function integrateFolders(progressCallback: ProgressCallback): Promise<integratedFolders> {
  const progress = new Progress(2, progressCallback); // getEstimateTime: 2
  const EstimateTime = await getEstimateTime(progress);
  const foldersWithContent = listFoldersWithContent();
  const StopIDs = (listAllFolderContent(['stop']) as Array<FolderContentStop>).map((stop) => stop.id);

  const time_formatting_mode = getSettingOptionValue('time_formatting_mode') as number;
  const power_saving = getSettingOptionValue('power_saving') as boolean;
  const refresh_interval_setting = getSettingOptionValue('refresh_interval') as SettingSelectOptionRefreshIntervalValue;

  const batchFoundEstimateTime = batchFindEstimateTime(EstimateTime, StopIDs);

  const folders: integratedFolders['folders'] = [];
  for (const folderWithContent of foldersWithContent) {
    // Initialize integratedFolder
    const integratedFolder: integratedFolder = {
      name: folderWithContent.name,
      icon: folderWithContent.icon,
      id: folderWithContent.id,
      timestamp: folderWithContent.timestamp,
      content: [],
      contentLength: folderWithContent.contentLength
    };

    for (const item of folderWithContent.content) {
      switch (item.type) {
        case 'stop': {
          const thisStopKey = `s_${item.id}`;
          if (!hasOwnProperty(batchFoundEstimateTime, thisStopKey)) continue;
          const thisEstimateTime = batchFoundEstimateTime[thisStopKey] as EstimateTimeItem;

          integratedFolder.content.push({
            type: 'stop',
            id: item.id,
            timestamp: item.timestamp,
            name: item.name,
            direction: item.direction,
            status: parseEstimateTime(thisEstimateTime.EstimateTime, time_formatting_mode),
            route: {
              id: item.route.id,
              name: item.route.name,
              endPoints: {
                departure: item.route.endPoints.departure,
                destination: item.route.endPoints.destination
              }
            }
          } as integratedFolderContentStop);
          break;
        }
        case 'route': {
          integratedFolder.content.push({
            type: 'route',
            id: item.id,
            timestamp: item.timestamp,
            name: item.name,
            endPoints: {
              departure: item.endPoints.departure,
              destination: item.endPoints.destination
            }
          } as integratedFolderContentRoute);
          break;
        }
        case 'location': {
          integratedFolder.content.push({
            type: 'location',
            id: item.id,
            timestamp: item.timestamp,
            name: item.name
          } as integratedFolderContentLocation);
          break;
        }
        case 'bus': {
          integratedFolder.content.push({
            type: 'bus',
            id: item.id,
            timestamp: item.timestamp,
            busID: item.busID
          } as integratedFolderContentBus);
          break;
        }
        case 'empty': {
          integratedFolder.content.push({
            type: 'empty',
            id: item.id
          } as integratedFolderContentEmpty);
          break;
        }
        default:
          break;
      }
    }
    folders.push(integratedFolder);
  }

  const result: integratedFolders = {
    folders: folders,
    dataUpdateTime: progress.getTime()
  };

  progress.terminate();

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
  if (!Folders.has(folderKey)) {
    return false;
  }

  const thisFolderContentIndexArray = FolderContentIndices.get(folderKey);
  if (!thisFolderContentIndexArray) return false;

  const contentKey = `${content.type}_${content.id}`;
  if (thisFolderContentIndexArray.length === 0 || thisFolderContentIndexArray.indexOf(contentKey) < 0) {
    thisFolderContentIndexArray.push(contentKey);
    FolderContentIndices.set(folderKey, thisFolderContentIndexArray);
    await lfSetItem(12, folderKey, JSON.stringify(thisFolderContentIndexArray));
    if (!FolderContents.has(contentKey)) {
      FolderContents.set(contentKey, content);
      await lfSetItem(13, contentKey, JSON.stringify(content));
    }
    return true;
  } else {
    return false;
  }
}

export function isFolderContentSaved(type: FolderContent['type'], id: FolderContent['id']): boolean {
  const contentKey = `${type}_${id}`;
  return FolderContents.has(contentKey);
}

export async function removeFromFolder(folderID: Folder['id'], type: FolderContent['type'], id: FolderContent['id']): Promise<boolean> {
  const folderKey = `f_${folderID}`;
  const thisFolderContentKey = `${type}_${id}`;

  // Check existence
  if (!Folders.has(folderKey)) {
    return false;
  }

  // Remove reference from folder content index
  const thisFolderContentIndexArray = FolderContentIndices.get(folderKey);
  if (!thisFolderContentIndexArray) return false;

  const index = thisFolderContentIndexArray.indexOf(thisFolderContentKey);
  if (index > -1 && thisFolderContentIndexArray.length > 0) {
    thisFolderContentIndexArray.splice(index, 1);
    FolderContentIndices.set(folderKey, thisFolderContentIndexArray);
    await lfSetItem(12, folderKey, JSON.stringify(thisFolderContentIndexArray));
  } else {
    return false;
  }

  // Remove content if there are no other references
  const contentKey = `${type}_${id}`;
  if (FolderContents.has(contentKey)) {
    FolderContents.delete(contentKey);
    await lfRemoveItem(13, thisFolderContentKey);
  }
  return true;
}

export async function saveStop(folderID: Folder['id'], StopID: FolderContentStop['id'], RouteID: FolderContentStop['route']['id']): Promise<boolean> {
  const progress = new Progress(6, function () {});
  const [Stop, Location, Route] = (await Promise.all([getStop(progress), getLocation(progress, 0), getRoute(progress, true)])) as [SimplifiedStop, SimplifiedLocation, SimplifiedRoute];

  const thisStop = Stop[`s_${StopID}`];
  const thisStopDirection: number = parseInt(thisStop.goBack, 10);
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
  progress.terminate();
  return save;
}

export async function saveRoute(folderID: Folder['id'], RouteID: FolderContentRoute['id']): Promise<boolean> {
  const progress = new Progress(2, function () {});
  const Route = (await getRoute(progress, true)) as SimplifiedRoute;
  progress.terminate();
  const thisRouteKey = `r_${RouteID}`;
  if (!hasOwnProperty(Route, thisRouteKey)) {
    return false;
  }
  const thisRoute = Route[thisRouteKey];

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

export async function saveLocation(folderID: Folder['id'], hash: FolderContentLocation['id']): Promise<boolean> {
  const progress = new Progress(2, function () {});
  const Location = (await getLocation(progress, 1)) as MergedLocation;
  progress.terminate();
  const thisLocationKey = `ml_${hash}`;
  if (!hasOwnProperty(Location, thisLocationKey)) {
    return false;
  }
  const thisLocation = Location[thisLocationKey];

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

  const thisFolderContentIndexArray = FolderContentIndices.get(folderKey);
  if (!thisFolderContentIndexArray) return false;

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
    FolderContentIndices.set(folderKey, thisFolderContentIndexArray);
    await lfSetItem(12, folderKey, JSON.stringify(thisFolderContentIndexArray));
    return true;
  } else {
    return false;
  }
}
