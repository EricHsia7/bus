import { getLocation, MergedLocation, MergedLocationItem } from '../../../data/apis/getLocation/index';
import { deleteDataReceivingProgress, deleteDataUpdateTime } from '../../../data/apis/loader';
import { IntegratedLocationDetails } from '../../../data/location/details';
import { generateIdentifier } from '../../../tools/index';
import { getPermalink } from '../../../tools/permalink';
import { documentQuerySelector, elementQuerySelector } from '../../../tools/query-selector';
import { pushPageHistory, revokePageHistory } from '../../index';
import { promptMessage } from '../../prompt/index';
import { openQRCode } from '../../qrcode/index';

let previousIntegration = {} as IntegratedLocationDetails;
let previousAnimation: boolean = true;
let previousSkeletonScreen: boolean = false;

const LocationDetailsField = documentQuerySelector('.css_location_details_field');
const LocationDetailsBodyElement = elementQuerySelector(LocationDetailsField, '.css_location_details_body');
const LocationDetailsActionsElement = elementQuerySelector(LocationDetailsBodyElement, '.css_location_details_actions');

function updateLocationDetailsField(integration: IntegratedLocationDetails, skeletonScreen: boolean, animation: boolean) {}

export function openLocationDetails(hash: string): void {
  pushPageHistory('LocationDetails');
  LocationDetailsField.setAttribute('displayed', 'true');
  updateLocationDetailsField(hash);
}

export function closeLocationDetails(): void {
  revokePageHistory('LocationDetails');
  LocationDetailsField.setAttribute('displayed', 'false');
}

export async function shareLocationPermalink(hash: string) {
  const requestID = generateIdentifier();
  const Location = (await getLocation(requestID, 1)) as MergedLocation;
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  const thisLocationKey = `ml_${hash}`;
  if (Location.hasOwnProperty(thisLocationKey)) {
    const thisLocation = Location[thisLocationKey] as MergedLocationItem;
    const link = getPermalink(1, {
      hash: hash
    });
    if (navigator.share) {
      navigator
        .share({
          title: thisLocation.n,
          url: link
        })
        .then(() => {
          promptMessage('已分享地點連結', 'link');
        })
        .catch((e) => {
          promptMessage('已取消分享連結', 'cancel');
          console.error(e);
        });
    }
  }
}

export async function showLocationPermalinkQRCode(hash: string) {
  const requestID = generateIdentifier();
  const Location = (await getLocation(requestID, 1)) as MergedLocation;
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  const thisLocationKey = `ml_${hash}`;
  if (Location.hasOwnProperty(thisLocationKey)) {
    const link = getPermalink(1, {
      hash: hash
    });
    openQRCode(link);
  }
}
