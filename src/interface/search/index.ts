import { openKeyboard, closeKeyboard } from './keyboard.ts';
import { prepareForSearch } from '../../data/search/searchRoute.ts';
import { icons } from '../icons/index.ts';
import { dataPreloadCompleted } from '../home/index.ts';
import { prompt_message } from '../prompt/index.ts';
import { documentQuerySelector } from '../../tools/query-selector.ts';

const searchPageField = documentQuerySelector('.css_search_field');
const searchInputElement = documentQuerySelector('.css_search_field .css_search_head .css_search_search_input #search_route_input');
const searchResultsElement = documentQuerySelector('.css_search_field .css_search_body .css_search_results');
var currentFuse;

export function openSearchPage(): void {
  if (dataPreloadCompleted) {
    searchPageField.setAttribute('displayed', 'true');
    openKeyboard();
    prepareForSearch().then((preparation) => {
      currentFuse = preparation;
    });
  } else {
    prompt_message('資料還在下載中', 1200);
  }
}

export function closeSearchPage(): void {
  closeKeyboard();
  searchPageField.setAttribute('displayed', 'false');
}

function containPhoneticSymbols(string: string): boolean {
  var regex = /[\u3100-\u312F\ˇ\ˋ\ˊ\˙]/gm;
  if (regex.test(string)) {
    return true;
  } else {
    return false;
  }
}

export function updateSearchResult(query: string): void {
  if (!containPhoneticSymbols(query)) {
    var typeToIcon = ['route', 'location'];
    var searchResults = currentFuse.search(query).slice(0, 30);
    var html = [];
    for (var result of searchResults) {
      var name = result.item.n;
      var typeIcon = icons[typeToIcon[result.item.type]];
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
