import { generateIdentifier } from '../../tools/index';
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
  const RecentViews = await listRecentViews();
  const key = generateIdentifier('v');
  const time = new Date().toISOString();
  switch (type) {
    case 'Route':
      const RecentViewRoutes = RecentViews.filter((r) => r.type === 'route').map((r) => r.id);
      if (RecentViewRoutes.indexOf(param) < 0) {
        const Route = await getRoute(requestID, true);
        const RouteKey = `r_${param}`;
        if (Route.hasOwnProperty(RouteKey)) {
          const thisRoute = Route[RouteKey];
          const name = thisRoute.n;
          const RecentViewRouteObject: RecentViewRoute = {
            type: 'route',
            time: time,
            name: name,
            id: param
          };
          await lfSetItem(6, key, JSON.stringify(RecentViewRouteObject));
        }
      }
      break;
    case 'Location':
      const RecentViewLocations = RecentViews.filter((l) => l.type === 'location').map((l) => l.hash);
      if (RecentViewLocations.indexOf(param) < 0) {
        const Location = await getLocation(requestID, true);
        const LocationKey = `l_${param}`;
        if (Location.hasOwnProperty(LocationKey)) {
          const thisLocation = Location[LocationKey];
          const name = thisLocation.n;
          const RecentViewLocationObject: RecentViewLocation = {
            type: 'location',
            time: time,
            name: name,
            hash: param
          };
          await lfSetItem(6, key, JSON.stringify(RecentViewLocationObject));
        }
      }
      break;
    case 'Bus':
      const RecentViewBuses = RecentViews.filter((b) => b.type === 'bus').map((b) => b.id);
      if (RecentViewBuses.indexOf(param) < 0) {
        const CarInfo = await getCarInfo(requestID, true);
        const CarKey = `c_${param}`;
        if (CarInfo.hasOwnProperty(CarKey)) {
          const thisCar = CarInfo[CarKey];
          const name = thisCar.CarNum;
          const RecentViewBusObject: RecentViewBus = {
            type: 'bus',
            time: time,
            name: name,
            id: param
          };
          await lfSetItem(6, key, JSON.stringify(RecentViewBusObject));
        }
      }
      break;
    default:
      break;
  }
}
