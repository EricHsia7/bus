import { integrateBus } from '../../data/bus/index';
import { logRecentView } from '../../data/recent-views/index';
import { getSettingOptionValue } from '../../data/settings/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { generateIdentifier } from '../../tools/index';
import { hidePreviousPage, PageTransitionDirection, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';
import { setupBusPropertiesFieldSkeletonScreen, updateBusPropertiesField } from './properties';

export const BusField = documentQuerySelector('.css_bus_field');
export const BusHeadElement = elementQuerySelector(BusField, '.css_bus_head');
export const BusBodyElement = elementQuerySelector(BusField, '.css_bus_body');
export const BusGroupsElement = elementQuerySelector(BusBodyElement, '.css_bus_groups');
export const BusPropertiesGroupElement = elementQuerySelector(BusGroupsElement, '.css_bus_group[group="properties"]');
export const BusPropertiesGroupBodyElement = elementQuerySelector(BusPropertiesGroupElement, '.css_bus_group_body');
export const BusLocationGroupElement = elementQuerySelector(BusGroupsElement, '.css_bus_group[group="location"]');

export function showBus(pageTransitionDirection: PageTransitionDirection): void {
  const className = pageTransitionDirection === 'ltr' ? 'css_page_transition_slide_in_ltr' : 'css_page_transition_slide_in_rtl';
  BusField.addEventListener(
    'animationend',
    function () {
      BusField.classList.remove(className);
    },
    { once: true }
  );
  BusField.classList.add(className);
  BusField.setAttribute('displayed', 'true');
}

export function hideBus(pageTransitionDirection: PageTransitionDirection): void {
  const className = pageTransitionDirection === 'ltr' ? 'css_page_transition_slide_in_ltr' : 'css_page_transition_slide_in_rtl';
  BusField.addEventListener(
    'animationend',
    function () {
      BusField.setAttribute('displayed', 'false');
      BusField.classList.remove(className);
    },
    { once: true }
  );
  BusField.classList.add(className);
}

export function openBus(id: number): void {
  pushPageHistory('Bus');
  logRecentView('bus', id);
  showBus('rtl');
  initializeBusPage(id);
  hidePreviousPage();
}

export function closeBus(): void {
  hideBus('ltr');
  showPreviousPage();
  revokePageHistory('Bus');
}

async function initializeBusPage(id: number) {
  setupBusPropertiesFieldSkeletonScreen();
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const requestID = generateIdentifier();
  const integration = await integrateBus(id, requestID);
  updateBusPropertiesField(integration.properties, false, playing_animation);
}

function updateBusField(integration: object, skeletonScreen: boolean): void {
  function updateProperty(thisElement: HTMLElement, thisItem: object): void {}
  function updateLocation(thisElement: HTMLElement, thisItem: object): void {}
}
