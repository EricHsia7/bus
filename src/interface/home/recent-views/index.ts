import { getUpdateRate } from '../../../data/analytics/update-rate';
import { integratedRecentView, integratedRecentViews, integrateRecentViews } from '../../../data/recent-views/index';
import { getSettingOptionValue } from '../../../data/settings/index';
import { booleanToString, compareThings, generateIdentifier } from '../../../tools/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../../tools/query-selector';
import { getIconHTML } from '../../icons/index';
import { FieldSize, GeneratedElement } from '../../index';

const RecentViewsField = documentQuerySelector('.css_home_field .css_home_body .css_home_recent_views');

let previousIntegration = {};

let recentViewsRefreshTimer_retryInterval: number = 10 * 1000;
let recentViewsRefreshTimer_baseInterval: number = 15 * 1000;
let recentViewsRefreshTimer_minInterval: number = 5 * 1000;
let recentViewsRefreshTimer_dynamicInterval: number = 15 * 1000;
let recentViewsRefreshTimer_auto: boolean = true;
let recentViewsRefreshTimer_streaming: boolean = false;
let recentViewsRefreshTimer_lastUpdate: number = 0;
let recentViewsRefreshTimer_nextUpdate: number = 0;
let recentViewsRefreshTimer_refreshing: boolean = false;
let recentViewsRefreshTimer_currentRequestID: string = '';
let recentViewsRefreshTimer_streamStarted: boolean = false;
let recentViewsRefreshTimer_timer: ReturnType<typeof setTimeout>;

function queryRecentViewsFieldSize(): FieldSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

function generateElementOfRecentViewItem(): GeneratedElement {
  const element = document.createElement('div');
  element.classList.add('css_home_recent_views_item');
  element.innerHTML = `<div class="css_home_recent_views_item_head"><div class="css_home_recent_views_item_icon"></div><div class="css_home_recent_views_item_title"></div><div class="css_home_recent_views_item_time"></div></div><div class="css_home_recent_views_item_name"></div><div class="css_home_recent_views_item_button"></div>`;
  return {
    element: element,
    id: null
  };
}

