import { getRoute, SimplifiedRoute, SimplifiedRouteItem } from '../../data/apis/getRoute/index';
import { deleteDataReceivingProgress, deleteDataUpdateTime } from '../../data/apis/loader';
import { IntegratedRouteDetails, IntegratedRouteDetailsAction, integrateRouteDetails } from '../../data/route/details';
import { getSettingOptionValue } from '../../data/settings/index';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/elements';
import { booleanToString, generateIdentifier, hasOwnProperty } from '../../tools/index';
import { getPermalink } from '../../tools/permalink';
import { shareLink } from '../../tools/share';
import { getBlankIconElement, setIcon } from '../icons/index';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';
import { openQRCode } from '../qrcode/index';

let previousIntegration = {} as IntegratedRouteDetails;
let previousAnimation: boolean = false;
let previousSkeletonScreen: boolean = false;

const RouteDetailsField = documentQuerySelector('.css_route_details_field');
const RouteDetailsBodyElement = elementQuerySelector(RouteDetailsField, '.css_route_details_body');
const RouteDetailsActionsElement = elementQuerySelector(RouteDetailsBodyElement, '.css_route_details_actions');

function generateElementOfItem(): HTMLElement {
  const element = documentCreateDivElement();
  element.classList.add('css_route_details_action');

  // Icon
  const icon = documentCreateDivElement();
  icon.classList.add('css_route_details_action_icon');
  icon.appendChild(getBlankIconElement());
  element.appendChild(icon);

  // Name
  const name = documentCreateDivElement();
  name.classList.add('css_route_details_action_name');
  element.appendChild(name);

  return element;
}

function updateRouteDetailsField(integration: IntegratedRouteDetails, skeletonScreen: boolean, animation: boolean): void {
  function updateItem(thisElement: HTMLElement, thisItem: IntegratedRouteDetailsAction, previousItem: IntegratedRouteDetailsAction | null): void {
    function updateIcon(thisElement: HTMLElement, thisItem: IntegratedRouteDetailsAction): void {
      const thisIconElement = elementQuerySelector(thisElement, '.css_route_details_action_icon');
      setIcon(thisIconElement, thisItem.icon);
    }

    function updateName(thisElement: HTMLElement, thisItem: IntegratedRouteDetailsAction): void {
      const nameElement = elementQuerySelector(thisElement, '.css_route_details_action_name');
      nameElement.innerText = thisItem.name;
    }

    function updateOnclick(thisElement: HTMLElement, thisItem: IntegratedRouteDetailsAction): void {
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

  const actionElements = Array.from(elementQuerySelectorAll(RouteDetailsActionsElement, '.css_route_details_action'));
  const currentActionElementsLength = actionElements.length;
  if (actionsQuantity !== currentActionElementsLength) {
    const difference = currentActionElementsLength - actionsQuantity;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newItemElement = generateElementOfItem();
        fragment.appendChild(newItemElement);
        actionElements.push(newItemElement);
      }
      RouteDetailsActionsElement.append(fragment);
    } else if (difference > 0) {
      for (let p = currentActionElementsLength - 1, q = currentActionElementsLength - difference - 1; p > q; p--) {
        actionElements[p].remove();
        actionElements.splice(p, 1);
      }
    }
  }

  for (let i = 0; i < actionsQuantity; i++) {
    const thisElement = actionElements[i];
    const thisItem = actions[i];
    if (hasOwnProperty(previousIntegration, 'actions')) {
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

function setupRouteDetailsFieldSkeletonScreen(): void {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const actions: IntegratedRouteDetailsAction[] = [];
  /*
  const WindowSize = querySize('window');
  const FieldWidth = WindowSize.width;
  const FieldHeight = WindowSize.height;
  */
  const defaultActionsQuantity = 4;
  for (let i = 0; i < defaultActionsQuantity; i++) {
    actions.push({
      name: '',
      icon: '',
      key: `action-${i}`,
      action: function () {}
    });
  }

  updateRouteDetailsField(
    {
      actions: actions,
      actionsQuantity: defaultActionsQuantity,
      RouteID: 0
    },
    true,
    playing_animation
  );
}

async function initializeRouteDetailsField(RouteID: SimplifiedRouteItem['id'], PathAttributeId: SimplifiedRouteItem['pid']) {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const requestID = generateIdentifier();
  setupRouteDetailsFieldSkeletonScreen();
  const integration = await integrateRouteDetails(RouteID, PathAttributeId, requestID);
  updateRouteDetailsField(integration, false, playing_animation);
}

export function showRouteDetails(): void {
  RouteDetailsField.setAttribute('displayed', 'true');
}

export function hideRouteDetails(): void {
  RouteDetailsField.setAttribute('displayed', 'false');
}

export function openRouteDetails(RouteID: SimplifiedRouteItem['id'], PathAttributeId: SimplifiedRouteItem['pid']): void {
  pushPageHistory('RouteDetails');
  showRouteDetails();
  initializeRouteDetailsField(RouteID, PathAttributeId);
  hidePreviousPage();
}

export function closeRouteDetails(): void {
  hideRouteDetails();
  showPreviousPage();
  revokePageHistory('RouteDetails');
}

export async function shareRoutePermalink(RouteID: SimplifiedRouteItem['id']) {
  const requestID = generateIdentifier();
  const Route = (await getRoute(requestID, true)) as SimplifiedRoute;
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  const thisRouteKey = `r_${RouteID}`;
  if (hasOwnProperty(Route, thisRouteKey)) {
    const thisRoute = Route[thisRouteKey] as SimplifiedRouteItem;
    const link = getPermalink(0, {
      id: RouteID,
      name: thisRoute.n
    });
    shareLink(thisRoute.n, link);
  }
}

export async function showRoutePermalinkQRCode(RouteID: SimplifiedRouteItem['id']) {
  const requestID = generateIdentifier();
  const Route = (await getRoute(requestID, true)) as SimplifiedRoute;
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  const thisRouteKey = `r_${RouteID}`;
  if (hasOwnProperty(Route, thisRouteKey)) {
    const thisRoute = Route[thisRouteKey] as SimplifiedRouteItem;
    const link = getPermalink(0, {
      id: RouteID,
      name: thisRoute.n
    });
    openQRCode(link);
  }
}
