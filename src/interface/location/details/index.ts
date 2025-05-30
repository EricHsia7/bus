import { isFolderContentSaved } from '../../../data/folder/index';
import { getSettingOptionValue } from '../../../data/settings/index';
import { booleanToString } from '../../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../../tools/query-selector';
import { pushPageHistory, revokePageHistory } from '../../index';
import { openSaveToFolder } from '../../save-to-folder/index';
import { shareLocationPermalink, showLocationPermalinkQRCode } from './actions';

export const LocationDetailsField = documentQuerySelector('.css_location_details_field');
export const LocationDetailsBodyElement = elementQuerySelector(LocationDetailsField, '.css_location_details_body');
export const LocationDetailsGroupsElement = elementQuerySelector(LocationDetailsBodyElement, '.css_location_details_groups');

export const LocationActionsGroupElement = elementQuerySelector(LocationDetailsField, '.css_location_details_body .css_location_details_groups .css_location_details_group[group="actions"]');
export const LocationSaveToFolderActionButton = elementQuerySelector(LocationActionsGroupElement, '.css_location_details_group_body .css_location_details_action_button[action="save-to-folder"]');
export const LocationGetPermalinkActionButton = elementQuerySelector(LocationActionsGroupElement, '.css_location_details_group_body .css_location_details_action_button[action="get-permalink"]');
export const LocationShowPermalinkQRCodeActionButton = elementQuerySelector(LocationActionsGroupElement, '.css_location_details_group_body .css_location_details_action_button[action="show-permalink-qrcode"]');

// export const PropertiesGroupElement = elementQuerySelector(LocationDetailsField, '.css_location_details_body .css_location_details_groups .css_location_details_group[group="properties"]');

async function initializeLocationDetailsField(hash: string) {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const existence = await isFolderContentSaved('location', hash);
  LocationSaveToFolderActionButton.setAttribute('animation', booleanToString(playing_animation));
  LocationSaveToFolderActionButton.setAttribute('highlighted', booleanToString(existence));
  LocationSaveToFolderActionButton.onclick = function () {
    openSaveToFolder('location', [hash]);
  };
  LocationGetPermalinkActionButton.setAttribute('animation', booleanToString(playing_animation));
  LocationGetPermalinkActionButton.onclick = function () {
    shareLocationPermalink(hash);
  };
  LocationShowPermalinkQRCodeActionButton.setAttribute('animation', booleanToString(playing_animation));
  LocationShowPermalinkQRCodeActionButton.onclick = function () {
    showLocationPermalinkQRCode(hash);
  };
}

export function openLocationDetails(hash: string): void {
  pushPageHistory('LocationDetails');
  LocationDetailsField.setAttribute('displayed', 'true');
  initializeLocationDetailsField(hash);
}

export function closeRouteDetails(): void {
  revokePageHistory('LocationDetails');
  LocationDetailsField.setAttribute('displayed', 'false');
}
