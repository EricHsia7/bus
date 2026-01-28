import { isFolderContentSaved } from '../../../data/folder/index';
import { integrateRouteDetails } from '../../../data/route/details';
import { getSettingOptionValue } from '../../../data/settings/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../../tools/elements';
import { booleanToString, generateIdentifier } from '../../../tools/index';
import { pushPageHistory, revokePageHistory } from '../../index';
import { openSaveToFolder } from '../../save-to-folder/index';
import { shareRoutePermalink, showRoutePermalinkQRCode } from './actions';
import { setUpCalendarGroupSkeletonScreen, updateCalendarGroup } from './calendar';
import { setUppropertiesGroupSkeletonScreen, updatePropertiesField } from './properties';

export const RouteDetailsField = documentQuerySelector('.css_route_details_field');
export const RouteDetailsBodyElement = elementQuerySelector(RouteDetailsField, '.css_route_details_body');
export const RouteDetailsGroupsElement = elementQuerySelector(RouteDetailsBodyElement, '.css_route_details_groups');

export const CalendarGroupElement = elementQuerySelector(RouteDetailsGroupsElement, '.css_route_details_group[group="calendar"]');
export const CalendarGroupBodyElement = elementQuerySelector(CalendarGroupElement, '.css_route_details_group_body');
export const CalendarDaysElement = elementQuerySelector(CalendarGroupBodyElement, '.css_route_details_calendar_days');
export const CalendarEventGroupsElement = elementQuerySelector(CalendarGroupBodyElement, '.css_route_details_calendar_event_groups');

export const ActionsGroupElement = elementQuerySelector(RouteDetailsField, '.css_route_details_body .css_route_details_groups .css_route_details_group[group="actions"]');
export const svaeToFolderActionButtonElement = elementQuerySelector(ActionsGroupElement, '.css_route_details_group_body .css_route_details_action_button[action="save-to-folder"]');
export const getPermalinkActionButton = elementQuerySelector(ActionsGroupElement, '.css_route_details_group_body .css_route_details_action_button[action="get-permalink"]');
export const showPermalinkQRCodeActionButton = elementQuerySelector(ActionsGroupElement, '.css_route_details_group_body .css_route_details_action_button[action="show-permalink-qrcode"]');

export const PropertiesGroupElement = elementQuerySelector(RouteDetailsGroupsElement, '.css_route_details_group[group="properties"]');
export const PropertiesGroupBodyElement = elementQuerySelector(PropertiesGroupElement, '.css_route_details_group_body');

async function initializeRouteDetailsField(RouteID: number, PathAttributeId: Array<number>) {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const existence = await isFolderContentSaved('route', RouteID);
  svaeToFolderActionButtonElement.setAttribute('animation', booleanToString(playing_animation));
  svaeToFolderActionButtonElement.setAttribute('highlighted', booleanToString(existence));
  svaeToFolderActionButtonElement.onclick = function () {
    openSaveToFolder('route', [RouteID], svaeToFolderActionButtonElement);
  };
  getPermalinkActionButton.setAttribute('animation', booleanToString(playing_animation));
  getPermalinkActionButton.onclick = function () {
    shareRoutePermalink(RouteID);
  };
  showPermalinkQRCodeActionButton.setAttribute('animation', booleanToString(playing_animation));
  showPermalinkQRCodeActionButton.onclick = function () {
    showRoutePermalinkQRCode(RouteID);
  };
  setUppropertiesGroupSkeletonScreen(PropertiesGroupElement);
  setUpCalendarGroupSkeletonScreen();
  const requestID = generateIdentifier();
  const integration = await integrateRouteDetails(RouteID, PathAttributeId, requestID);
  updatePropertiesField(integration.properties, false, playing_animation);
  updateCalendarGroup(integration.calendar, false, playing_animation);
}

export function openRouteDetails(RouteID: number, PathAttributeId: Array<number>): void {
  pushPageHistory('RouteDetails');
  RouteDetailsField.setAttribute('displayed', 'true');
  initializeRouteDetailsField(RouteID, PathAttributeId);
}

export function closeRouteDetails(): void {
  revokePageHistory('RouteDetails');
  RouteDetailsField.setAttribute('displayed', 'false');
  const CalendarEventGroupElements = elementQuerySelectorAll(CalendarEventGroupsElement, '.css_route_details_calendar_event_group');
  for (const CalendarEventGroupElement of CalendarEventGroupElements) {
    CalendarEventGroupElement.remove();
  }
  const CalendarDayElements = elementQuerySelectorAll(CalendarDaysElement, '.css_route_details_calendar_day');
  for (const CalendarDayElement of CalendarDayElements) {
    CalendarDayElement.remove();
  }
}
