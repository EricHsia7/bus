import { integratedFolders, integrateFolders } from '../../../data/folder/index';
import { FieldSize, GeneratedElement } from '../../index';
import { getIconHTML } from '../../icons/index';
import { getSettingOptionValue, SettingSelectOptionRefreshIntervalValue } from '../../../data/settings/index';
import { getUpdateRate } from '../../../data/analytics/update-rate';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../../tools/query-selector';
import { booleanToString, compareThings, generateIdentifier } from '../../../tools/index';
import { getDataReceivingProgress } from '../../../data/apis/loader';
import { promptMessage } from '../../prompt/index';

const HomeField = documentQuerySelector('.css_home_field');
const HomeHeadElement = elementQuerySelector(HomeField, '.css_home_head');
const HomeBodyElement = elementQuerySelector(HomeField, '.css_home_body');
const FoldersField = elementQuerySelector(HomeBodyElement, '.css_home_folders');
const HomeUpdateTimerElement = elementQuerySelector(HomeHeadElement, '.css_home_update_timer_box .css_home_update_timer');

let previousIntegration = {} as integratedFolders;
let previousSkeleton: boolean = false;

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
let foldersRefreshTimer_streamStarted: boolean = false;
let foldersRefreshTimer_timer: ReturnType<typeof setTimeout>;

function queryFolderFieldSize(): FieldSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

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
  const time = new Date().getTime();
  let percentage = 0;
  if (foldersRefreshTimer_refreshing) {
    percentage = -1 + getDataReceivingProgress(foldersRefreshTimer_currentRequestID);
  } else {
    percentage = -1 * Math.min(1, Math.max(0, Math.abs(time - foldersRefreshTimer_lastUpdate) / foldersRefreshTimer_dynamicInterval));
  }
  HomeUpdateTimerElement.style.setProperty('--b-cssvar-update-timer', percentage.toString());
  window.requestAnimationFrame(function () {
    if (foldersRefreshTimer_streaming) {
      updateUpdateTimer();
    }
  });
}

