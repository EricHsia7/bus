import { integratedRecentView, integratedRecentViews, integrateRecentViews } from '../../../data/recent-views/index';
import { getSettingOptionValue } from '../../../data/settings/index';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector } from '../../../tools/elements';
import { booleanToString, hasOwnProperty } from '../../../tools/index';
import { Tick } from '../../../tools/tick';
import { openBus } from '../../bus/index';
import { getBlankIconElement, setIcon } from '../../icons/index';
import { MaterialSymbol } from '../../icons/material-symbols-type';
import { querySize } from '../../index';
import { openLocation } from '../../location/index';
import { openRoute } from '../../route/index';

const Field = documentQuerySelector('.css_home_field');
const BodyElement = elementQuerySelector(Field, '.css_home_body');
const RecentViewsElement = elementQuerySelector(BodyElement, '.css_home_recent_views');
const RecentViewsContentElement = elementQuerySelector(RecentViewsElement, '.css_home_recent_views_content');

/**
 * div.css_home_recent_views_item(n) in div.css_home_recent_views(1)
 */
const itemElements: Array<HTMLElement> = [];

let previousIntegration = {} as integratedRecentViews;
let previousAnimation: boolean = false;
let previousSkeletonScreen: boolean = false;

const recentViewsTick = new Tick(refreshRecentViews, 15 * 1000);

function generateElementOfRecentViewItem(): HTMLElement {
  // Main container
  const recentViewsItemElement = documentCreateDivElement();
  recentViewsItemElement.classList.add('css_home_recent_views_item');

  // Head
  const headElement = documentCreateDivElement();
  headElement.classList.add('css_home_recent_views_item_head');

  // Icon
  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_home_recent_views_item_icon');
  iconElement.appendChild(getBlankIconElement());

  // Title
  const titleElement = documentCreateDivElement();
  titleElement.classList.add('css_home_recent_views_item_title');

  // Time
  const timeElement = documentCreateDivElement();
  timeElement.classList.add('css_home_recent_views_item_time');

  // Assemble head
  headElement.appendChild(iconElement);
  headElement.appendChild(titleElement);
  headElement.appendChild(timeElement);

  // Name
  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_home_recent_views_item_name');

  // Assemble item
  recentViewsItemElement.appendChild(headElement);
  recentViewsItemElement.appendChild(nameElement);

  return recentViewsItemElement;
}

