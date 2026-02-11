import { MaterialSymbols } from '../../interface/icons/material-symbols-type';
import { showLocationPermalinkQRCode } from '../../interface/location/details/index';
import { openRouteCalendar } from '../../interface/route-calendar/index';
import { shareRoutePermalink } from '../../interface/route-details/index';
import { openSaveToFolder } from '../../interface/save-to-folder/index';
import { getRoute, SimplifiedRoute, SimplifiedRouteItem } from '../apis/getRoute/index';
import { deleteDataReceivingProgress, deleteDataUpdateTime } from '../apis/loader';

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
  icon: MaterialSymbols;
  action: Function;
  key: string;
  name: string;
}

export type IntegratedRouteDetailsActionArray = Array<IntegratedRouteDetailsAction>;

export interface IntegratedRouteDetails {
  actions: IntegratedRouteDetailsActionArray;
  actionsQuantity: number;
  RouteID: SimplifiedRouteItem['id'];
}

export async function integrateRouteDetails(RouteID: SimplifiedRouteItem['id'], PathAttributeId: SimplifiedRouteItem['pid'], requestID: string): Promise<IntegratedRouteDetails> {
  const Route = (await getRoute(requestID, true)) as SimplifiedRoute;
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  const thisRouteKey = `r_${RouteID}`;
  let thisRoute = {} as SimplifiedRouteItem;
  if (hasOwnProperty(Route, thisRouteKey)) {
    thisRoute = Route[thisRouteKey];
  } else {
    return {
      actions: [],
      actionsQuantity: 0,
      RouteID: RouteID
    };
  }

  const actions: IntegratedLocationDetailsActionArray = [
    {
      icon: 'folder',
      name: '儲存',
      key: 'save-to-folder',
      action: function () {
        openSaveToFolder('route', [RouteID], null);
      }
    },
    {
      icon: 'calendar_today',
      name: '時刻表',
      key: 'calendar',
      action: function () {
        openRouteCalendar(PathAttributeId);
      }
    },
    {
      icon: 'ios_share',
      name: '分享',
      key: 'permalink',
      action: function () {
        shareRoutePermalink(RouteID);
      }
    },
    {
      icon: 'qr_code_2',
      name: '二維條碼',
      key: 'permalink-qr-code',
      action: function () {
        showLocationPermalinkQRCode(hash);
      }
    }
  ];
  const result: IntegratedLocationDetails = {
    actions: actions,
    actionsQuantity: actions.length,
    hash: hash
  };
  return result;
}
