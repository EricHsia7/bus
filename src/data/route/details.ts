import { MaterialSymbol } from '../../interface/icons/material-symbols-type';
import { openRouteCalendar } from '../../interface/route-calendar/index';
import { shareRoutePermalink, showRoutePermalinkQRCode } from '../../interface/route-details/index';
import { openSaveToFolder } from '../../interface/save-to-folder/index';
import { hasOwnProperty } from '../../tools/index';
import { Progress, ProgressCallback } from '../../tools/progress';
import { getRoute, SimplifiedRoute, SimplifiedRouteItem } from '../apis/getRoute/index';

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
  const progress = new Progress(2, progressCallback);
  const Route = (await getRoute(progress, true)) as SimplifiedRoute;
  progress.terminate();
  const thisRouteKey = `r_${RouteID}`;
  if (!hasOwnProperty(Route, thisRouteKey)) {
    return {
      actions: [],
      actionsQuantity: 0,
      RouteID: RouteID
    };
  }

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