export function setUpFolderFieldSkeletonScreen(Field: HTMLElement): void {
  const FieldSize = queryFolderFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;
  var defaultItemQuantity = { f_0: Math.floor(FieldHeight / 50 / 3) + 2, f_1: Math.floor(FieldHeight / 50 / 3) + 2, f_2: Math.floor(FieldHeight / 50 / 3) + 2 };
  var defaultFolderQuantity = 3;
  var foldedContent = {};
  var folders = {};
  for (let i = 0; i < defaultFolderQuantity; i++) {
    var folderKey = `f_${i}`;
    foldedContent[folderKey] = [];
    folders[folderKey] = {
      name: '',
      index: i,
      icon: ''
    };
    for (let j = 0; j < defaultItemQuantity[folderKey]; j++) {
      foldedContent[folderKey].push({
        type: 'stop',
        id: null,
        status: {
          code: 0,
          text: null
        },
        name: null,
        route: {
          name: null,
          endPoints: {
            departure: null,
            destination: null
          },
          id: null,
          pathAttributeId: []
        }
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
      dataUpdateTime: null
    },
    true
  );
}

async function updateFolderField(Field: HTMLElement, integration: object, skeletonScreen: boolean): void {
  function updateItem(thisElement, thisItem, previousItem) {
    function updateType(thisElement: HTMLElement, thisItem: object): void {
      thisElement.setAttribute('type', thisItem.type);
    }
    function updateIcon(thisElement: HTMLElement, thisItem: object): void {
      const iconElement = elementQuerySelector(thisElement, '.css_home_folder_item_icon');
      let icon = '';
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
    function updateStatus(thisElement: HTMLElement, thisItem: object): void {
      if (thisItem.type === 'stop') {
        const thisItemStatusElement = elementQuerySelector(thisElement, '.css_home_folder_item_capsule .css_home_folder_item_status');
        const nextSlideElement = elementQuerySelector(thisItemStatusElement, '.css_next_slide');
        const currentSlideElement = elementQuerySelector(thisItemStatusElement, '.css_current_slide');
        nextSlideElement.setAttribute('code', thisItem.status.code);
        nextSlideElement.innerText = thisItem.status.text;
        currentSlideElement.addEventListener(
          'animationend',
          function () {
            currentSlideElement.setAttribute('code', thisItem.status.code);
            currentSlideElement.innerText = thisItem.status.text;
            currentSlideElement.classList.remove('css_slide_fade_out');
          },
          { once: true }
        );
        currentSlideElement.classList.add('css_slide_fade_out');
      }
    }
    function updateMain(thisElement: HTMLElement, thisItem: object): void {
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
    function updateContext(thisElement: HTMLElement, thisItem: object): void {
      let context: string = '';
      switch (thisItem.type) {
        case 'stop':
          context = `${thisItem.route ? thisItem.route.name : ''} - 往${thisItem.route ? [thisItem.route.endPoints.destination, thisItem.route.endPoints.departure, ''][thisItem.direction ? thisItem.direction : 0] : ''}`;
          break;
        case 'route':
          context = `${thisItem.endPoints.departure} \u2194 ${thisItem.endPoints.destination}`;
          break;
        case 'bus':
          context = thisItem.currentRoute.name; // TODO: integration
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
    function updateButton(thisElement: HTMLElement, thisItem: object): void {
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
    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      thisElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }
    if (previousItem === null) {
      updateType(thisElement, thisItem);
      updateIcon(thisElement, thisItem);
      updateStatus(thisElement, thisItem);
      updateMain(thisElement, thisItem);
      updateContext(thisElement, thisItem);
      updateButton(thisElement, thisItem);
      updateSkeletonScreen(thisElement, skeletonScreen);
    } else {
      if (!(thisItem.type === previousItem.type)) {
        updateType(thisElement, thisItem);
        updateIcon(thisElement, thisItem);
        updateStatus(thisElement, thisItem);
        updateMain(thisElement, thisItem);
        updateContext(thisElement, thisItem);
        updateButton(thisElement, thisItem);
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
              updateStatus(thisElement, thisItem);
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
        if (!(skeletonScreen === previousSkeleton)) {
          updateSkeletonScreen(thisElement, skeletonScreen);
        }
      }
    }
  }

  const FieldSize = queryFolderFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;

  const folderQuantity = integration.folderQuantity;
  const itemQuantity = integration.itemQuantity;
  const foldedContent = integration.foldedContent;
  const folders = integration.folders;

  Field.setAttribute('skeleton-screen', skeletonScreen);

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
    thisFolderElement.setAttribute('skeleton-screen', skeletonScreen);
    const thisHeadElement = elementQuerySelector(thisFolderElement, `.css_home_folder_head`);
    elementQuerySelector(thisHeadElement, '.css_home_folder_name').innerText = folders[folderKey].name;
    elementQuerySelector(thisHeadElement, '.css_home_folder_icon').innerHTML = getIconHTML(folders[folderKey].icon);
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
  previousSkeleton = skeletonScreen;
}

async function refreshFolders(): Promise<object> {
  const time = new Date().getTime();
  const refresh_interval_setting = getSettingOptionValue('refresh_interval') as SettingSelectOptionRefreshIntervalValue;
  foldersRefreshTimer_dynamic = refresh_interval_setting.dynamic;
  foldersRefreshTimer_baseInterval = refresh_interval_setting.baseInterval;
  foldersRefreshTimer_refreshing = true;
  foldersRefreshTimer_currentRequestID = generateIdentifier('r');
  HomeUpdateTimerElement.setAttribute('refreshing', 'true');
  const integration = await integrateFolders(foldersRefreshTimer_currentRequestID);
  updateFolderField(FoldersField, integration, false);
  foldersRefreshTimer_lastUpdate = time;
  const updateRate = await getUpdateRate();
  if (foldersRefreshTimer_dynamic) {
    foldersRefreshTimer_nextUpdate = Math.max(time + foldersRefreshTimer_minInterval, integration.dataUpdateTime + foldersRefreshTimer_baseInterval / updateRate);
  } else {
    foldersRefreshTimer_nextUpdate = time + foldersRefreshTimer_baseInterval;
  }
  foldersRefreshTimer_dynamicInterval = Math.max(foldersRefreshTimer_minInterval, foldersRefreshTimer_nextUpdate - time);
  foldersRefreshTimer_refreshing = false;
  HomeUpdateTimerElement.setAttribute('refreshing', 'false');
  return { status: 'Successfully refreshed the folders.' };
}

async function streamFolders(): void {
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
  var Field = documentQuerySelector('.css_home_field .css_home_body .css_home_folders');
  setUpFolderFieldSkeletonScreen(Field);
  if (!foldersRefreshTimer_streaming) {
    foldersRefreshTimer_streaming = true;
    if (!foldersRefreshTimer_streamStarted) {
      foldersRefreshTimer_streamStarted = true;
      streamFolders();
    } else {
      refreshFolders();
    }
    updateUpdateTimer();
  }
}
