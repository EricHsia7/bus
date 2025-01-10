import { generateIdentifier } from '../../tools/index';
import { dateToRelativeTime } from '../../tools/time';
import { getCarInfo } from '../apis/getCarInfo/index';
import { getLocation } from '../apis/getLocation/index';
import { getRoute } from '../apis/getRoute/index';
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

export type RecentView = RecentViewRoute | RecentViewLocation | RecentViewBus;

export async function listRecentViews(): Promise<Array<RecentView>> {
  let result = [];
  const now = new Date().getTime();
  const keys = await lfListItemKeys(6);
  for (const key of keys) {
    const item = await lfGetItem(6, key);
    const itemObject = JSON.parse(item);
    const itemObjectTime = new Date(itemObject).getTime();
    if (now - itemObjectTime > 24 * 60 * 60 * 14 * 1000) {
      await lfRemoveItem(6, key);
    } else {
      result.push(itemObject);
    }
  }
  return result;
}

export async function logRecentView(type: RecentView['type'], param: RecentViewRoute['id'] | RecentViewLocation['hash'] | RecentViewBus['id']): void {
  const requestID = generateIdentifier('r');
  const recentViewList = await listRecentViews();
  const key = generateIdentifier('v');
  const time = new Date().toISOString();
  switch (type) {
    case 'route':
      const recentViewRoutes = recentViewList.filter((r) => r.type === 'route').map((r) => r.id);
      if (recentViewRoutes.indexOf(param) < 0) {
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
          await lfSetItem(6, key, JSON.stringify(recentViewRouteObject));
        }
      }
      break;
    case 'location':
      const recentViewLocations = recentViewList.filter((l) => l.type === 'location').map((l) => l.hash);
      if (recentViewLocations.indexOf(param) < 0) {
        const Location = await getLocation(requestID, true);
        const LocationKey = `l_${param}`;
        if (Location.hasOwnProperty(LocationKey)) {
          const thisLocation = Location[LocationKey];
          const name = thisLocation.n;
          const recentViewLocationObject: RecentViewLocation = {
            type: 'location',
            time: time,
            name: name,
            hash: param
          };
          await lfSetItem(6, key, JSON.stringify(recentViewLocationObject));
        }
      }
      break;
    case 'bus':
      const recentViewBuses = recentViewList.filter((b) => b.type === 'bus').map((b) => b.id);
      if (recentViewBuses.indexOf(param) < 0) {
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
          await lfSetItem(6, key, JSON.stringify(recentViewBusObject));
        }
      }
      break;
    default:
      break;
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

export type integratedRecentView = integratedRecentViewRoute | integratedRecentViewLocation | integratedRecentViewBus;

export type integratedRecentViews = Array<integratedRecentView>;

export async function integrateRecentViews(requestID: string): Promise<integratedRecentViews> {
  const recentViewList = await listRecentViews();
  const Route = await getRoute(requestID, true);
  let result: integratedRecentViews = [];
  for (const recentView of recentViewList) {
    const recentViewType = recentView.type;
    const recentViewTime = new Date(recentView.time);
    switch (recentViewType) {
      case 'route':
        let integratedRecentViewRoute: integratedRecentViewRoute = {};
        integratedRecentViewRoute.type = 'route';
        const thisRouteName = recentView.name;
        const thisRouteID = recentView.id;
        const thisRouteKey = `r_${thisRouteID}`;
        const thisRoute = Route[thisRouteKey];
        const thisRoutePathAttributeId = thisRoute.pid;
        integratedRecentViewRoute.id = thisRouteID;
        integratedRecentViewRoute.name = thisRouteName;
        integratedRecentViewRoute.pid = thisRoutePathAttributeId;
        integratedRecentViewRoute.time = {
          absolute: recentViewTime.getTime(),
          relative: dateToRelativeTime(recentViewTime)
        };
        result.push(integratedRecentViewRoute);
        break;
      case 'location':
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
        result.push(integratedRecentViewLocation);
        break;
      case 'bus':
        let integratedRecentViewBus: integratedRecentViewBus = {};
        integratedRecentViewBus.type = 'bus';
        const thisBusID = recentView.id;
        integratedRecentViewBus.id = thisBusID;
        const thisBusName = recentView.name;
        integratedRecentViewBus.name = thisBusName;
        integratedRecentViewLocation.time = {
          absolute: recentViewTime.getTime(),
          relative: dateToRelativeTime(recentViewTime)
        };
        result.push(integratedRecentViewLocation);
        break;
      default:
        break;
    }
  }
  return result;
}
