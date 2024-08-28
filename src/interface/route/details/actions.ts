import { searchRouteByRouteID } from '../../../data/search/searchRoute';
import { getPermalink } from '../../../tools/permalink';
import { promptMessage } from '../../prompt/index';

export async function shareRoutePermalink(RouteID: number): void {
  var search = await searchRouteByRouteID(RouteID);
  if (search.length > 0) {
    var link = getPermalink(0, {
      id: RouteID,
      name: search[0].n
    });
    if (navigator.share) {
      navigator
        .share({
          title: search[0].n,
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
