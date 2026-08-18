import { MaterialSymbol } from '../../interface/icons/material-symbols-type';
import { openMap } from '../../interface/map';
import { openRouteCalendar } from '../../interface/route-calendar/index';
import { shareRoutePermalink, showRoutePermalinkQRCode } from '../../interface/route-details/index';
import { openSaveToFolder } from '../../interface/save-to-folder/index';
import { hasOwnProperty } from '../../tools/index';
import { Progress, ProgressCallback } from '../../tools/progress';
import { getBusShape, SimplifiedBusShape } from '../apis/getBusShape';
import { getRoute, SimplifiedRoute, SimplifiedRouteItem } from '../apis/getRoute/index';
import { MapView } from '../map/views';

/*
function findProvider(Provider: Provider, providerId: number): ProviderItem {
  let thisProvider = {} as ProviderItem;
  for (const item of Provider) {
    if (item.id === providerId) {
      thisProvider = item;
    }
  }
  return thisProvider;
}
*/

// {
//   key: 'provider_name',
//   icon: 'corporate_fare',
//   value: thisProvider.nameZn
// },
// {
//   key: 'provider_phone',
//   icon: 'call',
//   value: thisProvider.phoneInfo
// },
// {
//   key: 'provider_email',
//   icon: 'alternate_email',
//   value: thisProvider.email
// }

export interface IntegratedRouteDetailsAction {
  icon: MaterialSymbol;
  action: Function;
  name: string;
}

export type IntegratedRouteDetailsActionArray = Array<IntegratedRouteDetailsAction>;

export interface IntegratedRouteDetails {
  actions: IntegratedRouteDetailsActionArray;
  actionsQuantity: number;
  RouteID: SimplifiedRouteItem['id'];
}

export async function integrateRouteDetails(RouteID: SimplifiedRouteItem['id'], progressCallback: ProgressCallback): Promise<IntegratedRouteDetails> {
  const progress = new Progress(2 + 2, progressCallback);
  const [Route, BusShape] = (await Promise.all([getRoute(progress, true), getBusShape(progress)])) as [SimplifiedRoute, SimplifiedBusShape];
  progress.terminate();

  const thisRouteKey = `r_${RouteID}`;
  if (!hasOwnProperty(Route, thisRouteKey)) {
    return {
      actions: [],
      actionsQuantity: 0,
      RouteID: RouteID
    };
  }
  const thisRoute = Route[thisRouteKey];

  const views: Array<MapView> = [];
  if (hasOwnProperty(BusShape, thisRouteKey)) {
    const thisBusShape = BusShape[thisRouteKey];
    for (let i = 0; i < 2; i++) {
      const [minLon, minLat, maxLon, maxLat] = thisBusShape[i].bound;
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
  }

  // TODO: add stops

  const actions: IntegratedRouteDetailsActionArray = [
    // save to folder
    {
      icon: 'folder',
      name: '儲存',
      action: function () {
        openSaveToFolder('route', [RouteID], null);
      }
    },
    // calendar
    {
      icon: 'calendar_today',
      name: '時刻表',
      action: function () {
        openRouteCalendar(RouteID);
      }
    },
    // map
    {
      icon: 'map',
      name: '路線圖',
      action: function () {
        openMap({
          selection: [RouteID],
          views
        });
      }
    },
    // share
    {
      icon: 'ios_share',
      name: '分享',
      action: function () {
        shareRoutePermalink(RouteID);
      }
    },
    // qrcode
    {
      icon: 'qr_code_2',
      name: '二維條碼',
      action: function () {
        showRoutePermalinkQRCode(RouteID);
      }
    }
  ];

  const result: IntegratedRouteDetails = {
    actions: actions,
    actionsQuantity: actions.length,
    RouteID: RouteID
  };
  return result;
}
