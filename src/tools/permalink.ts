import { searchRouteByName } from '../data/search/searchRoute.ts';
import { openRoute } from '../interface/route/index.ts';

const PermalinkTypes = ['route', 'route_info'];

export function openPermalink(): void {
  var current_url = new URL(location.href);
  var permalinkValue = current_url.searchParams.get('permalink');
  if (!(permalinkValue === null)) {
    var permalinkString = String(permalinkValue);
    if (/^[0-1]\:.*/.test(permalinkString)) {
      var array = permalinkString.split(':');
      var type = parseInt(array[0]);
      //route
      if (type === 0) {
        var route_name = array[1];
        searchRouteByName(route_name).then((e) => {
          openRoute(e[0].id, e[0].pid);
        });
      }
      current_url.searchParams.get('route_name');
    }
  }
}
