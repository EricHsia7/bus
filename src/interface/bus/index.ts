import { integrateBus } from '../../data/bus/index';
import { logRecentView } from '../../data/recent-views/index';
import { generateIdentifier } from '../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { closePreviousPage, openPreviousPage, pushPageHistory } from '../index';
import { setUpBusPropertiesFieldSkeletonScreen, updateBusPropertiesField } from './properties';

const BusField = documentQuerySelector('.css_bus_field');
const BusHeadElement = elementQuerySelector(BusField, '.css_bus_head');
const BusBodyElement = elementQuerySelector(BusField, '.css_bus_body');
const BusGroupsComponent = elementQuerySelector(BusBodyElement, '.css_bus_groups_component');
const BusGroupPropertiesElement = elementQuerySelector(BusGroupsComponent, '.css_bus_group[group="properties"]');

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

async function initializeBusPage(id: number): void {
  setUpBusPropertiesFieldSkeletonScreen(BusGroupPropertiesElement);
  const requestID = generateIdentifier('r');
  const integration = await integrateBus(id, requestID);
  updateBusPropertiesField(BusGroupPropertiesElement, integration.properties, false);
}

function updateBusField(Field: HTMLElement, integration: object, skeletonScreen: boolean): void {
  function updateProperty(thisElement: HTMLElement, thisItem: object): void {}
  function updateLocation(thisElement: HTMLElement, thisItem: object): void {}
}
