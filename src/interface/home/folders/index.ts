import { Folder, integratedFolderContent, integratedFolders, integrateFolders } from '../../../data/folder/index';
import { GeneratedElement, querySize } from '../../index';
import { getIconHTML } from '../../icons/index';
import { getSettingOptionValue, SettingSelectOptionRefreshIntervalValue } from '../../../data/settings/index';
import { getUpdateRate } from '../../../data/analytics/update-rate/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../../tools/query-selector';
import { booleanToString, compareThings, generateIdentifier } from '../../../tools/index';
import { getDataReceivingProgress } from '../../../data/apis/loader';
import { promptMessage } from '../../prompt/index';
import { MaterialSymbols } from '../../icons/material-symbols-type';

const HomeField = documentQuerySelector('.css_home_field');
const HomeHeadElement = elementQuerySelector(HomeField, '.css_home_head');
const HomeBodyElement = elementQuerySelector(HomeField, '.css_home_body');
const HomeFoldersField = elementQuerySelector(HomeBodyElement, '.css_home_folders');
const HomeUpdateTimerElement = elementQuerySelector(HomeHeadElement, '.css_home_update_timer_box .css_home_update_timer');

let previousIntegration = {} as integratedFolders;
let previousSkeletonScreen: boolean = false;
let previousAnimation: boolean = true;

let foldersRefreshTimer_retryInterval: number = 10 * 1000;
let foldersRefreshTimer_baseInterval: number = 15 * 1000;
let foldersRefreshTimer_minInterval: number = 5 * 1000;
let foldersRefreshTimer_dynamicInterval: number = 15 * 1000;
let foldersRefreshTimer_dynamic: boolean = true;
let foldersRefreshTimer_streaming: boolean = false;
let foldersRefreshTimer_lastUpdate: number = 0;
let foldersRefreshTimer_nextUpdate: number = 0;
let foldersRefreshTimer_refreshing: boolean = false;
let foldersRefreshTimer_currentRequestID: string = '';
let foldersRefreshTimer_currentProgress: number = -1;
let foldersRefreshTimer_targetProgress: number = -1;
let foldersRefreshTimer_streamStarted: boolean = false;
let foldersRefreshTimer_timer: ReturnType<typeof setTimeout>;

function generateElementOfItem(): GeneratedElement {
  const element = document.createElement('div');
  element.classList.add('css_home_folder_item');
  element.setAttribute('type', 'stop');
  element.innerHTML = /*html*/ `<div class="css_home_folder_item_icon"></div><div class="css_home_folder_item_context"></div><div class="css_home_folder_item_main"></div><div class="css_home_folder_item_capsule"><div class="css_home_folder_item_status"><div class="css_next_slide" code="0"></div><div class="css_current_slide" code="0"></div></div><div class="css_home_folder_item_button">${getIconHTML('keyboard_arrow_right')}</div><div class="css_home_folder_item_capsule_separator"></div></div>`;
  return {
    element: element,
    id: null
  };
}

function generateElementOfFolder(): GeneratedElement {
  const element = document.createElement('div');
  element.classList.add('css_home_folder');
  element.innerHTML = /*html*/ `<div class="css_home_folder_head"><div class="css_home_folder_icon"></div><div class="css_home_folder_name"></div></div><div class="css_home_folder_content"></div>`;
  return {
    element: element,
    id: ''
  };
}

function updateUpdateTimer(): void {
  const smoothingFactor = 0.1;
  const time = new Date().getTime();
  if (foldersRefreshTimer_refreshing) {
    foldersRefreshTimer_targetProgress = -1 + getDataReceivingProgress(foldersRefreshTimer_currentRequestID);
    foldersRefreshTimer_currentProgress += (foldersRefreshTimer_targetProgress - foldersRefreshTimer_currentProgress) * smoothingFactor;
  } else {
    foldersRefreshTimer_targetProgress = -1 * Math.min(1, Math.max(0, Math.abs(time - foldersRefreshTimer_lastUpdate) / foldersRefreshTimer_dynamicInterval));
    foldersRefreshTimer_currentProgress = foldersRefreshTimer_targetProgress;
  }
  HomeUpdateTimerElement.style.setProperty('--b-cssvar-update-timer', foldersRefreshTimer_currentProgress.toString());
  window.requestAnimationFrame(function () {
    if (foldersRefreshTimer_streaming) {
      updateUpdateTimer();
    }
  });
}

