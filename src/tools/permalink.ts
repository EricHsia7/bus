import { searchRouteByName, searchRouteByRouteID } from '../data/search/searchRoute';
import { openRoute } from '../interface/route/index';
import { openLocation } from '../interface/location/index';
const PermalinkTypes = ['route', 'location'];

export function openPermalink(): void {
  var current_url = new URL(location.href);
  var permalinkValue = current_url.searchParams.get('permalink');
  if (!(permalinkValue === null)) {
    var permalinkString = String(permalinkValue);
    if (/^[0-1]\@(.*)(\~.*){0,1}/.test(permalinkString)) {
      var array = permalinkString.split(/[\@\~]/);
      var type = parseInt(array[0]);
      //route
      switch (type) {
        case 0:
          searchRouteByRouteID(parseInt(array[1], 16)).then((e) => {
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
          break;
        case 1:
          var hash = array[1];
          openLocation(hash);
          break;
        default:
          break;
      }
    }
  }
}

export function getPermalink(type: number, approach: object): string {
  var link = new URL('https://erichsia7.github.io/bus/');
  switch (type) {
    case 0:
      link.searchParams.set('permalink', `0@${parseInt(approach.id).toString(16)}~${approach.name}`);
      break;
    case 1:
      link.searchParams.set('permalink', `1@${approach.hash}`);
      break;
    default:
      break;
  }
  return decodeURIComponent(link.toString());
}
