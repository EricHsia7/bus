import { generateIdentifier } from '../../tools/index';
import { dateToRelativeTime } from '../../tools/time';
import { getCarInfo } from '../apis/getCarInfo/index';
import { getLocation, MergedLocation } from '../apis/getLocation/index';
import { getRoute } from '../apis/getRoute/index';
import { deleteDataReceivingProgress, deleteDataUpdateTime } from '../apis/loader';
import { lfGetItem, lfListItemKeys, lfRemoveItem, lfSetItem } from '../storage/index';

interface RecentViewRoute {
  type: 'route';
  time: string;
  name: string;
  id: number;
}

interface RecentViewLocation {
  type: 'location';
  time: string;
  name: string;
  hash: string;
}

interface RecentViewBus {
  type: 'bus';
  time: string;
  name: string;
  id: number;
}

interface RecentViewEmpty {
  type: 'empty';
  time: string;
  name: string;
  id: number;
}

export type RecentView = RecentViewRoute | RecentViewLocation | RecentViewBus | RecentViewEmpty;

export type RecentViewArray = Array<RecentView>;

export async function listRecentViews(): Promise<RecentViewArray> {
  const result = [];
  const now = new Date().getTime();
  const keys = await lfListItemKeys(8);
  for (const key of keys) {
    const item = await lfGetItem(8, key);
    const itemObject = JSON.parse(item) as RecentView;
    const itemObjectTime = new Date(itemObject.time).getTime();
    if (now - itemObjectTime <= 24 * 60 * 60 * 14 * 1000) {
      result.push(itemObject);
    }
  }
  if (result.length === 0) {
    result.push({
      type: 'empty',
      time: new Date().toISOString(),
      name: '沒有內容',
      id: 0
    });
  }
  return result;
}

export async function discardExpiredRecentViews() {
  const now = new Date().getTime();
  const keys = await lfListItemKeys(8);
  for (const key of keys) {
    const item = await lfGetItem(8, key);
    const itemObject = JSON.parse(item) as RecentView;
    const itemObjectTime = new Date(itemObject.time).getTime();
    if (now - itemObjectTime > 24 * 60 * 60 * 14 * 1000) {
      await lfRemoveItem(8, key);
    }
  }
}

export async function logRecentView(type: RecentView['type'], param: RecentViewRoute['id'] | RecentViewLocation['hash'] | RecentViewBus['id']) {
  const requestID = generateIdentifier();
  const key = `${type}_${param}`;
  const time = new Date().toISOString();
  const existingJSON = await lfGetItem(8, key);
  if (existingJSON) {
    const existingRecentViewObject = JSON.parse(existingJSON) as RecentView;
    existingRecentViewObject.time = time;
    await lfSetItem(8, key, JSON.stringify(existingRecentViewObject));
  } else {
    switch (type) {
      case 'route': {
        const Route = await getRoute(requestID, true);
        const routeKey = `r_${param}`;
        if (Route.hasOwnProperty(routeKey)) {
          const thisRoute = Route[routeKey];
          const name = thisRoute.n;
          const recentViewRouteObject: RecentViewRoute = {
            type: 'route',
            time: time,
            name: name,
            id: param
          };
          await lfSetItem(8, key, JSON.stringify(recentViewRouteObject));
        }
        break;
      }
      case 'location': {
        const Location = (await getLocation(requestID, 1)) as MergedLocation;
        const LocationKey = `ml_${param}`;
        if (Location.hasOwnProperty(LocationKey)) {
          const thisLocation = Location[LocationKey];
          const name = thisLocation.n;
          const recentViewLocationObject: RecentViewLocation = {
            type: 'location',
            time: time,
            name: name,
            hash: param
          };
          await lfSetItem(8, key, JSON.stringify(recentViewLocationObject));
        }
        break;
      }
      case 'bus': {
        const CarInfo = await getCarInfo(requestID, true);
        const CarKey = `c_${param}`;
        if (CarInfo.hasOwnProperty(CarKey)) {
          const thisCar = CarInfo[CarKey];
          const name = thisCar.CarNum;
          const recentViewBusObject: RecentViewBus = {
            type: 'bus',
            time: time,
            name: name,
            id: param
          };
          await lfSetItem(8, key, JSON.stringify(recentViewBusObject));
        }
        break;
      }
      default:
        break;
    }
  }
}

