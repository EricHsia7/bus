import { searchRouteByRouteID } from '../../../data/search/index';
import { getPermalink } from '../../../tools/permalink';
import { shareLink } from '../../../tools/share';
import { openQRCode } from '../../qrcode/index';

export async function shareRoutePermalink(RouteID: number) {
  const thisRoute = await searchRouteByRouteID(RouteID);
  if (thisRoute !== false) {
    const link = getPermalink(0, {
      id: RouteID,
      name: thisRoute.n
    });
    shareLink(thisRoute.n, link);
  }
}

export async function showRoutePermalinkQRCode(RouteID: number) {
  const thisRoute = await searchRouteByRouteID(RouteID);
  if (thisRoute !== false) {
    const link = getPermalink(0, {
      id: RouteID,
      name: thisRoute.n
    });
    openQRCode(link);
  }
}
