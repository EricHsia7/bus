import { integrateRouteDetails } from '../../../data/apis/index.ts';
import { initializeCalendarGridlines, setUpCalendarFieldSkeletonScreen, updateCalendarField } from './calendar.ts';
import { setUpPropertiesFieldSkeletonScreen, updatePropertiesField } from './properties.ts';
import { md5 } from '../../../tools/index.ts';

async function initializeRouteDetailsField(Field: HTMLElement, RouteID: number, PathAttributeId: [number]): void {
  var actionsField: HTMLElement = Field.querySelector('.route_details_body .route_details_groups .route_details_group[group="actions"]');
  var propertiesField: HTMLElement = Field.querySelector('.route_details_body .route_details_groups .route_details_group[group="properties"]');
  var calendarField: HTMLElement = Field.querySelector('.route_details_body .route_details_groups .route_details_group[group="calendar"]');
  actionsField.querySelector('.route_details_group_body .route_details_action_button[action="link"]').setAttribute('onclick', `bus.route.shareRoutePermalink(${RouteID})`);
  setUpPropertiesFieldSkeletonScreen(propertiesField);
  initializeCalendarGridlines(calendarField);
  setUpCalendarFieldSkeletonScreen(calendarField);
  const requestID = `r_${md5(Math.random() * new Date().getTime())}`;
  var integration = await integrateRouteDetails(RouteID, PathAttributeId, requestID);
  updatePropertiesField(propertiesField, integration.properties, false);
  updateCalendarField(calendarField, integration.calendar, false);
}

export function openRouteDetails(RouteID: number, PathAttributeId: [number]): void {
  var Field: HTMLElement = document.querySelector('.route_details_field');
  Field.setAttribute('displayed', true);
  initializeRouteDetailsField(Field, RouteID, PathAttributeId);
}

export function closeRouteDetails(): void {
  var Field: HTMLElement = document.querySelector('.route_details_field');
  Field.setAttribute('displayed', false);
}