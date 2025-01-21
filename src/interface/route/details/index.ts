import { integrateRouteDetails } from '../../../data/route/details';
import { initializeCalendarGridlines, setUpCalendarFieldSkeletonScreen, updateCalendarField } from './calendar';
import { setUpPropertiesFieldSkeletonScreen, updatePropertiesField } from './properties';
import { booleanToString, generateIdentifier } from '../../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../../tools/query-selector';
import { isSaved } from '../../../data/folder/index';
import { pushPageHistory, revokePageHistory } from '../../index';
import { getSettingOptionValue } from '../../../data/settings/index';

const actionsField: HTMLElement = elementQuerySelector(Field, '.css_route_details_body .css_route_details_groups .css_route_details_group[group="actions"]');
const propertiesField: HTMLElement = elementQuerySelector(Field, '.css_route_details_body .css_route_details_groups .css_route_details_group[group="properties"]');
const calendarField: HTMLElement = elementQuerySelector(Field, '.css_route_details_body .css_route_details_groups .css_route_details_group[group="calendar"]');

const svaeToFolderActionButtonElement = elementQuerySelector(actionsField, '.css_route_details_group_body .css_route_details_action_button[action="save-to-folder"]');
const getPermalinkActionButton = elementQuerySelector(actionsField, '.css_route_details_group_body .css_route_details_action_button[action="get-permalink"]');

async function initializeRouteDetailsField(Field: HTMLElement, RouteID: number, PathAttributeId: Array<number>): void {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const existence = await isSaved('route', RouteID);
  svaeToFolderActionButtonElement.setAttribute('animation', booleanToString(playing_animation));
  svaeToFolderActionButtonElement.setAttribute('highlighted', existence);
  svaeToFolderActionButtonElement.setAttribute('onclick', `bus.folder.openSaveToFolder('route', [${RouteID}])`);
  getPermalinkActionButton.setAttribute('animation', booleanToString(playing_animation));
  getPermalinkActionButton.setAttribute('onclick', `bus.route.shareRoutePermalink(${RouteID})`);
  setUpPropertiesFieldSkeletonScreen(propertiesField);
  initializeCalendarGridlines(calendarField);
  setUpCalendarFieldSkeletonScreen(calendarField);
  const requestID = generateIdentifier('r');
  const integration = await integrateRouteDetails(RouteID, PathAttributeId, requestID);
  updatePropertiesField(propertiesField, integration.properties, false, playing_animation);
  updateCalendarField(calendarField, integration.calendar, false, playing_animation);
}
thisElement.setAttribute('animation', booleanToString(animation));

export function openRouteDetails(RouteID: number, PathAttributeId: Array<number>): void {
  pushPageHistory('RouteDetails');
  var Field: HTMLElement = documentQuerySelector('.css_route_details_field');
  Field.setAttribute('displayed', true);
  initializeRouteDetailsField(Field, RouteID, PathAttributeId);
}

export function closeRouteDetails(): void {
  revokePageHistory('RouteDetails');
  var Field: HTMLElement = documentQuerySelector('.css_route_details_field');
  Field.setAttribute('displayed', false);
}
