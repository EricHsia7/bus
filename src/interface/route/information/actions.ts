import { searchRouteByRouteID } from '../../../data/search/searchRoute.ts';
import { getPermalink } from '../../../tools/permalink.ts';
import { prompt_message } from '../../prompt/index.ts';

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
          prompt_message('已分享路線連結');
        })
        .catch((e) => {
          prompt_message('已取消分享連結');
          console.error(e);
        });
    }
  }
}
