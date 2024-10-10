import { openKeyboard, closeKeyboard } from './keyboard';
import { prepareForSearch, searchFor } from '../../data/search/index';
import { getIconHTML } from '../icons/index';
import { dataDownloadCompleted } from '../home/index';
import { promptMessage } from '../prompt/index';
import { documentQuerySelector } from '../../tools/query-selector';
import { containPhoneticSymbols } from '../../tools/text';
import { pushPageHistory, revokePageHistory } from '../index';

const searchField = documentQuerySelector('.css_search_field');
const searchInputElement = documentQuerySelector('.css_search_field .css_search_head .css_search_search_input #search_input');
const searchResultsElement = documentQuerySelector('.css_search_field .css_search_body .css_search_results');

export function openSearch(): void {
  if (dataDownloadCompleted) {
    pushPageHistory('Search');
    searchField.setAttribute('displayed', 'true');
    openKeyboard();
    prepareForSearch();
  } else {
    promptMessage('資料還在下載中', 'download_for_offline');
  }
}

export function closeSearch(): void {
  revokePageHistory('Search');
  closeKeyboard();
  searchField.setAttribute('displayed', 'false');
}

export function updateSearchResult(query: string): void {
  if (!containPhoneticSymbols(query)) {
    const typeToIcon = ['route', 'location_on'];
    const searchResults = searchFor(query, 30);
    let html = [];
    for (const result of searchResults) {
      const name = result.item.n;
      const typeIcon = getIconHTML(typeToIcon[result.item.type]);
      let onclickScript = '';
      switch (result.item.type) {
        case 0:
          onclickScript = `bus.route.openRoute(${result.item.id}, [${result.item.pid.join(',')}])`;
          break;
        case 1:
          onclickScript = `bus.location.openLocation('${result.item.hash}')`;
          break;
        default:
          break;
      }
      html.push(`<div class="css_search_search_result" onclick="${onclickScript}"><div class="css_search_search_result_type">${typeIcon}</div><div class="css_search_search_result_route_name">${name}</div></div>`);
    }
    searchResultsElement.innerHTML = html.join('');
  }
}