function updateRecentViewsField(Field: HTMLElement, integration: integratedRecentViews, skeletonScreen: boolean) {
  function updateItem(thisElement: HTMLElement, thisItem: integratedRecentView, previousItem: integratedRecentView): void {
    function updateIcon(thisElement: HTMLElement, thisItem: integratedRecentView): void {
      const iconElement = elementQuerySelector(thisElement, '.css_home_recent_views_item_head .css_home_recent_views_item_icon');
      let icon = '';
      switch (thisItem.type) {
        case 'route':
          icon = 'route';
          break;
        case 'location':
          icon = 'location_on';
          break;
        case 'bus':
          icon = 'directions_bus';
          break;
        default:
          break;
      }
      iconElement.innerHTML = getIconHTML(icon);
    }
    function updateTitle(thisElement: HTMLElement, thisItem: integratedRecentView): void {
      const titleElement = elementQuerySelector(thisElement, '.css_home_recent_views_item_head .css_home_recent_views_item_title');
      let title = '';
      switch (thisItem.type) {
        case 'route':
          title = '路線';
          break;
        case 'location':
          title = '地點';
          break;
        case 'bus':
          title = '公車';
          break;
        default:
          break;
      }
      titleElement.innerText = title;
    }
    function updateTime(thisElement: HTMLElement, thisItem: integratedRecentView): void {
      const timeElement = elementQuerySelector(thisElement, '.css_home_recent_views_item_head .css_home_recent_views_item_time');
      timeElement.innerText = thisItem.time.relative;
    }
    function updateName(thisElement: HTMLElement, thisItem: integratedRecentView): void {
      const nameElement = elementQuerySelector(thisElement, '.css_home_recent_views_item_name');
      nameElement.innerText = thisItem.name;
    }
    function updateOnclick(thisElement: HTMLElement, thisItem: integratedRecentView): void {
      let onclickScript = '';
      switch (thisItem.type) {
        case 'route':
          onclickScript = `bus.route.openRoute(${thisItem.id}, [${thisItem.pid.join(',')}])`;
          break;
        case 'location':
          onclickScript = `bus.location.openLocation('${thisItem.hash}')`;
          break;
        case 'bus':
          onclickScript = `bus.bus.openBus(${thisItem.id})`;
          break;
        default:
          break;
      }
      thisElement.setAttribute('onclick', onclickScript);
    }

    if (previousItem === null) {
      updateIcon(thisElement, thisItem);
      updateTitle(thisElement, thisItem);
      updateTime(thisElement, thisItem);
      updateName(thisElement, thisItem);
      updateOnclick(thisElement, thisItem);
    } else {
      if (!(thisItem.type === previousItem.type)) {
        updateIcon(thisElement, thisItem);
        updateTitle(thisElement, thisItem);
        updateTime(thisElement, thisItem);
        updateName(thisElement, thisItem);
        updateOnclick(thisElement, thisItem);
      } else {
        switch (thisItem.type) {
          case 'location':
            if (!compareThings(previousItem.name, thisItem.name)) {
              updateName(thisElement, thisItem);
            }
            if (!(previousItem.time === thisItem.time)) {
              updateTime(thisElement, thisItem);
            }
            if (!compareThings(previousItem.hash, thisItem.hash)) {
              updateOnclick(thisElement, thisItem);
            }
            break;
          case 'route':
            if (!compareThings(previousItem.name, thisItem.name)) {
              updateName(thisElement, thisItem);
            }
            if (!(previousItem.time === thisItem.time)) {
              updateTime(thisElement, thisItem);
            }
            if (!compareThings(previousItem.id, thisItem.id) || !compareThings(previousItem.pid, thisItem.pid)) {
              updateOnclick(thisElement, thisItem);
            }
            break;
          case 'bus':
            if (!compareThings(previousItem.name, thisItem.name)) {
              updateName(thisElement, thisItem);
            }
            if (!(previousItem.time === thisItem.time)) {
              updateTime(thisElement, thisItem);
            }
            if (!compareThings(previousItem.id, thisItem.id)) {
              updateOnclick(thisElement, thisItem);
            }
            break;
          default:
            break;
        }
      }
    }
  }

  const FieldSize = queryRecentViewsFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;

  /*
  if (!previousIntegration.hasOwnProperty('items')) {
    previousIntegration = integration;
  }
*/
  const itemQuantity = integration.itemQuantity;

  Field.setAttribute('skeleton-screen', booleanToString(skeletonScreen));

  const currentItemSeatQuantity = elementQuerySelectorAll(Field, `.css_home_recent_views_content .css_home_recent_views_item`).length;
  if (!(itemQuantity === currentItemSeatQuantity)) {
    const capacity = currentItemSeatQuantity - itemQuantity;
    if (capacity < 0) {
      for (let o = 0; o < Math.abs(capacity); o++) {
        const thisRecentViewItemElement = generateElementOfRecentViewItem();
        elementQuerySelector(Field, `.css_home_recent_views_content`).appendChild(thisRecentViewItemElement.element);
      }
    } else {
      for (let o = 0; o < Math.abs(capacity); o++) {
        const recentViewItemIndex = currentItemSeatQuantity - 1 - o;
        elementQuerySelectorAll(Field, `.css_home_recent_views_content .css_home_recent_views_item`)[recentViewItemIndex].remove();
      }
    }
  }

  for (let i = 0; i < itemQuantity; i++) {
    const thisElement = elementQuerySelectorAll(Field, `.css_home_recent_views_content .css_home_recent_views_item`)[i];
    thisElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    const thisItem = integration.items[i];
    if (previousIntegration.hasOwnProperty('items')) {
      if (previousIntegration.items[i]) {
        const previousItem = previousIntegration.items[i];
        updateItem(thisElement, thisItem, previousItem);
      } else {
        updateItem(thisElement, thisItem, null);
      }
    } else {
      updateItem(thisElement, thisItem, null);
    }
  }
  previousIntegration = integration;
}

