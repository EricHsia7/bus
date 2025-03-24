import { openKeyboard, closeKeyboard } from './keyboard';
import { prepareForSearch, searchFor, SearchItem } from '../../data/search/index';
import { getIconHTML } from '../icons/index';
import { dataDownloadCompleted } from '../home/index';
import { promptMessage } from '../prompt/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { containPhoneticSymbols } from '../../tools/text';
import { pushPageHistory, revokePageHistory } from '../index';
import { MaterialSymbols } from '../icons/material-symbols-type';

const searchField = documentQuerySelector('.css_search_field');
const searchHeadElement = elementQuerySelector(searchField, '.css_search_head');
const searchBodyElement = elementQuerySelector(searchField, '.css_search_body');
const searchInputElement = elementQuerySelector(searchHeadElement, '.css_search_search_input #search_input');
const searchTypeFilterButtonElement = elementQuerySelector(searchHeadElement, '.css_search_button_right');
const searchResultsElement = elementQuerySelector(searchBodyElement, '.css_search_results');

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

export function updateSearchResult(query: string, type: SearchItem | -1): void {
  if (!containPhoneticSymbols(query)) {
    const typeToIcon = ['route', 'location_on', 'directions_bus'];
    let html = [];
    const searchResults = searchFor(query, type, 30);
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
        case 2:
          onclickScript = `bus.bus.openBus(${result.item.id})`;
          break;
        default:
          break;
      }
      html.push(`<div class="css_search_search_result" onclick="${onclickScript}"><div class="css_search_search_result_type">${typeIcon}</div><div class="css_search_search_result_route_name">${name}</div></div>`);
    }
    searchResultsElement.innerHTML = html.join('');
  }
}

export function switchSearchTypeFilter(): void {
  const currentType = parseInt(searchTypeFilterButtonElement.getAttribute('type'));
  let type: number = -1;
  if (currentType >= -1 && currentType < 2) {
    type = currentType + 1;
  } else {
    type = -1;
  }
  const icons: Array<MaterialSymbols> = ['filter_list', 'route', 'location_on', 'directions_bus'];
  searchTypeFilterButtonElement.innerHTML = getIconHTML(icons[type + 1]);
  searchTypeFilterButtonElement.setAttribute('type', type.toString());
  const query = searchInputElement.value;
  updateSearchResult(query, type);
}