export function setUpFolderFieldSkeletonScreen(Field: HTMLElement): void {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const WindowSize = querySize('window');
  const FieldWidth = WindowSize.width;
  const FieldHeight = WindowSize.height;
  const defaultItemQuantity = { f_0: Math.floor(FieldHeight / 50 / 3) + 2, f_1: Math.floor(FieldHeight / 50 / 3) + 2, f_2: Math.floor(FieldHeight / 50 / 3) + 2 };
  const defaultFolderQuantity = 3;
  let foldedContent = {} as integratedFolders['foldedContent'];
  let folders = {} as integratedFolders['folders'];
  for (let i = 0; i < defaultFolderQuantity; i++) {
    const folderKey: string = `f_${i}`;
    foldedContent[folderKey] = [];
    folders[folderKey] = {
      name: '',
      index: i,
      icon: '',
      default: false,
      storeIndex: -1,
      contentType: [],
      id: '',
      timestamp: 0
    };
    for (let j = 0; j < defaultItemQuantity[folderKey]; j++) {
      foldedContent[folderKey].push({
        type: 'stop',
        id: 0,
        time: '',
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
        },
        index: j
      });
    }
  }
  updateFolderField(
    Field,
    {
      foldedContent: foldedContent,
      folders: folders,
      folderQuantity: defaultFolderQuantity,
      itemQuantity: defaultItemQuantity,
      dataUpdateTime: 0
    },
    true,
    playing_animation
  );
}