function updateRecentViewsField(integration: integratedRecentViews, skeletonScreen: boolean, animation: boolean) {
  function updateItem(thisElement: HTMLElement, thisItem: integratedRecentView, previousItem: integratedRecentView | null): void {
    function updateIcon(thisElement: HTMLElement, thisItem: integratedRecentView): void {
      const thisHeadElement = elementQuerySelector(thisElement, '.css_home_recent_views_item_head');
      const thisIconElement = elementQuerySelector(thisHeadElement, '.css_home_recent_views_item_icon');
      let icon: MaterialSymbol = '';
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
      setIcon(thisIconElement, icon);
    }

    function updateTitle(thisElement: HTMLElement, thisItem: integratedRecentView): void {
      const thisHeadElement = elementQuerySelector(thisElement, '.css_home_recent_views_item_head');
      const thisTitleElement = elementQuerySelector(thisHeadElement, '.css_home_recent_views_item_title');
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
      thisTitleElement.textContent = title;
    }

    function updateTime(thisElement: HTMLElement, thisItem: integratedRecentView): void {
      const thisHeadElement = elementQuerySelector(thisElement, '.css_home_recent_views_item_head');
      const thisTimeElement = elementQuerySelector(thisHeadElement, '.css_home_recent_views_item_time');
      thisTimeElement.textContent = thisItem.time.relative;
    }

    function updateName(thisElement: HTMLElement, thisItem: integratedRecentView): void {
      const thisNameElement = elementQuerySelector(thisElement, '.css_home_recent_views_item_name');
      thisNameElement.textContent = thisItem.name;
    }

    function updateOnclick(thisElement: HTMLElement, thisItem: integratedRecentView, skeletonScreen: boolean): void {
      if (skeletonScreen) {
        thisElement.onclick = null;
      } else {
        switch (thisItem.type) {
          case 'route':
            thisElement.onclick = function () {
              openRoute(thisItem.id);
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
    }

    function updateAnimation(thisElement: HTMLElement, animation: boolean): void {
      thisElement.setAttribute('animation', booleanToString(animation));
    }

    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      thisElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }

    if (previousItem === null || previousItem === undefined) {
      updateIcon(thisElement, thisItem);
      updateTitle(thisElement, thisItem);
      updateTime(thisElement, thisItem);
      updateName(thisElement, thisItem);
      updateOnclick(thisElement, thisItem, skeletonScreen);
      updateAnimation(thisElement, animation);
      updateSkeletonScreen(thisElement, skeletonScreen);
    } else {
      if (thisItem.type !== previousItem.type) {
        updateIcon(thisElement, thisItem);
        updateTitle(thisElement, thisItem);
        updateTime(thisElement, thisItem);
        updateName(thisElement, thisItem);
        updateOnclick(thisElement, thisItem, skeletonScreen);
        updateAnimation(thisElement, animation);
        updateSkeletonScreen(thisElement, skeletonScreen);
      } else {
        switch (thisItem.type) {
          case 'location':
            if (previousItem.time !== thisItem.time) {
              updateTime(thisElement, thisItem);
            }
            if (previousItem.hash !== thisItem.hash) {
              updateName(thisElement, thisItem);
              updateOnclick(thisElement, thisItem, skeletonScreen);
            }
            break;
          case 'route':
            if (previousItem.time !== thisItem.time) {
              updateTime(thisElement, thisItem);
            }
            if (previousItem.id !== thisItem.id) {
              updateName(thisElement, thisItem);
              updateOnclick(thisElement, thisItem, skeletonScreen);
            }
            break;
          case 'bus':
            if (previousItem.time !== thisItem.time) {
              updateTime(thisElement, thisItem);
            }
            if (previousItem.id !== thisItem.id) {
              updateName(thisElement, thisItem);
              updateOnclick(thisElement, thisItem, skeletonScreen);
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
        if (previousAnimation !== animation) {
          updateAnimation(thisElement, animation);
        }
        if (previousSkeletonScreen !== skeletonScreen) {
          updateSkeletonScreen(thisElement, skeletonScreen);
        }
      }
    }
  }

  const itemQuantity = integration.itemQuantity;

  const itemElementsLength = itemElements.length;
  if (itemQuantity !== itemElementsLength) {
    const difference = itemElementsLength - itemQuantity;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newRecentViewItemElement = generateElementOfRecentViewItem();
        fragment.appendChild(newRecentViewItemElement);
        itemElements.push(newRecentViewItemElement);
      }
      RecentViewsContentElement.append(fragment);
    } else if (difference > 0) {
      for (let p = itemElementsLength - 1, q = itemElementsLength - difference - 1; p > q; p--) {
        itemElements[p].remove();
        itemElements.splice(p, 1);
      }
    }
  }

  for (let i = 0; i < itemQuantity; i++) {
    const thisElement = itemElements[i];
    const thisItem = integration.items[i];
    if (hasOwnProperty(previousIntegration, 'items')) {
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

export function setupRecentViewsFieldSkeletonScreen(): void {
  const playing_animation = getSettingOptionValue('playing_animation');
  const WindowSize = querySize('window');
  const defaultItemQuantity = Math.floor(WindowSize.height / 70 / 3) + 2;
  const items: Array<integratedRecentView> = new Array(defaultItemQuantity).fill({
    type: 'route',
    id: -1,
    time: {
      absolute: 0,
      relative: ''
    },
    name: ''
  }); // reuse the object (assume readonly)
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

async function refreshRecentViews(): Promise<number> {
  try {
    const playing_animation = getSettingOptionValue('playing_animation');
    const integration = await integrateRecentViews(function () {});
    updateRecentViewsField(integration, false, playing_animation);
    return 15 * 1000;
  } catch (err) {
    return 10 * 1000;
  }
}

export function initializeRecentViewsField(): void {
  // setupRecentViewsFieldSkeletonScreen();
  if (recentViewsTick.isPaused) {
    recentViewsTick.resume(true);
  } else {
    recentViewsTick.tick();
  }
}
