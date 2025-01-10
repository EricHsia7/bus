import { integratedRecentViews, integrateRecentViews } from '../../../data/recent-views/index';
import { booleanToString, generateIdentifier } from '../../../tools/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../../tools/query-selector';
import { FieldSize, GeneratedElement } from '../../index';

const RecentViewsField = documentQuerySelector('.css_home_field .css_home_body .css_home_recent_views');

let previousIntegration = [];

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
  element.innerHTML = `<div class="css_home_recent_views_item_head"><div class="css_home_recent_views_item_icon"></div><div class="css_home_recent_views_item_title"></div></div>`;
  return {
    element: element,
    id: null
  };
}

function updateRecentViewsField(Field: HTMLElement, integration: integratedRecentViews, skeletonScreen: boolean) {
  function updateItem(thisElement: HTMLElement, thisItem: object, previousItem: object): void {
    function updateIcon(thisElement: HTMLElement, thisItem: object): void {
      const iconElement = elementQuerySelector(thisElement, '.css_home_recent_views_item_head .css_home_recent_views_item_icon');
      // Update icon based on thisItem properties
    }
    function updateTitle(thisElement: HTMLElement, thisItem: object): void {
      const titleElement = elementQuerySelector(thisElement, '.css_home_recent_views_item_head .css_home_recent_views_item_title');
      // Update title based on thisItem properties
    }
    function updateTime(thisElement: HTMLElement, thisItem: object): void {
      const timeElement = elementQuerySelector(thisElement, '.css_home_recent_views_item_head .css_home_recent_views_item_time');
      // Update time based on thisItem properties
    }
    function updateName(thisElement: HTMLElement, thisItem: object): void {
      const nameElement = elementQuerySelector(thisElement, '.css_home_recent_views_item_name');
      // Update name based on thisItem properties
    }
    function updateButton(thisElement: HTMLElement, thisItem: object): void {
      const buttonElement = elementQuerySelector(thisElement, '.css_home_recent_views_item_button');
      // Update button based on thisItem properties
    }

    if (previousItem === null) {
      updateIcon(thisElement, thisItem);
      updateTitle(thisElement, thisItem);
      updateTime(thisElement, thisItem);
      updateName(thisElement, thisItem);
      updateButton(thisElement, thisItem);
    } else {
      // Compare and update only changed properties
    }
  }

  const FieldSize = queryRecentViewsFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;

  if (previousIntegration.length === 0) {
    previousIntegration = integration;
  }

  const itemQuantity = integration.length;

  Field.setAttribute('skeleton-screen', booleanToString(skeletonScreen));

  const currentItemSeatQuantity = elementQuerySelectorAll(Field, `.css_home_recent_views_content .css_home_recent_views_item`).length;
  if (!(itemQuantity === currentItemSeatQuantity)) {
    const capacity = currentItemSeatQuantity - itemQuantity;
    if (capacity < 0) {
      for (let o = 0; o < Math.abs(capacity); o++) {
        const thisRecentViewItemElement = generateElementOfRecentViewItem();
        Field.appendChild(thisRecentViewItemElement.element);
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
    const thisItem = integration[i];
    if (previousIntegration.length > 0) {
      if (previousIntegration[i]) {
        const previousItem = previousIntegration[i];
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
  const items = [];
  for (let i = 0; i < defaultItemQuantity; i++) {
    items.push({
      id: null,
      title: '',
      icon: '',
      time: '',
      name: ''
    });
  }
  updateRecentViewsField(Field, items, true);
}

async function refreshRecentViews(): Promise<object> {
  recentViewsRefreshTimer_refreshing = true;
  recentViewsRefreshTimer_currentRequestID = generateIdentifier('r');
  const integration = await integrateRecentViews(recentViewsRefreshTimer_currentRequestID);
  updateRecentViewsField(RecentViewsField, integration, false);
  recentViewsRefreshTimer_lastUpdate = new Date().getTime();
  recentViewsRefreshTimer_refreshing = false;
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
