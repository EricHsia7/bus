import { getLocation, MergedLocation, MergedLocationItem } from '../../../data/apis/getLocation/index';
import { deleteDataReceivingProgress, deleteDataUpdateTime } from '../../../data/apis/loader';
import { IntegratedLocationDetails, IntegratedLocationDetailsAction, integrateLocationDetails } from '../../../data/location/details';
import { getSettingOptionValue } from '../../../data/settings/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../../tools/elements';
import { booleanToString, generateIdentifier } from '../../../tools/index';
import { getPermalink } from '../../../tools/permalink';
import { getBlankIconElement, setIcon } from '../../icons/index';
import { GeneratedElement, pushPageHistory, revokePageHistory } from '../../index';
import { promptMessage } from '../../prompt/index';
import { openQRCode } from '../../qrcode/index';

let previousIntegration = {} as IntegratedLocationDetails;
let previousAnimation: boolean = false;
let previousSkeletonScreen: boolean = false;

const LocationDetailsField = documentQuerySelector('.css_location_details_field');
const LocationDetailsBodyElement = elementQuerySelector(LocationDetailsField, '.css_location_details_body');
const LocationDetailsActionsElement = elementQuerySelector(LocationDetailsBodyElement, '.css_location_details_actions');

function generateElementOfItem(): GeneratedElement {
  const element = document.createElement('div');
  element.classList.add('css_location_details_action');

  // Icon
  const icon = document.createElement('div');
  icon.classList.add('css_location_details_action_icon');
  icon.appendChild(getBlankIconElement());
  element.appendChild(icon);

  // Name
  const name = document.createElement('div');
  name.classList.add('css_location_details_action_name');
  element.appendChild(name);

  return {
    element: element,
    id: ''
  };
}

function updateLocationDetailsField(integration: IntegratedLocationDetails, skeletonScreen: boolean, animation: boolean): void {
  function updateItem(thisElement: HTMLElement, thisItem: IntegratedLocationDetailsAction, previousItem: IntegratedLocationDetailsAction | null): void {
    function updateIcon(thisElement: HTMLElement, thisItem: IntegratedLocationDetailsAction): void {
      const thisIconElement = elementQuerySelector(thisElement, '.css_location_details_action_icon');
      setIcon(thisIconElement, thisItem.icon);
    }

    function updateName(thisElement: HTMLElement, thisItem: IntegratedLocationDetailsAction): void {
      const nameElement = elementQuerySelector(thisElement, '.css_location_details_action_name');
      nameElement.innerText = thisItem.name;
    }

    function updateOnclick(thisElement: HTMLElement, thisItem: IntegratedLocationDetailsAction): void {
      thisElement.onclick = thisItem.action;
    }

    function updateAnimation(thisElement: HTMLElement, animation: boolean): void {
      thisElement.setAttribute('animation', booleanToString(animation));
    }

    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      thisElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }

    if (previousItem === null || previousItem === undefined) {
      updateIcon(thisElement, thisItem);
      updateName(thisElement, thisItem);
      updateOnclick(thisElement, thisItem);
      updateAnimation(thisElement, animation);
      updateSkeletonScreen(thisElement, skeletonScreen);
    } else {
      if (previousItem.key !== thisItem.key) {
        updateIcon(thisElement, thisItem);
        updateName(thisElement, thisItem);
        updateOnclick(thisElement, thisItem);
      }

      if (animation !== previousAnimation) {
        updateAnimation(thisElement, animation);
      }

      if (skeletonScreen !== previousSkeletonScreen) {
        updateSkeletonScreen(thisElement, skeletonScreen);
      }
    }
  }

  const actions = integration.actions;
  const actionsQuantity = integration.actionsQuantity;

  const currentActionsSeatQuantity = elementQuerySelectorAll(LocationDetailsActionsElement, '.css_location_details_action').length;
  if (actionsQuantity !== currentActionsSeatQuantity) {
    const capacity = currentActionsSeatQuantity - actionsQuantity;
    if (capacity < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o < Math.abs(capacity); o++) {
        const newItemElement = generateElementOfItem();
        fragment.appendChild(newItemElement.element);
      }
      LocationDetailsActionsElement.append(fragment);
    } else {
      const LocationActionElements = elementQuerySelectorAll(LocationDetailsActionsElement, '.css_location_details_action');
      for (let o = 0; o < Math.abs(capacity); o++) {
        const itemIndex = currentActionsSeatQuantity - 1 - o;
        LocationActionElements[itemIndex].remove();
      }
    }
  }

  const LocationActionElements = elementQuerySelectorAll(LocationDetailsActionsElement, '.css_location_details_action');

  for (let i = 0; i < actionsQuantity; i++) {
    const thisElement = LocationActionElements[i];
    const thisItem = actions[i];
    if (previousIntegration.hasOwnProperty('actions')) {
      if (previousIntegration.actions[i]) {
        const previousItem = previousIntegration.actions[i];
        updateItem(thisElement, thisItem, previousItem);
      } else {
        updateItem(thisElement, thisItem, null);
      }
    } else {
      updateItem(thisElement, thisItem, null);
    }
  }

  previousIntegration = integration;
  previousAnimation = animation;
  previousSkeletonScreen = skeletonScreen;
}

function setUpLocationDetailsFieldSkeletonScreen(): void {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const actions: IntegratedLocationDetailsAction[] = [];
  /*
  const WindowSize = querySize('window');
  const FieldWidth = WindowSize.width;
  const FieldHeight = WindowSize.height;
  */
  const defaultActionsQuantity = 3;
  for (let i = 0; i < defaultActionsQuantity; i++) {
    actions.push({
      name: '',
      icon: '',
      key: `action-${i}`,
      action: function () {}
    });
  }

  updateLocationDetailsField(
    {
      actions: actions,
      actionsQuantity: defaultActionsQuantity,
      hash: ''
    },
    true,
    playing_animation
  );
}

async function initializeLocationDetailsField(hash: string) {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const requestID = generateIdentifier();
  const integration = await integrateLocationDetails(hash, requestID);
  updateLocationDetailsField(integration, false, playing_animation);
}

export function openLocationDetails(hash: string): void {
  pushPageHistory('LocationDetails');
  LocationDetailsField.setAttribute('displayed', 'true');
  setUpLocationDetailsFieldSkeletonScreen();
  initializeLocationDetailsField(hash);
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
          promptMessage('已分享地點', 'check_circle');
        })
        .catch((e) => {
          promptMessage('已取消分享', 'cancel');
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
