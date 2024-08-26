import { integrateFolders } from '../../../data/folder/index';
import { FieldSize, GeneratedElement } from '../../index';
import { getIconHTML } from '../../icons/index';
import { getSettingOptionValue } from '../../../data/settings/index';
import { getUpdateRate } from '../../../data/analytics/update-rate';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../../tools/query-selector';
import { compareThings, generateIdentifier } from '../../../tools/index';
import { getDataReceivingProgress } from '../../../data/apis/loader';

var previousIntegration = [];

var foldersRefreshTimer_baseInterval: number = 15 * 1000;
var foldersRefreshTimer_minInterval: number = 5 * 1000;
var foldersRefreshTimer_dynamicInterval: number = 15 * 1000;
var foldersRefreshTimer_auto: number = true;
var foldersRefreshTimer_streaming: boolean = false;
var foldersRefreshTimer_lastUpdate: number = 0;
var foldersRefreshTimer_nextUpdate: number = 0;
var foldersRefreshTimer_refreshing: boolean = false;
var foldersRefreshTimer_currentRequestID: string = '';
var foldersRefreshTimer_streamStarted: boolean = false;
var foldersRefreshTimer_timer: ReturnType<typeof setTimeout>;

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
  element.innerHTML = `<div class="css_home_folder_item_icon"></div><div class="css_home_folder_item_context"></div><div class="css_home_folder_item_main"></div><div class="css_home_folder_item_capsule"><div class="css_home_folder_item_status"><div class="css_next_slide" code="0"></div><div class="css_current_slide" code="0"></div></div><div class="css_home_folder_item_capsule_separator"></div><div class="css_home_folder_item_button">${getIconHTML('keyboard_arrow_right')}</div></div>`;
  return {
    element: element,
    id: null
  };
}

function generateElementOfFolder(): GeneratedElement {
  const element = document.createElement('div');
  element.classList.add('css_home_folder');
  element.innerHTML = `<div class="css_home_folder_head"><div class="css_home_folder_icon"></div><div class="css_home_folder_name"></div></div><div class="css_home_folder_content"></div>`;
  return {
    element: element,
    id: null
  };
}

