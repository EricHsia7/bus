import { openKeyboard, closeKeyboard } from './keyboard.ts';
import { prepareForSearch } from '../data/search/searchRoute.ts';

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

export function updateSearchResult(query: string): void {
  var searchResults = currentFuse.search(query);
  var html = [];
  for (var result of searchResults) {
    var name = result.item.n;
    var endPoints = `${result.item.dep} \u21CC ${result.item.des}`;
    var onclickScript = `bus.route.openRoute(${result.item.id}, [${result.item.pid.join(',')}])`;
    html.push(`<div class="search_page_search_result" onclick="${onclickScript}">${name}</div>`);
  }
  searchResultsElement.innerHTML = html.join('');
}