export async function getRecentView(type: RecentView['type'], param: RecentViewRoute['id'] | RecentViewLocation['hash'] | RecentViewBus['id']): Promise<RecentView | boolean> {
  const key = `${type}_${param}`;
  const existingRecentViewRoute = await lfGetItem(8, key);
  if (existingRecentViewRoute) {
    return JSON.parse(existingRecentViewRoute);
  } else {
    return false;
  }
}

interface integratedRecentViewTime {
  absolute: string;
  relative: string;
}

export interface integratedRecentViewRoute {
  type: 'route';
  time: integratedRecentViewTime;
  name: string;
  id: number;
  pid: Array<number>;
}

export interface integratedRecentViewLocation {
  type: 'location';
  time: integratedRecentViewTime;
  name: string;
  hash: string;
}

export interface integratedRecentViewBus {
  type: 'bus';
  time: integratedRecentViewTime;
  name: string;
  id: number;
}

export interface integratedRecentViewEmpty {
  type: 'empty';
  time: integratedRecentViewTime;
  name: string;
  id: number;
}

export type integratedRecentView = integratedRecentViewRoute | integratedRecentViewLocation | integratedRecentViewBus | integratedRecentViewEmpty;

export interface integratedRecentViews {
  items: Array<integratedRecentView>;
  itemQuantity: number;
  dataUpdateTime: number;
}

export async function integrateRecentViews(requestID: string): Promise<integratedRecentViews> {
  const recentViewList = await listRecentViews();
  const Route = await getRoute(requestID, true);
  let items: Array<integratedRecentView> = [];
  let itemQuantity: number = 0;
  for (const recentView of recentViewList) {
    const recentViewType = recentView.type;
    const recentViewTime = new Date(recentView.time);
    switch (recentViewType) {
      case 'route': {
        let integratedRecentViewRoute: integratedRecentViewRoute = {};
        integratedRecentViewRoute.type = 'route';
        const thisRouteName = recentView.name;
        integratedRecentViewRoute.name = thisRouteName;
        const thisRouteID = recentView.id;
        integratedRecentViewRoute.id = thisRouteID;
        const thisRouteKey = `r_${thisRouteID}`;
        const thisRoute = Route[thisRouteKey];
        const thisRoutePathAttributeId = thisRoute.pid;
        integratedRecentViewRoute.pid = thisRoutePathAttributeId;
        integratedRecentViewRoute.time = {
          absolute: recentViewTime.getTime(),
          relative: dateToRelativeTime(recentViewTime)
        };
        items.push(integratedRecentViewRoute);
        itemQuantity += 1;
        break;
      }
      case 'location': {
        let integratedRecentViewLocation: integratedRecentViewLocation = {};
        integratedRecentViewLocation.type = 'location';
        const thisLocationHash = recentView.hash;
        integratedRecentViewLocation.hash = thisLocationHash;
        const thisLocationName = recentView.name;
        integratedRecentViewLocation.name = thisLocationName;
        integratedRecentViewLocation.time = {
          absolute: recentViewTime.getTime(),
          relative: dateToRelativeTime(recentViewTime)
        };
        items.push(integratedRecentViewLocation);
        itemQuantity += 1;
        break;
      }
      case 'bus': {
        let integratedRecentViewBus: integratedRecentViewBus = {};
        integratedRecentViewBus.type = 'bus';
        const thisBusID = recentView.id;
        integratedRecentViewBus.id = thisBusID;
        const thisBusName = recentView.name;
        integratedRecentViewBus.name = thisBusName;
        integratedRecentViewBus.time = {
          absolute: recentViewTime.getTime(),
          relative: dateToRelativeTime(recentViewTime)
        };
        items.push(integratedRecentViewBus);
        itemQuantity += 1;
        break;
      }
      case 'empty': {
        let integratedRecentViewEmpty: integratedRecentViewEmpty = {};
        integratedRecentViewEmpty.type = 'empty';
        const thisEmptyID = recentView.id;
        integratedRecentViewEmpty.id = thisEmptyID;
        const thisEmptyName = recentView.name;
        integratedRecentViewEmpty.name = thisEmptyName;
        integratedRecentViewEmpty.time = {
          absolute: recentViewTime.getTime(),
          relative: dateToRelativeTime(recentViewTime)
        };
        items.push(integratedRecentViewEmpty);
        itemQuantity = 1;
        break;
      }
      default:
        break;
    }
  }
  items.sort(function (a, b) {
    return b.time.absolute - a.time.absolute;
  });

  const result: integratedRecentViews = {
    items: items,
    itemQuantity: itemQuantity,
    dataUpdateTime: new Date().getTime()
  };
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  return result;
}
