import { openKeyboard, closeKeyboard } from './keyboard';
import { prepareForRouteSearch } from '../../data/search/searchRoute';
import { getIconHTML } from '../icons/index';
import { dataPreloadCompleted } from '../home/index';
import { prompt_message } from '../prompt/index';
import { documentQuerySelector } from '../../tools/query-selector';
import { containPhoneticSymbols } from '../../tools/index';

const searchPageField = documentQuerySelector('.css_search_field');
const searchInputElement = documentQuerySelector('.css_search_field .css_search_head .css_search_search_input #search_route_input');
const searchResultsElement = documentQuerySelector('.css_search_field .css_search_body .css_search_results');
var currentFuse: any = false;

export function openSearchPage(): void {
  if (dataPreloadCompleted) {
    searchPageField.setAttribute('displayed', 'true');
    openKeyboard();
    prepareForRouteSearch().then((preparation) => {
      currentFuse = preparation;
    });
  } else {
    prompt_message('資料還在下載中');
  }
}

export function closeSearchPage(): void {
  closeKeyboard();
  searchPageField.setAttribute('displayed', 'false');
}

export function updateSearchResult(query: string): void {
  if (!containPhoneticSymbols(query) && currentFuse) {
    var typeToIcon = ['route', 'location_on'];
    var searchResults = currentFuse.search(query).slice(0, 30);
    var html = [];
    for (var result of searchResults) {
      var name = result.item.n;
      var typeIcon = getIconHTML(typeToIcon[result.item.type]);
      var onclickScript = '';
      if (result.item.type === 0) {
        onclickScript = `bus.route.openRoute(${result.item.id}, [${result.item.pid.join(',')}])`;
      }
      if (result.item.type === 1) {
        onclickScript = `bus.location.openLocation('${result.item.hash}')`; //openLocation
      }
      html.push(`<div class="css_search_search_result" onclick="${onclickScript}"><div class="css_search_search_result_type">${typeIcon}</div><div class="css_search_search_result_route_name">${name}</div></div>`);
    }
    searchResultsElement.innerHTML = html.join('');
  }
}
