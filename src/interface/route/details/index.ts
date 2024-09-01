import { integrateRouteDetails } from '../../../data/route/details'; 
import { initializeCalendarGridlines, setUpCalendarFieldSkeletonScreen, updateCalendarField } from './calendar';
import { setUpPropertiesFieldSkeletonScreen, updatePropertiesField } from './properties';
import { generateIdentifier } from '../../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../../tools/query-selector';
import { isSaved } from '../../../data/folder/index';

async function initializeRouteDetailsField(Field: HTMLElement, RouteID: number, PathAttributeId: Array<number>): void {
  const actionsField: HTMLElement = elementQuerySelector(Field, '.css_route_details_body .css_route_details_groups .css_route_details_group[group="actions"]');
  const propertiesField: HTMLElement = elementQuerySelector(Field, '.css_route_details_body .css_route_details_groups .css_route_details_group[group="properties"]');
  const calendarField: HTMLElement = elementQuerySelector(Field, '.css_route_details_body .css_route_details_groups .css_route_details_group[group="calendar"]');

  const svaeToFolderActionButtonElement = elementQuerySelector(actionsField, '.css_route_details_group_body .css_route_details_action_button[action="save-to-folder"]');
  const getPermalinkActionButton = elementQuerySelector(actionsField, '.css_route_details_group_body .css_route_details_action_button[action="get-permalink"]');
  
  const existence = await isSaved('route', RouteID);
  svaeToFolderActionButtonElement.setAttribute('highlighted', existence);
  svaeToFolderActionButtonElement.setAttribute('onclick', `bus.folder.openSaveToFolder('route', [${RouteID}])`);
  getPermalinkActionButton.setAttribute('onclick', `bus.route.shareRoutePermalink(${RouteID})`);
  setUpPropertiesFieldSkeletonScreen(propertiesField);
  initializeCalendarGridlines(calendarField);
  setUpCalendarFieldSkeletonScreen(calendarField);
  const requestID = generateIdentifier('r');
  var integration = await integrateRouteDetails(RouteID, PathAttributeId, requestID);
  updatePropertiesField(propertiesField, integration.properties, false);
  updateCalendarField(calendarField, integration.calendar, false);
}

export function openRouteDetails(RouteID: number, PathAttributeId: Array<number>): void {
  var Field: HTMLElement = documentQuerySelector('.css_route_details_field');
  Field.setAttribute('displayed', true);
  initializeRouteDetailsField(Field, RouteID, PathAttributeId);
}

export function closeRouteDetails(): void {
  var Field: HTMLElement = documentQuerySelector('.css_route_details_field');
  Field.setAttribute('displayed', false);
}