function updateFolderField(Field: HTMLElement, integration: integratedFolders, skeletonScreen: boolean, animation: boolean): void {
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
            },
            { once: true }
          );
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
      let onclick = '';
      switch (thisItem.type) {
        case 'stop':
          onclick = `bus.route.openRoute(${thisItem.route.id}, [${thisItem.route.pathAttributeId.join(',')}])`;
          break;
        case 'route':
          onclick = `bus.route.openRoute(${thisItem.id}, [${thisItem.pathAttributeId.join(',')}])`;
          break;
        case 'bus':
          break;
        case 'empty':
          break;
        default:
          break;
      }
      buttonElement.setAttribute('onclick', onclick);
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
      if (!(thisItem.type === previousItem.type)) {
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
            if (!(thisItem.status.code === previousItem.status.code) || !compareThings(previousItem.status.text, thisItem.status.text)) {
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
          case 'bus':
            if (!compareThings(previousItem.currentRoute, thisItem.currentRoute)) {
              updateContext(thisElement, thisItem);
            }
            if (!compareThings(previousItem.busID, thisItem.busID)) {
              updateMain(thisElement, thisItem);
            }
            break;
          case 'empty':
            if (!(thisItem.type === previousItem.type)) {
              updateContext(thisElement, thisItem);
              updateMain(thisElement, thisItem);
            }
            break;
          default:
            break;
        }
        if (!(skeletonScreen === previousSkeletonScreen)) {
          updateSkeletonScreen(thisElement, skeletonScreen);
        }
        if (!(animation === previousAnimation)) {
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
      if (!(thisFolder.name === previousFolder.name)) {
        updateName(thisElement, thisFolder);
      }
      if (!(thisFolder.icon === previousFolder.icon)) {
        updateIcon(thisElement, thisFolder);
      }
      if (!(animation === previousAnimation)) {
        updateAnimation(thisElement, animation);
      }
      if (!(skeletonScreen === previousSkeletonScreen)) {
        updateSkeletonScreen(thisElement, skeletonScreen);
      }
    }
  }

  const WindowSize = querySize('window');
  const FieldWidth = WindowSize.width;
  const FieldHeight = WindowSize.height;

  const folderQuantity = integration.folderQuantity;
  const itemQuantity = integration.itemQuantity;
  const foldedContent = integration.foldedContent;
  const folders = integration.folders;

  // Field.setAttribute('skeleton-screen', skeletonScreen);

  const currentFolderSeatQuantity = elementQuerySelectorAll(Field, `.css_home_folder`).length;
  if (!(folderQuantity === currentFolderSeatQuantity)) {
    const capacity = currentFolderSeatQuantity - folderQuantity;
    if (capacity < 0) {
      for (let o = 0; o < Math.abs(capacity); o++) {
        const newFolderElement = generateElementOfFolder();
        Field.appendChild(newFolderElement.element);
      }
    } else {
      const FolderElements = elementQuerySelectorAll(Field, `.css_home_folder`);
      for (let o = 0; o < Math.abs(capacity); o++) {
        const folderIndex = currentFolderSeatQuantity - 1 - o;
        FolderElements[folderIndex].remove();
      }
    }
  }

  for (let i = 0; i < folderQuantity; i++) {
    const folderKey = `f_${i}`;
    const currentItemSeatQuantity = elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_home_folder`)[i], `.css_home_folder_content .css_home_folder_item`).length;
    if (!(itemQuantity[folderKey] === currentItemSeatQuantity)) {
      const capacity = currentItemSeatQuantity - itemQuantity[folderKey];
      if (capacity < 0) {
        const FolderContentElement = elementQuerySelector(elementQuerySelectorAll(Field, `.css_home_folder`)[i], `.css_home_folder_content`);
        for (let o = 0; o < Math.abs(capacity); o++) {
          const newItemElement = generateElementOfItem();
          FolderContentElement.appendChild(newItemElement.element);
        }
      } else {
        const FolderContentItemElements = elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_home_folder`)[i], `.css_home_folder_content .css_home_folder_item`);
        for (let o = 0; o < Math.abs(capacity); o++) {
          const itemIndex = currentItemSeatQuantity - 1 - o;
          FolderContentItemElements[itemIndex].remove();
        }
      }
    }
  }

  for (let i = 0; i < folderQuantity; i++) {
    const folderKey = `f_${i}`;
    const thisFolderElement = elementQuerySelectorAll(Field, `.css_home_folder`)[i];
    const thisFolder = folders[folderKey];
    if (previousIntegration.hasOwnProperty('folders')) {
      if (previousIntegration.folders.hasOwnProperty(folderKey)) {
        if (previousIntegration.folders[folderKey]) {
          const previousFolder = previousIntegration.folders[folderKey];
          updateFolder(thisFolderElement, thisFolder, previousFolder);
        } else {
          updateFolder(thisFolderElement, thisFolder, null);
        }
      } else {
        updateFolder(thisFolderElement, thisFolder, null);
      }
    } else {
      updateFolder(thisFolderElement, thisFolder, null);
    }

    for (let j = 0; j < itemQuantity[folderKey]; j++) {
      const thisElement = elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_home_folder`)[i], `.css_home_folder_content .css_home_folder_item`)[j];
      const thisItem = foldedContent[folderKey][j];
      if (previousIntegration.hasOwnProperty('foldedContent')) {
        if (previousIntegration.foldedContent.hasOwnProperty(folderKey)) {
          if (previousIntegration.foldedContent[folderKey][j]) {
            const previousItem = previousIntegration.foldedContent[folderKey][j];
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

async function refreshFolders(): Promise<object> {
  const time = new Date().getTime();
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const refresh_interval_setting = getSettingOptionValue('refresh_interval') as SettingSelectOptionRefreshIntervalValue;
  foldersRefreshTimer_dynamic = refresh_interval_setting.dynamic;
  foldersRefreshTimer_baseInterval = refresh_interval_setting.baseInterval;
  foldersRefreshTimer_refreshing = true;
  foldersRefreshTimer_currentRequestID = generateIdentifier('r');
  HomeUpdateTimerElement.setAttribute('refreshing', 'true');
  const integration = await integrateFolders(foldersRefreshTimer_currentRequestID);
  updateFolderField(HomeFoldersField, integration, false, playing_animation);
  foldersRefreshTimer_lastUpdate = time;
  if (foldersRefreshTimer_dynamic) {
    const updateRate = await getUpdateRate();
    foldersRefreshTimer_nextUpdate = Math.max(time + foldersRefreshTimer_minInterval, integration.dataUpdateTime + foldersRefreshTimer_baseInterval / updateRate);
  } else {
    foldersRefreshTimer_nextUpdate = time + foldersRefreshTimer_baseInterval;
  }
  foldersRefreshTimer_dynamicInterval = Math.max(foldersRefreshTimer_minInterval, foldersRefreshTimer_nextUpdate - time);
  foldersRefreshTimer_refreshing = false;
  HomeUpdateTimerElement.setAttribute('refreshing', 'false');
  return { status: 'Successfully refreshed the folders.' };
}

async function streamFolders() {
  refreshFolders()
    .then((result) => {
      if (foldersRefreshTimer_streaming) {
        foldersRefreshTimer_timer = setTimeout(function () {
          streamFolders();
        }, Math.max(foldersRefreshTimer_minInterval, foldersRefreshTimer_nextUpdate - new Date().getTime()));
      } else {
        foldersRefreshTimer_streamStarted = false;
      }
    })
    .catch((err) => {
      console.error(err);
      if (foldersRefreshTimer_streaming) {
        promptMessage(`（資料夾）發生網路錯誤，將在${foldersRefreshTimer_retryInterval / 1000}秒後重試。`, 'error');
        foldersRefreshTimer_timer = setTimeout(function () {
          streamFolders();
        }, foldersRefreshTimer_retryInterval);
      } else {
        foldersRefreshTimer_streamStarted = false;
      }
    });
}

export function initializeFolders(): void {
  setUpFolderFieldSkeletonScreen(HomeFoldersField);
  if (!foldersRefreshTimer_streaming) {
    foldersRefreshTimer_streaming = true;
    if (!foldersRefreshTimer_streamStarted) {
      foldersRefreshTimer_streamStarted = true;
      streamFolders();
    } else {
      refreshFolders();
    }
    foldersRefreshTimer_currentProgress = -1;
    foldersRefreshTimer_targetProgress = -1;
    updateUpdateTimer();
  }
}
