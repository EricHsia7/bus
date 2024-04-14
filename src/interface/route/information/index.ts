import { integrateRouteInformation } from '../../../data/apis/index.ts';
import { initializeCalendarGridlines, setUpCalendarFieldSkeletonScreen, updateCalendarField } from './calendar.ts';
import { setUpPropertiesFieldSkeletonScreen, updatePropertiesField } from './properties.ts';
import { md5 } from '../../../tools/index.ts';

async function initializeRouteInformationField(Field: HTMLElement, RouteID: number, PathAttributeId: [number]): void {
  var actionsField: HTMLElement = Field.querySelector('.route_information_body .route_information_groups .route_information_group[group="actions"]');
  var propertiesField: HTMLElement = Field.querySelector('.route_information_body .route_information_groups .route_information_group[group="properties"]');
  var calendarField: HTMLElement = Field.querySelector('.route_information_body .route_information_groups .route_information_group[group="calendar"]');
  actionsField.querySelector('.route_information_group_body .route_information_action_button[action="link"]').setAttribute('onclick', `bus.route.shareRoutePermalink(${RouteID})`);
  setUpPropertiesFieldSkeletonScreen(propertiesField);
  initializeCalendarGridlines(calendarField);
  setUpCalendarFieldSkeletonScreen(calendarField);
  const requestID = `r_${md5(Math.random() * new Date().getTime())}`;
  var integration = await integrateRouteInformation(RouteID, PathAttributeId, requestID);
  updatePropertiesField(propertiesField, integration.properties, false);
  updateCalendarField(calendarField, integration.calendar, false);
}

export function openRouteInformation(RouteID: number, PathAttributeId: [number]): void {
  var Field: HTMLElement = document.querySelector('.route_information_field');
  Field.setAttribute('displayed', true);
  initializeRouteInformationField(Field, RouteID, PathAttributeId);
}

export function closeRouteInformation(): void {
  var Field: HTMLElement = document.querySelector('.route_information_field');
  Field.setAttribute('displayed', false);
}
