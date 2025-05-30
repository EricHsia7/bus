import { getUpdateRate } from '../../../data/analytics/update-rate/index';
import { DataReceivingProgressEvent } from '../../../data/apis/loader';
import { Folder, integratedFolder, integratedFolderContent, integratedFolders, integrateFolders } from '../../../data/folder/index';
import { getSettingOptionValue, SettingSelectOptionRefreshIntervalValue } from '../../../data/settings/index';
import { booleanToString, compareThings, generateIdentifier } from '../../../tools/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../../tools/query-selector';
import { getIconHTML } from '../../icons/index';
import { MaterialSymbols } from '../../icons/material-symbols-type';
import { GeneratedElement, querySize } from '../../index';
import { openLocation } from '../../location/index';
import { promptMessage } from '../../prompt/index';
import { openRoute } from '../../route/index';

const HomeField = documentQuerySelector('.css_home_field');
const HomeHeadElement = elementQuerySelector(HomeField, '.css_home_head');
const HomeBodyElement = elementQuerySelector(HomeField, '.css_home_body');
const HomeFoldersElement = elementQuerySelector(HomeBodyElement, '.css_home_folders');
const HomeUpdateTimerElement = elementQuerySelector(HomeHeadElement, '.css_home_update_timer_box .css_home_update_timer');

let previousIntegration = {} as integratedFolders;
let previousAnimation: boolean = false;
let previousSkeletonScreen: boolean = false;

let foldersRefreshTimer_retryInterval: number = 10 * 1000;
let foldersRefreshTimer_baseInterval: number = 15 * 1000;
let foldersRefreshTimer_minInterval: number = 5 * 1000;
let foldersRefreshTimer_dynamicInterval: number = 15 * 1000;
let foldersRefreshTimer_dynamic: boolean = true;
let foldersRefreshTimer_lastUpdate: number = 0;
let foldersRefreshTimer_nextUpdate: number = 0;
let foldersRefreshTimer_currentRequestID: string = '';
let foldersRefreshTimer_refreshing: boolean = false;
let foldersRefreshTimer_streaming: boolean = false;
let foldersRefreshTimer_streamStarted: boolean = false;

function generateElementOfItem(): GeneratedElement {
  // Main container
  const itemElement = document.createElement('div');
  itemElement.classList.add('css_home_folder_item');
  itemElement.setAttribute('type', 'stop');

  // Icon
  const iconElement = document.createElement('div');
  iconElement.classList.add('css_home_folder_item_icon');
  iconElement.innerHTML = getIconHTML('location_on');

  // Context
  const contextElement = document.createElement('div');
  contextElement.classList.add('css_home_folder_item_context');

  // Main
  const mainElement = document.createElement('div');
  mainElement.classList.add('css_home_folder_item_main');

  // Capsule
  const capsuleElement = document.createElement('div');
  capsuleElement.classList.add('css_home_folder_item_capsule');

  // Status
  const statusElement = document.createElement('div');
  statusElement.classList.add('css_home_folder_item_status');

  const nextSlideElement = document.createElement('div');
  nextSlideElement.classList.add('css_next_slide');
  nextSlideElement.setAttribute('code', '0');
  nextSlideElement.setAttribute('displayed', 'false');

  const currentSlideElement = document.createElement('div');
  currentSlideElement.classList.add('css_current_slide');
  currentSlideElement.setAttribute('code', '0');
  currentSlideElement.setAttribute('displayed', 'true');

  statusElement.appendChild(nextSlideElement);
  statusElement.appendChild(currentSlideElement);

  // Button
  const buttonElement = document.createElement('div');
  buttonElement.classList.add('css_home_folder_item_button');
  buttonElement.innerHTML = getIconHTML('keyboard_arrow_right');

  // Capsule separator
  const capsuleSeparatorElement = document.createElement('div');
  capsuleSeparatorElement.classList.add('css_home_folder_item_capsule_separator');

  // Assemble capsule
  capsuleElement.appendChild(statusElement);
  capsuleElement.appendChild(buttonElement);
  capsuleElement.appendChild(capsuleSeparatorElement);

  // Assemble item
  itemElement.appendChild(iconElement);
  itemElement.appendChild(contextElement);
  itemElement.appendChild(mainElement);
  itemElement.appendChild(capsuleElement);

  return {
    element: itemElement,
    id: ''
  };
}

