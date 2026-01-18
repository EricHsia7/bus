import { integrateBus } from '../../data/bus/index';
import { logRecentView } from '../../data/recent-views/index';
import { getSettingOptionValue } from '../../data/settings/index';
import { generateIdentifier } from '../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { closePreviousPage, openPreviousPage, pushPageHistory } from '../index';
import { setUpBusPropertiesFieldSkeletonScreen, updateBusPropertiesField } from './properties';

const BusField = documentQuerySelector('.css_bus_field');
const BusHead = elementQuerySelector(BusField, '.css_bus_head');
const BusBody = elementQuerySelector(BusField, '.css_bus_body');
const BusGroups = elementQuerySelector(BusBody, '.css_bus_groups');
const BusGroupProperties = elementQuerySelector(BusGroups, '.css_bus_group[group="properties"]');
const BusGroupLocation = elementQuerySelector(BusGroups, '.css_bus_group[group="location"]');

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
  setUpBusPropertiesFieldSkeletonScreen(BusGroupProperties);
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const requestID = generateIdentifier();
  const integration = await integrateBus(id, requestID);
  updateBusPropertiesField(BusGroupProperties, integration.properties, false, playing_animation);
}

function updateBusField(Field: HTMLElement, integration: object, skeletonScreen: boolean): void {
  function updateProperty(thisElement: HTMLElement, thisItem: object): void {}
  function updateLocation(thisElement: HTMLElement, thisItem: object): void {}
}
