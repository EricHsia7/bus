import { getUpdateRate } from '../../../data/analytics/update-rate/index';
import { integratedRecentView, integratedRecentViews, integrateRecentViews } from '../../../data/recent-views/index';
import { getSettingOptionValue, SettingSelectOptionRefreshIntervalValue } from '../../../data/settings/index';
import { booleanToString, compareThings, generateIdentifier } from '../../../tools/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../../tools/query-selector';
import { openBus } from '../../bus/index';
import { getIconHTML } from '../../icons/index';
import { GeneratedElement, querySize } from '../../index';
import { openLocation } from '../../location/index';
import { openRoute } from '../../route/index';

const HomeField = documentQuerySelector('.css_home_field');
const HomeBodyElement = elementQuerySelector(HomeField, '.css_home_body');
const RecentViewsField = elementQuerySelector(HomeBodyElement, '.css_home_recent_views');
const RecentViewsContentElement = elementQuerySelector(RecentViewsField, '.css_home_recent_views_content');

let previousIntegration = {};
let previousAnimation: boolean = false;
let previousSkeletonScreen: boolean = false;

let recentViewsRefreshTimer_retryInterval: number = 10 * 1000;
let recentViewsRefreshTimer_baseInterval: number = 15 * 1000;
let recentViewsRefreshTimer_minInterval: number = 5 * 1000;
let recentViewsRefreshTimer_dynamicInterval: number = 15 * 1000;
let recentViewsRefreshTimer_dynamic: boolean = true;
let recentViewsRefreshTimer_streaming: boolean = false;
let recentViewsRefreshTimer_lastUpdate: number = 0;
let recentViewsRefreshTimer_nextUpdate: number = 0;
let recentViewsRefreshTimer_refreshing: boolean = false;
let recentViewsRefreshTimer_currentRequestID: string = '';
let recentViewsRefreshTimer_streamStarted: boolean = false;
let recentViewsRefreshTimer_timer: ReturnType<typeof setTimeout>;

function generateElementOfRecentViewItem(): GeneratedElement {
  // Main container
  const recentViewsItemElement = document.createElement('div');
  recentViewsItemElement.classList.add('css_home_recent_views_item');

  // Head
  const headElement = document.createElement('div');
  headElement.classList.add('css_home_recent_views_item_head');

  // Icon
  const iconElement = document.createElement('div');
  iconElement.classList.add('css_home_recent_views_item_icon');

  // Title
  const titleElement = document.createElement('div');
  titleElement.classList.add('css_home_recent_views_item_title');

  // Time
  const timeElement = document.createElement('div');
  timeElement.classList.add('css_home_recent_views_item_time');

  // Assemble head
  headElement.appendChild(iconElement);
  headElement.appendChild(titleElement);
  headElement.appendChild(timeElement);

  // Name
  const nameElement = document.createElement('div');
  nameElement.classList.add('css_home_recent_views_item_name');

  // Assemble item
  recentViewsItemElement.appendChild(headElement);
  recentViewsItemElement.appendChild(nameElement);

  return {
    element: recentViewsItemElement,
    id: ''
  };
}

