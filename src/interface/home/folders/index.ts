import { integrateFolders } from '../../../data/folder/index.ts';
import { FieldSize, GeneratedElement } from '../../index.ts';
import { getIconHTML } from '../../icons/index.ts';
import { getSettingOptionValue } from '../../../data/settings/index.ts';
import { getUpdateRate } from '../../../data/analytics/update-rate.ts';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../../tools/query-selector.ts';
import { compareThings, generateIdentifier } from '../../../tools/index.ts';

var previousIntegration = [];

var foldersRefreshTimer = {
  baseInterval: 15 * 1000,
  minInterval: 5 * 1000,
  dynamicInterval: 15 * 1000,
  auto: true,
  streaming: false,
  lastUpdate: 0,
  nextUpdate: 0,
  refreshing: false,
  currentRequestID: '',
  streamStarted: false
};

function queryFolderFieldSize(): FieldSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

function generateElementOfItem(): GeneratedElement {
  const element = document.createElement('div');
  element.classList.add('css_home_folder_item');
  element.setAttribute('type', 'null');
  element.innerHTML = `<div class="css_home_folder_item_icon"></div><div class="css_home_folder_item_context"></div><div class="css_home_folder_item_main"></div><div class="css_home_folder_item_capsule"><div class="css_home_folder_item_status"><div class="css_next_slide" code="0"></div><div class="css_current_slide" code="0"></div></div><div class="css_home_folder_item_capsule_separator"></div></div>`;
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
          id: null
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
          icon = 'help';
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
    if (previousItem === null) {
      updateType(thisElement, thisItem);
      updateIcon(thisElement, thisItem);
      updateStatus(thisElement, thisItem);
      updateMain(thisElement, thisItem);
      updateContext(thisElement, thisItem);
    } else {
      if (!(thisItem.type === previousItem.type)) {
        updateType(thisElement, thisItem);
        updateIcon(thisElement, thisItem);
      }
      if (!(thisItem.status.code === previousItem.status.code) || !compareThings(previousItem.status.text, thisItem.status.text)) {
        updateStatus(thisElement, thisItem);
      }
      if (!compareThings(previousItem.name, thisItem.name)) {
        updateMain(thisElement, thisItem);
      }
      if (!compareThings(previousItem.id, thisItem.id)) {
        updateContext(thisElement, thisItem);
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

async function refreshFolders(): object {
  var refresh_interval_setting = getSettingOptionValue('refresh_interval');
  foldersRefreshTimer.auto = refresh_interval_setting.auto;
  foldersRefreshTimer.baseInterval = refresh_interval_setting.baseInterval;
  foldersRefreshTimer.refreshing = true;
  foldersRefreshTimer.currentRequestID = `r_${generateIdentifier()}`;
  var integration = await integrateFolders(foldersRefreshTimer.currentRequestID);
  var Field = documentQuerySelector('.css_home_field .css_home_body .css_home_folders');
  updateFolderField(Field, integration, false);
  foldersRefreshTimer.lastUpdate = new Date().getTime();
  var updateRate = await getUpdateRate();
  if (foldersRefreshTimer.auto) {
    foldersRefreshTimer.nextUpdate = Math.max(new Date().getTime() + foldersRefreshTimer.minInterval, integration.dataUpdateTime + foldersRefreshTimer.baseInterval / updateRate);
  } else {
    foldersRefreshTimer.nextUpdate = new Date().getTime() + foldersRefreshTimer.baseInterval;
  }
  foldersRefreshTimer.dynamicInterval = Math.max(foldersRefreshTimer.minInterval, foldersRefreshTimer.nextUpdate - new Date().getTime());
  foldersRefreshTimer.refreshing = false;
  return { status: 'Successfully refreshed the folders.' };
}

async function streamFolders(): void {
  refreshFolders()
    .then((result) => {
      if (foldersRefreshTimer.streaming) {
        foldersRefreshTimer.timer = setTimeout(function () {
          streamFolders();
        }, Math.max(foldersRefreshTimer.minInterval, foldersRefreshTimer.nextUpdate - new Date().getTime()));
      } else {
        foldersRefreshTimer.streamStarted = false;
      }
    })
    .catch((err) => {
      console.error(err);
      if (foldersRefreshTimer.streaming) {
        foldersRefreshTimer.timer = setTimeout(function () {
          streamFolders();
        }, foldersRefreshTimer.minInterval);
      } else {
        foldersRefreshTimer.streamStarted = false;
      }
    });
}

export function initializeFolders(): void {
  var Field = documentQuerySelector('.css_home_field .css_home_body .css_home_folders');
  setUpFolderFieldSkeletonScreen(Field);
  if (!foldersRefreshTimer.streaming) {
    foldersRefreshTimer.streaming = true;
    if (!foldersRefreshTimer.streamStarted) {
      foldersRefreshTimer.streamStarted = true;
      streamFolders();
    } else {
      refreshFolders();
    }
    //updateUpdateTimer();
  }
}