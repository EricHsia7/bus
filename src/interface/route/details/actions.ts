import { searchRouteByRouteID } from '../../../data/search/index';
import { getPermalink } from '../../../tools/permalink';
import { promptMessage } from '../../prompt/index';
import { openQRCode } from '../../qrcode/index';

export async function shareRoutePermalink(RouteID: number) {
  const thisRoute = await searchRouteByRouteID(RouteID);
  if (thisRoute !== false) {
    const link = getPermalink(0, {
      id: RouteID,
      name: thisRoute.n
    });
    if (navigator.share) {
      navigator
        .share({
          title: thisRoute.n,
          url: link
        })
        .then(() => {
          promptMessage('已分享路線連結', 'link');
        })
        .catch((e) => {
          promptMessage('已取消分享連結', 'cancel');
          console.error(e);
        });
    }
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
