import { integrateRouteDetails } from '../../../data/route/details';
import { setUpCalendarGroupSkeletonScreen, updateCalendarDays, updateCalendarEvents } from './calendar';
import { setUpPropertiesFieldSkeletonScreen, updatePropertiesField } from './properties';
import { booleanToString, generateIdentifier } from '../../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../../tools/query-selector';
import { isSaved } from '../../../data/folder/index';
import { pushPageHistory, revokePageHistory } from '../../index';
import { getSettingOptionValue } from '../../../data/settings/index';

const RouteDetailsField = documentQuerySelector('.css_route_details_field');
const actionsField: HTMLElement = elementQuerySelector(RouteDetailsField, '.css_route_details_body .css_route_details_groups .css_route_details_group[group="actions"]');
const propertiesField: HTMLElement = elementQuerySelector(RouteDetailsField, '.css_route_details_body .css_route_details_groups .css_route_details_group[group="properties"]');

const svaeToFolderActionButtonElement = elementQuerySelector(actionsField, '.css_route_details_group_body .css_route_details_action_button[action="save-to-folder"]');
const getPermalinkActionButton = elementQuerySelector(actionsField, '.css_route_details_group_body .css_route_details_action_button[action="get-permalink"]');

async function initializeRouteDetailsField(RouteID: number, PathAttributeId: Array<number>): void {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const existence = await isSaved('route', RouteID);
  svaeToFolderActionButtonElement.setAttribute('animation', booleanToString(playing_animation));
  svaeToFolderActionButtonElement.setAttribute('highlighted', booleanToString(existence));
  svaeToFolderActionButtonElement.setAttribute('onclick', `bus.folder.openSaveToFolder('route', [${RouteID}])`);
  getPermalinkActionButton.setAttribute('animation', booleanToString(playing_animation));
  getPermalinkActionButton.setAttribute('onclick', `bus.route.shareRoutePermalink(${RouteID})`);
  setUpPropertiesFieldSkeletonScreen(propertiesField);
  setUpCalendarGroupSkeletonScreen();
  const requestID = generateIdentifier('r');
  const integration = await integrateRouteDetails(RouteID, PathAttributeId, requestID);
  updatePropertiesField(propertiesField, integration.properties, false, playing_animation);
  updateCalendarDays(integration.calendar, false, playing_animation);
  updateCalendarEvents(integration.calendar, false, playing_animation);
}

export function openRouteDetails(RouteID: number, PathAttributeId: Array<number>): void {
  pushPageHistory('RouteDetails');
  RouteDetailsField.setAttribute('displayed', 'true');
  initializeRouteDetailsField(RouteID, PathAttributeId);
}

export function closeRouteDetails(): void {
  revokePageHistory('RouteDetails');
  RouteDetailsField.setAttribute('displayed', 'false');
}
