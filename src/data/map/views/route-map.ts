import { hasOwnProperty } from '../../../tools';
import { findGlobalExtrema } from '../../../tools/math';
import { Progress } from '../../../tools/progress';
import { getBusShape, SimplifiedBusShape } from '../../apis/getBusShape';
import { getRoute, SimplifiedRoute } from '../../apis/getRoute';
import { IntegratedRouteMapView, MapView } from './index';

export async function integarteRouteMapView(RouteID: number): Promise<IntegratedRouteMapView> {
  const progress = new Progress(4, function () {});
  const [Route, BusShape] = (await Promise.all([getRoute(progress, true), getBusShape(progress)])) as [SimplifiedRoute, SimplifiedBusShape];

  const views: Array<MapView> = [];
  const thisRouteKey = `r_${RouteID}`;
  if (!hasOwnProperty(Route, thisRouteKey)) {
    return {
      type: 'route',
      selection: [],
      views: []
    };
  }
  const thisRoute = Route[thisRouteKey];

  if (!hasOwnProperty(BusShape, thisRouteKey)) {
    return {
      type: 'route',
      selection: [],
      views: []
    };
  }
  const thisBusShape = BusShape[thisRouteKey];
  for (let i = 0; i < 2; i++) {
    const [minLon, maxLon] = findGlobalExtrema(thisBusShape[i].longtitudes);
    const [minLat, maxLat] = findGlobalExtrema(thisBusShape[i].latitudes);
    const thisRouteDeparture = thisRoute.dep;
    const thisRouteDestination = thisRoute.des;
    const thisRouteDirection = [thisRouteDestination, thisRouteDeparture][i];
    const name = `${thisRoute.n} - 往${thisRouteDirection}`;
    views.push({
      type: 'box',
      icon: 'route',
      name: name,
      minLon,
      minLat,
      maxLon,
      maxLat,
      sources: [0, 1] // labels and routes
    });
  }

  // TODO: add stops

  return {
    type: 'route',
    selection: [RouteID],
    views
  };
}