function generateElementOfFolder(): GeneratedElement {
  // Main container
  const folderElement = document.createElement('div');
  folderElement.classList.add('css_home_folder');

  // Head
  const headElement = document.createElement('div');
  headElement.classList.add('css_home_folder_head');

  // Icon
  const iconElement = document.createElement('div');
  iconElement.classList.add('css_home_folder_icon');

  // Name
  const nameElement = document.createElement('div');
  nameElement.classList.add('css_home_folder_name');

  // Assemble head
  headElement.appendChild(iconElement);
  headElement.appendChild(nameElement);

  // Content
  const contentElement = document.createElement('div');
  contentElement.classList.add('css_home_folder_content');

  // Assemble folder
  folderElement.appendChild(headElement);
  folderElement.appendChild(contentElement);

  return {
    element: folderElement,
    id: ''
  };
}

function animateUpdateTimer(): void {
  HomeUpdateTimerElement.style.setProperty('--b-cssvar-home-update-timer-interval', `${foldersRefreshTimer_dynamicInterval}ms`);
  HomeUpdateTimerElement.classList.add('css_home_update_timer_slide_rtl');
}

function handleDataReceivingProgressUpdates(event: Event): void {
  const CustomEvent = event as DataReceivingProgressEvent;
  if (foldersRefreshTimer_refreshing) {
    const offsetRatio = CustomEvent.detail.progress - 1;
    HomeUpdateTimerElement.style.setProperty('--b-cssvar-home-update-timer-offset-ratio', offsetRatio.toString());
  }
  if (CustomEvent.detail.stage === 'end') {
    document.removeEventListener(CustomEvent.detail.target, handleDataReceivingProgressUpdates);
  }
}

export function setUpFolderFieldSkeletonScreen(): void {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const WindowSize = querySize('window');
  const FieldWidth = WindowSize.width;
  const FieldHeight = WindowSize.height;
  const contentLength = Math.floor(FieldHeight / 50 / 3) + 2;
  const folderQuantity = 3;

  const folders: integratedFolders['folders'] = [];
  for (let i = 0; i < folderQuantity; i++) {
    const folder: integratedFolder = {
      name: '',
      icon: '',
      id: '',
      timestamp: 0,
      content: [],
      contentLength: contentLength
    };

    for (let j = 0; j < contentLength; j++) {
      const folderContent: integratedFolderContent = {
        type: 'stop',
        id: 0,
        timestamp: 0,
        name: '',
        status: {
          code: 8,
          text: '',
          time: -6
        },
        direction: 0,
        route: {
          name: '',
          endPoints: {
            departure: '',
            destination: ''
          },
          id: 0,
          pathAttributeId: []
        }
      };
      folder.content.push(folderContent);
    }
    folders.push(folder);
  }

  updateFoldersElement(
    {
      folders: folders,
      dataUpdateTime: 0
    },
    true,
    playing_animation
  );
}

