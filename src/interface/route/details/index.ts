import { integrateRouteDetails } from '../../../data/apis/index';
import { initializeCalendarGridlines, setUpCalendarFieldSkeletonScreen, updateCalendarField } from './calendar';
import { setUpPropertiesFieldSkeletonScreen, updatePropertiesField } from './properties';
import { generateIdentifier } from '../../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../../tools/query-selector';

async function initializeRouteDetailsField(Field: HTMLElement, RouteID: number, PathAttributeId: [number]): void {
  var actionsField: HTMLElement = elementQuerySelector(Field, '.css_route_details_body .css_route_details_groups .css_route_details_group[group="actions"]');
  var propertiesField: HTMLElement = elementQuerySelector(Field, '.css_route_details_body .css_route_details_groups .css_route_details_group[group="properties"]');
  var calendarField: HTMLElement = elementQuerySelector(Field, '.css_route_details_body .css_route_details_groups .css_route_details_group[group="calendar"]');
  elementQuerySelector(actionsField, '.css_route_details_group_body .css_route_details_action_button[action="save-to-folder"]').setAttribute('onclick', `bus.folder.openSaveToFolder('route', [${RouteID}])`);
  elementQuerySelector(actionsField, '.css_route_details_group_body .css_route_details_action_button[action="get-permalink"]').setAttribute('onclick', `bus.route.shareRoutePermalink(${RouteID})`);
  setUpPropertiesFieldSkeletonScreen(propertiesField);
  initializeCalendarGridlines(calendarField);
  setUpCalendarFieldSkeletonScreen(calendarField);
  const requestID = `r_${generateIdentifier()}`;
  var integration = await integrateRouteDetails(RouteID, PathAttributeId, requestID);
  updatePropertiesField(propertiesField, integration.properties, false);
  updateCalendarField(calendarField, integration.calendar, false);
}

export function openRouteDetails(RouteID: number, PathAttributeId: [number]): void {
  var Field: HTMLElement = documentQuerySelector('.css_route_details_field');
  Field.setAttribute('displayed', true);
  initializeRouteDetailsField(Field, RouteID, PathAttributeId);
}

export function closeRouteDetails(): void {
  var Field: HTMLElement = documentQuerySelector('.css_route_details_field');
  Field.setAttribute('displayed', false);
}
