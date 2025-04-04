import { searchRouteByName, searchRouteByRouteID } from '../data/search/index';
import { openLocation } from '../interface/location/index';
import { openRoute } from '../interface/route/index';

export function openPermalink(): void {
  const current_url = new URL(location.href);
  const permalinkValue = current_url.searchParams.get('permalink');
  if (permalinkValue !== null) {
    const permalinkString = String(permalinkValue);
    if (/^[0-1]\@(.*)(\~.*){0,1}/.test(permalinkString)) {
      const values = permalinkString.split(/[\@\~]/);
      const type = parseInt(values[0]);
      //route
      switch (type) {
        case 0:
          searchRouteByRouteID(parseInt(values[1], 16)).then((result) => {
            if (result !== false) {
              openRoute(result.id, result.pid);
            } else {
              searchRouteByName(values[2]).then((result2) => {
                if (result2.length > 0) {
                  openRoute(result2[0].id, result2[0].pid);
                }
              });
            }
          });
          break;
        case 1:
          openLocation(values[1]);
          break;
        default:
          break;
      }
    }
  }
}

export function getPermalink(type: number, approach: object): string {
  const link = new URL('https://erichsia7.github.io/bus/');
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