function updateFoldersElement(integration: integratedFolders, skeletonScreen: boolean, animation: boolean): void {
  function updateItem(thisElement: HTMLElement, thisItem: integratedFolderContent, previousItem: integratedFolderContent | null) {
    function updateType(thisElement: HTMLElement, thisItem: integratedFolderContent): void {
      thisElement.setAttribute('type', thisItem.type);
    }

    function updateIcon(thisElement: HTMLElement, thisItem: integratedFolderContent): void {
      const iconElement = elementQuerySelector(thisElement, '.css_home_folder_item_icon');
      let icon = '' as MaterialSymbols;
      switch (thisItem.type) {
        case 'stop':
          icon = 'location_on';
          break;
        case 'route':
          icon = 'route';
          break;
        case 'location':
          icon = 'location_on';
          break;
        case 'bus':
          icon = 'directions_bus';
          break;
        case 'empty':
          icon = 'lightbulb';
          break;
        default:
          icon = '';
          break;
      }
      iconElement.innerHTML = getIconHTML(icon);
    }

    function updateStatus(thisElement: HTMLElement, thisItem: integratedFolderContent, animation: boolean): void {
      if (thisItem.type === 'stop') {
        const thisElementRect = thisElement.getBoundingClientRect();
        const top = thisElementRect.top;
        const left = thisElementRect.left;
        const bottom = thisElementRect.bottom;
        const right = thisElementRect.right;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const thisItemStatusElement = elementQuerySelector(thisElement, '.css_home_folder_item_capsule .css_home_folder_item_status');
        const nextSlideElement = elementQuerySelector(thisItemStatusElement, '.css_next_slide');
        const currentSlideElement = elementQuerySelector(thisItemStatusElement, '.css_current_slide');

        nextSlideElement.setAttribute('code', thisItem.status.code.toString());
        nextSlideElement.innerText = thisItem.status.text;

        if (animation && bottom > 0 && top < windowHeight && right > 0 && left < windowWidth) {
          currentSlideElement.addEventListener(
            'animationend',
            function () {
              currentSlideElement.setAttribute('code', thisItem.status.code.toString());
              currentSlideElement.innerText = thisItem.status.text;
              currentSlideElement.classList.remove('css_slide_fade_out');
              nextSlideElement.setAttribute('displayed', 'false');
            },
            { once: true }
          );
          nextSlideElement.setAttribute('displayed', 'true');
          currentSlideElement.classList.add('css_slide_fade_out');
        } else {
          currentSlideElement.setAttribute('code', thisItem.status.code.toString());
          currentSlideElement.innerText = thisItem.status.text;
        }
      }
    }

    function updateMain(thisElement: HTMLElement, thisItem: integratedFolderContent): void {
      let main: string = '';
      switch (thisItem.type) {
        case 'stop':
          main = thisItem.name;
          break;
        case 'route':
          main = thisItem.name;
          break;
        case 'location':
          main = thisItem.name;
          break;
        case 'bus':
          main = thisItem.busID;
          break;
        case 'empty':
          main = '沒有內容';
          break;
        default:
          main = 'null';
          break;
      }
      elementQuerySelector(thisElement, '.css_home_folder_item_main').innerText = main;
    }

    function updateContext(thisElement: HTMLElement, thisItem: integratedFolderContent): void {
      let context: string = '';
      switch (thisItem.type) {
        case 'stop':
          context = `${thisItem.route ? thisItem.route.name : ''} - 往${thisItem.route ? [thisItem.route.endPoints.destination, thisItem.route.endPoints.departure, ''][thisItem.direction ? thisItem.direction : 0] : ''}`;
          break;
        case 'route':
          context = `${thisItem.endPoints.departure} \u2194 ${thisItem.endPoints.destination}`;
          break;
        case 'location':
          context = '地點';
          break;
        case 'bus':
          // context = thisItem.currentRoute.name; // TODO: integration
          break;
        case 'empty':
          context = '提示';
          break;
        default:
          context = 'null';
          break;
      }
      elementQuerySelector(thisElement, '.css_home_folder_item_context').innerText = context;
    }

    function updateButton(thisElement: HTMLElement, thisItem: integratedFolderContent): void {
      const buttonElement = elementQuerySelector(thisElement, '.css_home_folder_item_capsule .css_home_folder_item_button');
      switch (thisItem.type) {
        case 'stop':
          buttonElement.onclick = function () {
            openRoute(thisItem.route.id, thisItem.route.pathAttributeId);
          };
          break;
        case 'route':
          buttonElement.onclick = function () {
            openRoute(thisItem.id, thisItem.pathAttributeId);
          };
          break;
        case 'location':
          buttonElement.onclick = function () {
            openLocation(thisItem.id);
          };
          break;
        case 'bus':
          break;
        case 'empty':
          break;
        default:
          break;
      }
    }

    function updateAnimation(thisElement: HTMLElement, animation: boolean): void {
      thisElement.setAttribute('animation', booleanToString(animation));
    }

    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      thisElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }

    if (previousItem === null) {
      updateType(thisElement, thisItem);
      updateIcon(thisElement, thisItem);
      updateStatus(thisElement, thisItem, animation);
      updateMain(thisElement, thisItem);
      updateContext(thisElement, thisItem);
      updateButton(thisElement, thisItem);
      updateAnimation(thisElement, animation);
      updateSkeletonScreen(thisElement, skeletonScreen);
    } else {
      if (thisItem.type !== previousItem.type) {
        updateType(thisElement, thisItem);
        updateIcon(thisElement, thisItem);
        updateStatus(thisElement, thisItem, animation);
        updateMain(thisElement, thisItem);
        updateContext(thisElement, thisItem);
        updateButton(thisElement, thisItem);
        updateAnimation(thisElement, animation);
        updateSkeletonScreen(thisElement, skeletonScreen);
      } else {
        switch (thisItem.type) {
          case 'stop':
            if (!compareThings(previousItem.route, thisItem.route)) {
              updateContext(thisElement, thisItem);
              updateButton(thisElement, thisItem);
            }
            if (!compareThings(previousItem.name, thisItem.name)) {
              updateMain(thisElement, thisItem);
            }
            if (thisItem.status.code !== previousItem.status.code || !compareThings(previousItem.status.text, thisItem.status.text)) {
              updateStatus(thisElement, thisItem, animation);
            }
            break;
          case 'route':
            if (!compareThings(previousItem.id, thisItem.id)) {
              updateButton(thisElement, thisItem);
            }
            if (!compareThings(previousItem.endPoints, thisItem.endPoints)) {
              updateContext(thisElement, thisItem);
            }
            if (!compareThings(previousItem.name, thisItem.name)) {
              updateMain(thisElement, thisItem);
            }
            break;
          case 'location':
            if (!compareThings(previousItem.id, thisItem.id)) {
              updateButton(thisElement, thisItem);
            }
            if (!compareThings(previousItem.name, thisItem.name)) {
              updateMain(thisElement, thisItem);
            }
            /*
            if (!compareThings(previousItem.labels, thisItem.labels)) {
              updateContext(thisElement, thisItem);
            }
            */
            break;
          case 'bus':
            if (!compareThings(previousItem.currentRoute, thisItem.currentRoute)) {
              updateContext(thisElement, thisItem);
            }
            if (!compareThings(previousItem.busID, thisItem.busID)) {
              updateMain(thisElement, thisItem);
            }
            break;
          case 'empty':
            if (thisItem.type !== previousItem.type) {
              updateContext(thisElement, thisItem);
              updateMain(thisElement, thisItem);
            }
            break;
          default:
            break;
        }
        if (skeletonScreen !== previousSkeletonScreen) {
          updateSkeletonScreen(thisElement, skeletonScreen);
        }
        if (animation !== previousAnimation) {
          updateAnimation(thisElement, animation);
        }
      }
    }
  }

  function updateFolder(thisElement: HTMLElement, thisFolder: Folder, previousFolder: Folder | null): void {
    function updateName(thisElement: HTMLElement, thisFolder: Folder): void {
      const thisHeadElement = elementQuerySelector(thisElement, `.css_home_folder_head`);
      const thisNameElememt = elementQuerySelector(thisHeadElement, '.css_home_folder_name');
      thisNameElememt.innerText = thisFolder.name;
    }

    function updateIcon(thisElement: HTMLElement, thisFolder: Folder): void {
      const thisHeadElement = elementQuerySelector(thisElement, `.css_home_folder_head`);
      const thisIconElememt = elementQuerySelector(thisHeadElement, '.css_home_folder_icon');
      thisIconElememt.innerHTML = getIconHTML(thisFolder.icon);
    }

    function updateAnimation(thisElement: HTMLElement, animation: boolean): void {
      thisElement.setAttribute('animation', booleanToString(animation));
    }

    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      thisElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }

    if (previousFolder === null) {
      updateName(thisElement, thisFolder);
      updateIcon(thisElement, thisFolder);
      updateAnimation(thisElement, animation);
      updateSkeletonScreen(thisElement, skeletonScreen);
    } else {
      if (thisFolder.name !== previousFolder.name) {
        updateName(thisElement, thisFolder);
      }
      if (thisFolder.icon !== previousFolder.icon) {
        updateIcon(thisElement, thisFolder);
      }
      if (animation !== previousAnimation) {
        updateAnimation(thisElement, animation);
      }
      if (skeletonScreen !== previousSkeletonScreen) {
        updateSkeletonScreen(thisElement, skeletonScreen);
      }
    }
  }

  const folders = integration.folders;
  const foldersLength = folders.length;

  const currentFolderSeatQuantity = elementQuerySelectorAll(HomeFoldersElement, '.css_home_folder').length;
  if (foldersLength !== currentFolderSeatQuantity) {
    const capacity = currentFolderSeatQuantity - foldersLength;
    if (capacity < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o < Math.abs(capacity); o++) {
        const newFolderElement = generateElementOfFolder();
        fragment.appendChild(newFolderElement.element);
      }
      HomeFoldersElement.append(fragment);
    } else {
      const FolderElements = elementQuerySelectorAll(HomeFoldersElement, '.css_home_folder');
      for (let o = 0; o < Math.abs(capacity); o++) {
        const folderIndex = currentFolderSeatQuantity - 1 - o;
        FolderElements[folderIndex].remove();
      }
    }
  }

  const FolderElements = elementQuerySelectorAll(HomeFoldersElement, '.css_home_folder');
  for (let i = 0; i < foldersLength; i++) {
    const thisFolder = folders[i];
    const thisFolderContent = thisFolder.content;
    const thisFolderContentLength = thisFolderContent.length;
    const thisFolderElement = FolderElements[i];
    const thisFolderContentElement = elementQuerySelector(thisFolderElement, '.css_home_folder_content');
    const currentItemSeatQuantity = elementQuerySelectorAll(thisFolderContentElement, '.css_home_folder_item').length;
    if (thisFolderContentLength !== currentItemSeatQuantity) {
      const capacity = currentItemSeatQuantity - thisFolderContentLength;
      if (capacity < 0) {
        for (let o = 0; o < Math.abs(capacity); o++) {
          const newItemElement = generateElementOfItem();
          thisFolderContentElement.appendChild(newItemElement.element);
        }
      } else {
        const FolderContentItemElements = elementQuerySelectorAll(thisFolderContentElement, '.css_home_folder_item');
        for (let o = 0; o < Math.abs(capacity); o++) {
          const itemIndex = currentItemSeatQuantity - 1 - o;
          FolderContentItemElements[itemIndex].remove();
        }
      }
    }
  }

  const FolderElements2 = elementQuerySelectorAll(HomeFoldersElement, '.css_home_folder');
  for (let i = 0; i < foldersLength; i++) {
    const thisFolder = folders[i];
    const thisFolderContent = thisFolder.content;
    const thisFolderContentLength = thisFolderContent.length; // the actual length (including 'empty content')
    const thisFolderElement = FolderElements2[i];
    const thisFolderContentElement = elementQuerySelector(thisFolderElement, '.css_home_folder_content');
    if (previousIntegration.hasOwnProperty('folders')) {
      if (previousIntegration.folders[i]) {
        const previousFolder = previousIntegration.folders[i];
        updateFolder(thisFolderElement, thisFolder, previousFolder);
      } else {
        updateFolder(thisFolderElement, thisFolder, null);
      }
    } else {
      updateFolder(thisFolderElement, thisFolder, null);
    }

    const thisFolderItemElements = elementQuerySelectorAll(thisFolderContentElement, '.css_home_folder_item');
    for (let j = 0; j < thisFolderContentLength; j++) {
      const thisElement = thisFolderItemElements[j];
      const thisItem = thisFolderContent[j];
      if (previousIntegration.hasOwnProperty('folders')) {
        if (previousIntegration.folders[i]) {
          if (previousIntegration.folders[i].content[j]) {
            const previousItem = previousIntegration.folders[i].content[j];
            updateItem(thisElement, thisItem, previousItem);
          } else {
            updateItem(thisElement, thisItem, null);
          }
        } else {
          updateItem(thisElement, thisItem, null);
        }
      } else {
        updateItem(thisElement, thisItem, null);
      }
    }
  }

  previousIntegration = integration;
  previousAnimation = animation;
  previousSkeletonScreen = skeletonScreen;
}

