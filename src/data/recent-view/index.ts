import { generateIdentifier } from '../../tools/index';
import { getCarInfo } from '../apis/getCarInfo/index';
import { getLocation } from '../apis/getLocation/index';
import { searchRouteByRouteID } from '../search/index';
import { lfGetItem, lfListItemKeys, lfRemoveItem, lfSetItem } from '../storage/index';

interface RecentViewRoute {
  type: 'Route';
  time: string;
  title: string;
  RouteID: number;
}

interface RecentViewLocation {
  type: 'Location';
  time: string;
  title: string;
  hash: string;
}

interface RecentViewBus {
  type: 'Bus';
  time: string;
  title: string;
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

export async function logRecentView(type: RecentView['type'], param: RecentViewRoute['RouteID'] | RecentViewLocation['hash'] | RecentViewBus['id']): void {
  const RecentViews = await listRecentViews();
  const key = generateIdentifier('v');
  const time = new Date().toISOString();
  switch (type) {
    case 'Route':
      const RecentViewRoutes = RecentViews.filter((r) => r.type === 'Route').map((r) => r.RouteID);
      if (RecentViewRoutes.indexOf(param) < 0) {
        const searchedRoutes = await searchRouteByRouteID(param);
        if (searchedRoutes.length > 0) {
          const thisRoute = searchedRoutes[0];
          const title = thisRoute.n;
          const RecentViewRouteObject: RecentViewRoute = {
            type: 'Route',
            time: time,
            title: title,
            RouteID: param
          };
          await lfSetItem(6, key, JSON.stringify(RecentViewRouteObject));
        }
      }
      break;
    case 'Location':
      const RecentViewLocations = RecentViews.filter((l) => l.type === 'Location').map((l) => l.hash);
      if (RecentViewLocations.indexOf(param) < 0) {
        const LocationKey = `l_${param}`;
        const requestID = generateIdentifier('r');
        const Location = await getLocation(requestID, true);
        if (Location.hasOwnProperty(LocationKey)) {
          const thisLocation = Location[LocationKey];
          const title = thisLocation.n;
          const RecentViewLocationObject: RecentViewLocation = {
            type: 'Location',
            time: time,
            title: title,
            hash: param
          };
          await lfSetItem(6, key, JSON.stringify(RecentViewLocationObject));
        }
      }
      break;
    case 'Bus':
      const RecentViewBuses = RecentViews.filter((b) => b.type === 'Bus').map((b) => b.id);
      if (RecentViewBuses.indexOf(param) < 0) {
        const CarKey = `b_${param}`;
        const requestID = generateIdentifier('r');
        const CarInfo = await getCarInfo(requestID, true);
        if (CarInfo.hasOwnProperty(CarKey)) {
          const thisCar = CarInfo[CarKey];
          const title = thisCar.CarNum;
          const RecentViewBusObject: RecentViewBus = {
            type: 'Bus',
            time: time,
            title: title,
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
