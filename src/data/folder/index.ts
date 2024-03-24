import { getStop } from '../apis/getStop.ts';
import { getLocation } from '../apis/getLocation.ts';
import { getRoute } from '../apis/getRoute.ts';

var folders = [
  {
    name: 'Saved Stop',
    default: true,
    storeIndex: 4,
    contentType: ['stop'],
    id: 0
  }
];

export async function saveStop(folderID: number, StopID: number) {
  const requestID = `r_${md5(Math.random() * new Date().getTime())}`;
  var Stop = await getStop(requestID);
  var Location = await getLocation(requestID);
  var Route = await getRoute(requestID);
  var thisStop = Stop[`s_${StopID}`];
  var thisLocation = Location[`l_${thisStop.stopLocationId}`];
  var thisStopName = thisLocation.n;
  var thisStopRouteID = thisLocation.r;
  var thisRoute = Route[`r_${thisStopRouteID}`];
  var thisRouteName = thisRoute.n;
  var thisRouteDeparture = thisRoute.dep;
  var thisRouteDestination = thisRoute.des;
  var object = {
    id: StopID,
    name: thisStopName,
    route: {
      name: thisRouteName,
      endPoints: {
        departure: thisRouteDeparture,
        destination: thisRouteDestination
      },
      id: thisStopRouteID
    }
  };
  
}