function updateUpdateTimer() {
  var time = new Date().getTime();
  var percentage = 0;
  if (foldersRefreshTimer_refreshing) {
    percentage = -1 + getDataReceivingProgress(foldersRefreshTimer_currentRequestID);
  } else {
    percentage = -1 * Math.min(1, Math.max(0, Math.abs(time - foldersRefreshTimer_lastUpdate) / foldersRefreshTimer_dynamicInterval));
  }
  documentQuerySelector('.css_home_update_timer').style.setProperty('--b-cssvar-update-timer', percentage);
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
  var foldedItems = {};
  var folders = {};
  for (var i = 0; i < defaultFolderQuantity; i++) {
    var folderKey = `f_${i}`;
    foldedItems[folderKey] = [];
    folders[folderKey] = {
      name: '',
      index: i,
      icon: ''
    };
    for (var j = 0; j < defaultItemQuantity[folderKey]; j++) {
      foldedItems[folderKey].push({
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
      foldedItems: foldedItems,
      folders: folders,
      folderQuantity: defaultFolderQuantity,
      itemQuantity: defaultItemQuantity,
      dataUpdateTime: null
    },
    true
  );
}

async function updateFolderField(Field: HTMLElement, integration: {}, skeletonScreen: boolean): void {
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
        var nextSlide = elementQuerySelector(thisElement, '.css_home_folder_item_capsule .css_home_folder_item_status .css_next_slide');
        var currentSlide = elementQuerySelector(thisElement, '.css_home_folder_item_capsule .css_home_folder_item_status .css_current_slide');
        nextSlide.setAttribute('code', thisItem.status.code);
        nextSlide.innerText = thisItem.status.text;
        currentSlide.addEventListener(
          'animationend',
          function () {
            currentSlide.setAttribute('code', thisItem.status.code);
            currentSlide.innerText = thisItem.status.text;
            currentSlide.classList.remove('css_slide_fade_out');
          },
          { once: true }
        );
        currentSlide.classList.add('css_slide_fade_out');
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
          context = `${thisItem.endPoints.departure} \u21CC ${thisItem.endPoints.destination}`;
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
    if (previousItem === null) {
      updateType(thisElement, thisItem);
      updateIcon(thisElement, thisItem);
      updateStatus(thisElement, thisItem);
      updateMain(thisElement, thisItem);
      updateContext(thisElement, thisItem);
      updateButton(thisElement, thisItem);
    } else {
      if (!(thisItem.type === previousItem.type)) {
        updateType(thisElement, thisItem);
        updateIcon(thisElement, thisItem);
        updateStatus(thisElement, thisItem);
        updateMain(thisElement, thisItem);
        updateContext(thisElement, thisItem);
        updateButton(thisElement, thisItem);
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
      }
    }
  }

  const FieldSize = queryFolderFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;

  if (previousIntegration === {}) {
    previousIntegration = integration;
  }

  var folderQuantity = integration.folderQuantity;
  var itemQuantity = integration.itemQuantity;
  var foldedItems = integration.foldedItems;
  var folders = integration.folders;

  Field.setAttribute('skeleton-screen', skeletonScreen);

  var currentFolderSeatQuantity = elementQuerySelectorAll(Field, `.css_home_folder`).length;
  if (!(folderQuantity === currentFolderSeatQuantity)) {
    var capacity = currentFolderSeatQuantity - folderQuantity;
    if (capacity < 0) {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var thisFolderElement = generateElementOfFolder();
        Field.appendChild(thisFolderElement.element);
      }
    } else {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var folderIndex = currentFolderSeatQuantity - 1 - o;
        elementQuerySelectorAll(Field, `.css_home_folder`)[folderIndex].remove();
      }
    }
  }

  for (var i = 0; i < folderQuantity; i++) {
    var folderKey = `f_${i}`;
    var currentItemSeatQuantity = elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_home_folder`)[i], `.css_home_folder_content .css_home_folder_item`).length;
    if (!(itemQuantity[folderKey] === currentItemSeatQuantity)) {
      var capacity = currentItemSeatQuantity - itemQuantity[folderKey];
      if (capacity < 0) {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var thisItemElement = generateElementOfItem();
          elementQuerySelector(elementQuerySelectorAll(Field, `.css_home_folder`)[i], `.css_home_folder_content`).appendChild(thisItemElement.element);
        }
      } else {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var itemIndex = currentItemSeatQuantity - 1 - o;
          elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_home_folder`)[i], `.css_home_folder_content .css_home_folder_item`)[itemIndex].remove();
        }
      }
    }
  }

  for (var i = 0; i < folderQuantity; i++) {
    var folderKey = `f_${i}`;
    var thisFolderElement = elementQuerySelectorAll(Field, `.css_home_folder`)[i];
    thisFolderElement.setAttribute('skeleton-screen', skeletonScreen);
    var thisHeadElement = elementQuerySelector(thisFolderElement, `.css_home_folder_head`);
    elementQuerySelector(thisHeadElement, '.css_home_folder_name').innerText = folders[folderKey].name;
    elementQuerySelector(thisHeadElement, '.css_home_folder_icon').innerHTML = getIconHTML(folders[folderKey].icon);
    for (var j = 0; j < itemQuantity[folderKey]; j++) {
      var thisElement = elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_home_folder`)[i], `.css_home_folder_content .css_home_folder_item`)[j];
      thisElement.setAttribute('skeleton-screen', skeletonScreen);
      var thisItem = foldedItems[folderKey][j];
      if (previousIntegration.hasOwnProperty('foldedItems')) {
        if (previousIntegration.foldedItems.hasOwnProperty(folderKey)) {
          if (previousIntegration.foldedItems[folderKey][j]) {
            var previousItem = previousIntegration.foldedItems[folderKey][j];
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
}

async function refreshFolders(): Promise<object> {
  var refresh_interval_setting = getSettingOptionValue('refresh_interval');
  foldersRefreshTimer_auto = refresh_interval_setting.auto;
  foldersRefreshTimer_baseInterval = refresh_interval_setting.baseInterval;
  foldersRefreshTimer_refreshing = true;
  foldersRefreshTimer_currentRequestID = `r_${generateIdentifier()}`;
  documentQuerySelector('.css_home_update_timer').setAttribute('refreshing', 'true');
  var integration = await integrateFolders(foldersRefreshTimer_currentRequestID);
  var Field = documentQuerySelector('.css_home_field .css_home_body .css_home_folders');
  updateFolderField(Field, integration, false);
  foldersRefreshTimer_lastUpdate = new Date().getTime();
  var updateRate = await getUpdateRate();
  if (foldersRefreshTimer_auto) {
    foldersRefreshTimer_nextUpdate = Math.max(new Date().getTime() + foldersRefreshTimer_minInterval, integration.dataUpdateTime + foldersRefreshTimer_baseInterval / updateRate);
  } else {
    foldersRefreshTimer_nextUpdate = new Date().getTime() + foldersRefreshTimer_baseInterval;
  }
  foldersRefreshTimer_dynamicInterval = Math.max(foldersRefreshTimer_minInterval, foldersRefreshTimer_nextUpdate - new Date().getTime());
  foldersRefreshTimer_refreshing = false;
  documentQuerySelector('.css_home_update_timer').setAttribute('refreshing', 'false');
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
        foldersRefreshTimer_timer = setTimeout(function () {
          streamFolders();
        }, foldersRefreshTimer_minInterval);
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
