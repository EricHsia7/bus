import { integratedRecentViews } from '../../../data/recent-views/index';
import { GeneratedElement } from '../../index';

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