function updateRecentViewsField(integration: integratedRecentViews, skeletonScreen: boolean, animation: boolean) {
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
        case 'empty':
          icon = 'lightbulb';
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
        case 'empty':
          title = '提示';
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
      switch (thisItem.type) {
        case 'route':
          thisElement.onclick = function () {
            openRoute(thisItem.id, thisItem.pid);
          };
          break;
        case 'location':
          thisElement.onclick = function () {
            openLocation(thisItem.hash);
          };
          break;
        case 'bus':
          thisElement.onclick = function () {
            openBus(thisItem.id);
          };
          break;
        case 'empty':
          thisElement.onclick = null;
          break;
        default:
          break;
      }
    }

    function updateAnimation(thisElement: HTMLElement, animation: boolean): void {
      thisElement.setAttribute('animation', booleanToString(animation));
    }

    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      thisElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }

    if (previousItem === null) {
      updateIcon(thisElement, thisItem);
      updateTitle(thisElement, thisItem);
      updateTime(thisElement, thisItem);
      updateName(thisElement, thisItem);
      updateOnclick(thisElement, thisItem);
      updateAnimation(thisElement, animation);
      updateSkeletonScreen(thisElement, skeletonScreen);
    } else {
      if (thisItem.type !== previousItem.type) {
        updateIcon(thisElement, thisItem);
        updateTitle(thisElement, thisItem);
        updateTime(thisElement, thisItem);
        updateName(thisElement, thisItem);
        updateOnclick(thisElement, thisItem);
        updateAnimation(thisElement, animation);
        updateSkeletonScreen(thisElement, skeletonScreen);
      } else {
        switch (thisItem.type) {
          case 'location':
            if (!compareThings(previousItem.name, thisItem.name)) {
              updateName(thisElement, thisItem);
            }
            if (previousItem.time !== thisItem.time) {
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
            if (previousItem.time !== thisItem.time) {
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
            if (previousItem.time !== thisItem.time) {
              updateTime(thisElement, thisItem);
            }
            if (!compareThings(previousItem.id, thisItem.id)) {
              updateOnclick(thisElement, thisItem);
            }
            break;
          case 'empty':
            if (previousItem.time !== thisItem.time) {
              updateTime(thisElement, thisItem);
            }
            break;
          default:
            break;
        }
        if (animation !== previousAnimation) {
          updateAnimation(thisElement, animation);
        }
        if (skeletonScreen !== previousSkeletonScreen) {
          updateSkeletonScreen(thisElement, skeletonScreen);
        }
      }
    }
  }

  /*
  const WindowSize = querySize('window');
  const FieldWidth = WindowSize.width;
  const FieldHeight = WindowSize.height;
  */

  const itemQuantity = integration.itemQuantity;

  // Field.setAttribute('skeleton-screen', booleanToString(skeletonScreen));

  const currentItemSeatQuantity = elementQuerySelectorAll(RecentViewsContentElement, '.css_home_recent_views_item').length;
  if (itemQuantity !== currentItemSeatQuantity) {
    const capacity = currentItemSeatQuantity - itemQuantity;
    if (capacity < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o < Math.abs(capacity); o++) {
        const newRecentViewItemElement = generateElementOfRecentViewItem();
        fragment.appendChild(newRecentViewItemElement.element);
      }
      RecentViewsContentElement.append(fragment);
    } else {
      const RecentViewsItemElements = elementQuerySelectorAll(RecentViewsContentElement, '.css_home_recent_views_item');
      for (let o = 0; o < Math.abs(capacity); o++) {
        const recentViewItemIndex = currentItemSeatQuantity - 1 - o;
        RecentViewsItemElements[recentViewItemIndex].remove();
      }
    }
  }

  const RecentViewsItemElements = elementQuerySelectorAll(RecentViewsContentElement, '.css_home_recent_views_item');
  for (let i = 0; i < itemQuantity; i++) {
    const thisElement = RecentViewsItemElements[i];
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
  previousAnimation = animation;
  previousSkeletonScreen = skeletonScreen;
}

export function setUpRecentViewsFieldSkeletonScreen(): void {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const WindowSize = querySize('window');
  const defaultItemQuantity = Math.floor(WindowSize.height / 70 / 3) + 2;
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
    {
      items: items,
      itemQuantity: items.length,
      dataUpdateTime: 0
    },
    true,
    playing_animation
  );
}

async function refreshRecentViews() {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const refresh_interval_setting = getSettingOptionValue('refresh_interval') as SettingSelectOptionRefreshIntervalValue;
  recentViewsRefreshTimer_dynamic = refresh_interval_setting.dynamic;
  recentViewsRefreshTimer_baseInterval = refresh_interval_setting.baseInterval;
  recentViewsRefreshTimer_refreshing = true;
  recentViewsRefreshTimer_currentRequestID = generateIdentifier();
  // documentQuerySelector('.css_home_update_timer').setAttribute('refreshing', 'true');
  const integration = await integrateRecentViews(recentViewsRefreshTimer_currentRequestID);
  updateRecentViewsField(integration, false, playing_animation);
  let updateRate = 0;
  if (recentViewsRefreshTimer_dynamic) {
    updateRate = await getUpdateRate();
  }
  recentViewsRefreshTimer_lastUpdate = new Date().getTime();
  if (recentViewsRefreshTimer_dynamic) {
    recentViewsRefreshTimer_nextUpdate = Math.max(recentViewsRefreshTimer_lastUpdate + recentViewsRefreshTimer_minInterval, integration.dataUpdateTime + recentViewsRefreshTimer_baseInterval / updateRate);
  } else {
    recentViewsRefreshTimer_nextUpdate = recentViewsRefreshTimer_lastUpdate + recentViewsRefreshTimer_baseInterval;
  }
  recentViewsRefreshTimer_dynamicInterval = Math.max(recentViewsRefreshTimer_minInterval, recentViewsRefreshTimer_nextUpdate - recentViewsRefreshTimer_lastUpdate);
  recentViewsRefreshTimer_refreshing = false;
  // documentQuerySelector('.css_home_update_timer').setAttribute('refreshing', 'false');
}

async function streamRecentViews() {
  refreshRecentViews()
    .then(function () {
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
  setUpRecentViewsFieldSkeletonScreen();
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
