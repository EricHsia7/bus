import { searchRouteByName, searchRouteByRouteID } from '../data/search/searchRoute.ts';
import { openRoute } from '../interface/route/index.ts';

const PermalinkTypes = ['route', 'route_info'];

export function openPermalink(): void {
  var current_url = new URL(location.href);
  var permalinkValue = current_url.searchParams.get('permalink');
  if (!(permalinkValue === null)) {
    var permalinkString = String(permalinkValue);
    if (/^[0-1]\@(.*)(\~.*){0,1}/.test(permalinkString)) {
      var array = permalinkString.split(/[\@\~]/);
      var type = parseInt(array[0], 16);
      //route
      if (type === 0) {
        var route_name = array[1];
        searchRouteByRouteID(route_name).then((e) => {
          if (e.length > 0) {
            openRoute(e[0].id, e[0].pid);
          } else {
            searchRouteByName(array[2]).then((p) => {
              if (p.length > 0) {
                openRoute(p[0].id, p[0].pid);
              }
            });
          }
        });
      }
      current_url.searchParams.get('route_name');
    }
  }
}

export function getPermalink(type: number, approach: object): string {
  var link = new URL('https://erichsia7.github.io/bus/');
  if (type === 0) {
    link.searchParams.set('permalink', `0@${parseInt(approach.id).toString(16)}~${approach.name}`);
  }
  return decodeURIComponent(link.toString());
}