async function refreshFolders() {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const refresh_interval_setting = getSettingOptionValue('refresh_interval') as SettingSelectOptionRefreshIntervalValue;
  foldersRefreshTimer_dynamic = refresh_interval_setting.dynamic;
  foldersRefreshTimer_baseInterval = refresh_interval_setting.baseInterval;
  foldersRefreshTimer_refreshing = true;
  foldersRefreshTimer_currentRequestID = generateIdentifier();
  HomeUpdateTimerElement.setAttribute('refreshing', 'true');
  HomeUpdateTimerElement.classList.remove('css_home_update_timer_slide_rtl');
  document.addEventListener(foldersRefreshTimer_currentRequestID, handleDataReceivingProgressUpdates);
  const integration = await integrateFolders(foldersRefreshTimer_currentRequestID);
  updateFoldersElement(integration, false, playing_animation);
  let updateRate = 0;
  if (foldersRefreshTimer_dynamic) {
    updateRate = await getUpdateRate();
  }
  foldersRefreshTimer_lastUpdate = new Date().getTime();
  if (foldersRefreshTimer_dynamic) {
    foldersRefreshTimer_nextUpdate = Math.max(foldersRefreshTimer_lastUpdate + foldersRefreshTimer_minInterval, integration.dataUpdateTime + foldersRefreshTimer_baseInterval / updateRate);
  } else {
    foldersRefreshTimer_nextUpdate = foldersRefreshTimer_lastUpdate + foldersRefreshTimer_baseInterval;
  }
  foldersRefreshTimer_dynamicInterval = Math.max(foldersRefreshTimer_minInterval, foldersRefreshTimer_nextUpdate - foldersRefreshTimer_lastUpdate);
  foldersRefreshTimer_refreshing = false;
  HomeUpdateTimerElement.setAttribute('refreshing', 'false');
  animateUpdateTimer();
}

async function streamFolders() {
  refreshFolders()
    .then(function () {
      if (foldersRefreshTimer_streaming) {
        setTimeout(function () {
          streamFolders();
        }, Math.max(foldersRefreshTimer_minInterval, foldersRefreshTimer_nextUpdate - new Date().getTime()));
      } else {
        foldersRefreshTimer_streamStarted = false;
      }
    })
    .catch((err) => {
      console.error(err);
      if (foldersRefreshTimer_streaming) {
        promptMessage(`資料夾網路連線中斷，將在${foldersRefreshTimer_retryInterval / 1000}秒後重試。`, 'error');
        setTimeout(function () {
          streamFolders();
        }, foldersRefreshTimer_retryInterval);
      } else {
        foldersRefreshTimer_streamStarted = false;
      }
    });
}

export function initializeFolders(): void {
  setUpFolderFieldSkeletonScreen();
  if (!foldersRefreshTimer_streaming) {
    foldersRefreshTimer_streaming = true;
    if (!foldersRefreshTimer_streamStarted) {
      foldersRefreshTimer_streamStarted = true;
      streamFolders();
    } else {
      refreshFolders();
    }
  }
}