export function setUpRecentViewsFieldSkeletonScreen(Field: HTMLElement): void {
  const FieldSize = queryRecentViewsFieldSize();
  const defaultItemQuantity = Math.floor(FieldSize.height / 70 / 3) + 2;
  const items: Array<integratedRecentView> = [];
  for (let i = 0; i < defaultItemQuantity; i++) {
    items.push({
      type: 'route',
      id: 0,
      pid: [],
      time: {
        absolute: 0,
        relative: ''
      },
      name: ''
    });
  }
  updateRecentViewsField(
    Field,
    {
      items: items,
      itemQuantity: items.length,
      dataUpdateTime: null
    },
    true
  );
}

async function refreshRecentViews(): Promise<object> {
  const refresh_interval_setting = getSettingOptionValue('refresh_interval');
  recentViewsRefreshTimer_auto = refresh_interval_setting.auto;
  recentViewsRefreshTimer_baseInterval = refresh_interval_setting.baseInterval;
  recentViewsRefreshTimer_refreshing = true;
  recentViewsRefreshTimer_currentRequestID = generateIdentifier('r');
  // documentQuerySelector('.css_home_update_timer').setAttribute('refreshing', 'true');
  const integration = await integrateRecentViews(recentViewsRefreshTimer_currentRequestID);
  updateRecentViewsField(RecentViewsField, integration, false);
  recentViewsRefreshTimer_lastUpdate = new Date().getTime();
  const updateRate = await getUpdateRate();
  if (recentViewsRefreshTimer_auto) {
    recentViewsRefreshTimer_nextUpdate = Math.max(new Date().getTime() + foldersRefreshTimer_minInterval, integration.dataUpdateTime + recentViewsRefreshTimer_baseInterval / updateRate);
  } else {
    recentViewsRefreshTimer_nextUpdate = new Date().getTime() + recentViewsRefreshTimer_baseInterval;
  }
  recentViewsRefreshTimer_dynamicInterval = Math.max(recentViewsRefreshTimer_minInterval, recentViewsRefreshTimer_nextUpdate - new Date().getTime());
  recentViewsRefreshTimer_refreshing = false;
  // documentQuerySelector('.css_home_update_timer').setAttribute('refreshing', 'false');
  return { status: 'Successfully refreshed the recent views.' };
}

async function streamRecentViews(): void {
  refreshRecentViews()
    .then((result) => {
      if (recentViewsRefreshTimer_streaming) {
        recentViewsRefreshTimer_timer = setTimeout(function () {
          streamRecentViews();
        }, Math.max(recentViewsRefreshTimer_minInterval, recentViewsRefreshTimer_nextUpdate - new Date().getTime()));
      } else {
        recentViewsRefreshTimer_streamStarted = false;
      }
    })
    .catch((err) => {
      console.error(err);
      if (recentViewsRefreshTimer_streaming) {
        recentViewsRefreshTimer_timer = setTimeout(function () {
          streamRecentViews();
        }, recentViewsRefreshTimer_retryInterval);
      } else {
        recentViewsRefreshTimer_streamStarted = false;
      }
    });
}

export function initializeRecentViews(): void {
  setUpRecentViewsFieldSkeletonScreen(RecentViewsField);
  if (!recentViewsRefreshTimer_streaming) {
    recentViewsRefreshTimer_streaming = true;
    if (!recentViewsRefreshTimer_streamStarted) {
      recentViewsRefreshTimer_streamStarted = true;
      streamRecentViews();
    } else {
      refreshRecentViews();
    }
  }
}
