import { openKeyboard, closeKeyboard } from './keyboard.ts';
import { prepareForSearch } from '../../data/search/searchRoute.ts';
import { icons } from '../icons/index.ts';

const searchPageField = document.querySelector('.search_page_field');
const searchInputElement = document.querySelector('.search_page_field .search_page_head .search_page_search_input #search_route_input');
const searchResultsElement = document.querySelector('.search_page_field .search_page_body .search_page_search_results');
var currentFuse;

export function openSearchPage(): void {
  searchPageField.setAttribute('displayed', 'true');
  openKeyboard();
  prepareForSearch().then((preparation) => {
    currentFuse = preparation;
  });
}

export function closeSearchPage(): void {
  closeKeyboard();
  searchPageField.setAttribute('displayed', 'false');
}

function containPhoneticSymbols(string: string): boolean {
var regex = /[\u3100-\u312F\ˇ\ˋ\ˊ\˙]/gm
if(regex.test(string)) {
return true
}
else {
return false
}
}

export function updateSearchResult(query: string): void {
if(!containPhoneticSymbols(query)) {
  var typeToIcon = ['route', 'location'];
  var searchResults = currentFuse.search(query);
  var html = [];
  for (var result of searchResults) {
    var name = result.item.n;
    var typeIcon = icons[typeToIcon[result.item.type]];
    var onclickScript = '';
    if (result.item.type === 0) {
      onclickScript = `bus.route.openRoute(${result.item.id}, [${result.item.pid.join(',')}])`;
    }
    if (result.item.type === 1) {
      onclickScript = ``; //openLocation
    }
    html.push(`<div class="search_page_search_result" onclick="${onclickScript}"><div class="search_page_search_result_type">${typeIcon}</div><div class="search_page_search_result_route_name">${name}</div></div>`);
  }
  searchResultsElement.innerHTML = html.join('');
}
}
