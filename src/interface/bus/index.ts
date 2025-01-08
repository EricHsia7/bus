import { CarInfoItem, getCarInfo } from '../../data/apis/getCarInfo/index';
import { generateIdentifier } from '../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { closePreviousPage, pushPageHistory, revokePageHistory } from '../index';

const BusField = documentQuerySelector('.css_bus_field');
const BusHead = elementQuerySelector(BusField, '.css_bus_head');
const BusBody = elementQuerySelector(BusField, '.css_bus_body');
const BusGroups = elementQuerySelector(BusBody, '.css_bus_groups');
const BusGroupProperties = elementQuerySelector(BusGroups, 'css_bus_group[group="properties"]');
const BusGroupLocation = elementQuerySelector(BusGroups, 'css_bus_group[group="location"]');

export function openBus(id: CarInfoItem['BusId']): void {
  pushPageHistory('Bus');
  BusField.setAttribute('displayed', 'true');
  closePreviousPage();
}

export function closeBus(): void {
  revokePageHistory('Bus');
  dataUsageField.setAttribute('displayed', 'false');
}

async function initializeBusPage(): void {
  const requestID = generateIdentifier('r');
  const CarInfo = await getCarInfo(requestID, true);
}
