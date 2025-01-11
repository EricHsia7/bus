export async function logRecentView(type: RecentView['type'], param: RecentViewRoute['id'] | RecentViewLocation['hash'] | RecentViewBus['id']): Promise<void> {
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
      } else {
        // Update the timestamp of the existing item
        const existingKey = recentViewList.find((r) => r.type === 'route' && r.id === param).key;
        const existingItem = await lfGetItem(6, existingKey);
        const updatedItem = Object.assign(JSON.parse(existingItem), { time: time });
        await lfSetItem(6, existingKey, JSON.stringify(updatedItem));
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
      } else {
        // Update the timestamp of the existing item
        const existingKey = recentViewList.find((l) => l.type === 'location' && l.hash === param).key;
        const existingItem = await lfGetItem(6, existingKey);
        const updatedItem = Object.assign(JSON.parse(existingItem), { time: time });
        await lfSetItem(6, existingKey, JSON.stringify(updatedItem));
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
      } else {
        // Update the timestamp of the existing item
        const existingKey = recentViewList.find((b) => b.type === 'bus' && b.id === param).key;
        const existingItem = await lfGetItem(6, existingKey);
        const updatedItem = Object.assign(JSON.parse(existingItem), { time: time });
        await lfSetItem(6, existingKey, JSON.stringify(updatedItem));
      }
      break;
    default:
      break;
  }
}
