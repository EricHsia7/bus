import { integratedRecentViews, integrateRecentViews } from '../../../data/recent-views/index';
import { generateIdentifier } from '../../../tools/index';
import { documentQuerySelector } from '../../../tools/query-selector';
import { GeneratedElement } from '../../index';

const RecentViewsField = documentQuerySelector('.css_home_field .css_home_body .css_home_recent_views');

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
  function updateItem(thisElement: HTMLElement, thisItem: object, previousItem: object): void {
    function updateIcon(thisElement: HTMLElement, thisItem: object): void {}
    function updateTitle(thisElement: HTMLElement, thisItem: object): void {}
    function updateTime(thisElement: HTMLElement, thisItem: object): void {}
    function updateName(thisElement: HTMLElement, thisItem: object): void {}
    function updateButton(thisElement: HTMLElement, thisItem: object): void {}
  }
}

export function setUpRecentViewsFieldSkeletonScreen(Field: HTMLElement) {}

async function refreshRecentViews(): void {
  const requestID = generateIdentifier('r');
  const integration = await integrateRecentViews(requestID);
  updateRecentViewsField(RecentViewsField, integration);
}

async function streamRecentViews(): void {}

export function initializeRecentViews(): void {
  setUpRecentViewsFieldSkeletonScreen(RecentViewsField);
}
