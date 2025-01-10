import { generateIdentifier } from '../../tools/index';
import { lfGetItem, lfListItemKeys, lfRemoveItem, lfSetItem } from '../storage/index';

interface RecentViewRoute {
  type: 'Route';
  time: string;
  RouteID: number;
}

interface RecentViewLocation {
  type: 'Location';
  time: string;
  hash: string;
}

interface RecentViewBus {
  type: 'Bus';
  time: string;
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
      const RecentViewRouteObject: RecentViewRoute = {
        type: 'Route',
        time: time,
        RouteID: param
      };
      if (RecentViewRoutes.indexOf(param) < 0) {
        await lfSetItem(6, key, JSON.stringify(RecentViewRouteObject));
      }
      break;
    case 'Location':
      const RecentViewLocations = RecentViews.filter((l) => l.type === 'Location').map((l) => l.hash);
      const RecentViewLocationObject: RecentViewLocation = {
        type: 'Location',
        time: time,
        hash: param
      };
      if (RecentViewLocations.indexOf(param) < 0) {
        await lfSetItem(6, key, JSON.stringify(RecentViewLocationObject));
      }
      break;
    case 'Bus':
      const RecentViewBuses = RecentViews.filter((b) => b.type === 'Bus').map((b) => b.id);
      const RecentViewBusObject: RecentViewBus = {
        type: 'Bus',
        time: time,
        id: param
      };
      if (RecentViewBuses.indexOf(param) < 0) {
        await lfSetItem(6, key, JSON.stringify(RecentViewBusObject));
      }
      break;
    default:
      break;
  }
}
