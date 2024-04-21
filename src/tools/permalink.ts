import { searchRouteByName, searchRouteByRouteID } from '../data/search/searchRoute.ts';
import { openRoute } from '../interface/route/index.ts';
import { openLocation } from '../interface/location/index.ts';
import { encodeHexToShortString, decodeShortStringToHex } from './index.ts';
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
      if (type === 0) {
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
      }
      if (type === 1) {
        var hash = decodeShortStringToHex(array[1], 32);
        openLocation(hash);
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
  if (type === 1) {
    link.searchParams.set('permalink', `1@${encodeHexToShortString(approach.hash, 22)}`);
  }
  return decodeURIComponent(link.toString());
}
