import { integrateBus } from '../../data/bus/index';
import { logRecentView } from '../../data/recent-views/index';
import { getSettingOptionValue } from '../../data/settings/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { generateIdentifier } from '../../tools/index';
import { closePreviousPage, openPreviousPage, pushPageHistory } from '../index';
import { setUpBusPropertiesFieldSkeletonScreen, updateBusPropertiesField } from './properties';

export const BusField = documentQuerySelector('.css_bus_field');
export const BusHeadElement = elementQuerySelector(BusField, '.css_bus_head');
export const BusBodyElement = elementQuerySelector(BusField, '.css_bus_body');
export const BusGroupsElement = elementQuerySelector(BusBodyElement, '.css_bus_groups');
export const BusPropertiesGroupElement = elementQuerySelector(BusGroupsElement, '.css_bus_group[group="properties"]');
export const BusPropertiesGroupBodyElement = elementQuerySelector(BusPropertiesGroupElement, '.css_bus_group_body');
export const BusLocationGroupElement = elementQuerySelector(BusGroupsElement, '.css_bus_group[group="location"]');

export function openBus(id: number): void {
  pushPageHistory('Bus');
  logRecentView('bus', id);
  BusField.setAttribute('displayed', 'true');
  initializeBusPage(id);
  closePreviousPage();
}

export function closeBus(): void {
  // revokePageHistory('Bus');
  BusField.setAttribute('displayed', 'false');
  openPreviousPage();
}

async function initializeBusPage(id: number) {
  setUpBusPropertiesFieldSkeletonScreen();
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const requestID = generateIdentifier();
  const integration = await integrateBus(id, requestID);
  updateBusPropertiesField(integration.properties, false, playing_animation);
}

function updateBusField(Field: HTMLElement, integration: object, skeletonScreen: boolean): void {
  function updateProperty(thisElement: HTMLElement, thisItem: object): void {}
  function updateLocation(thisElement: HTMLElement, thisItem: object): void {}
}
