import { listFolders, listFolderContent, integrateFolders } from '../../data/folder/index.ts';
import { compareThings, md5 } from '../../tools/index.ts';
import { formatEstimateTime } from '../../tools/format-time.ts';
import { documentQuerySelector, documentQuerySelectorAll, elementQuerySelector, elementQuerySelectorAll } from '../../tools/query-selector.ts';
import { getUpdateRate } from '../../data/analytics/update-rate.ts';
import { getSettingOptionValue } from '../../data/settings/index.ts';
import { icons } from '../icons/index.ts';
import { GeneratedElement, FieldSize } from '../index.ts';

var previousIntegration = [];

var foldersRefreshTimer = {
  defaultInterval: 15 * 1000,
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
  var identifier = `s_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.id = identifier;
  element.setAttribute('stretched', false);
  element.classlist.add('css_home_folder_item_stop');
  element.innerHTML = `<div class="css_home_folder_item_stop_status"><div class="css_next_slide" code="0"></div><div class="css_current_slide" code="0"></div></div><div class="css_home_folder_item_stop_route"></div><div class="css_home_folder_item_stop_name"></div>`;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfFolder(): GeneratedElement {
  var identifier = `f_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.id = identifier;
  element.classlist.add('css_home_folder');
  element.innerHTML = `<div class="css_home_folder_head"><div class="css_home_folder_icon"></div><div class="css_home_folder_name"></div></div><div class="css_home_folder_content"></div>`;
  return {
    element: element,
    id: identifier
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

export async function updateFolderField(Field: HTMLElement, integration: {}, skeletonScreen: boolean): void {
  function updateItem(thisElement, thisItem, previousItem) {
    function updateStatus(thisElement: HTMLElement, thisItem: object): void {
      var statusSelector = '.css_home_folder_item_stop_status';
      var nextSlide = elementQuerySelector(thisElement, `${statusSelector} .css_next_slide`);
      var currentSlide = elementQuerySelector(thisElement, `${statusSelector} .css_current_slide`);
      nextSlide.setAttribute('code', thisItem.status.code);
      nextSlide.innerText = thisItem.status.text;
      currentSlide.addEventListener(
        'animationend',
        function () {
          currentSlide.setAttribute('code', thisItem.status.code);
          currentSlide.innerText = thisItem.status.text;
          currentSlide.classlist.remove('css_slide_fade_out');
        },
        { once: true }
      );
      currentSlide.classlist.add('css_slide_fade_out');
    }
    function updateName(thisElement: HTMLElement, thisItem: object): void {
      elementQuerySelector(thisElement, '.css_home_folder_item_stop_name').innerText = thisItem.name;
    }
    function updateRoute(thisElement: HTMLElement, thisItem: object): void {
      elementQuerySelector(thisElement, '.css_home_folder_item_stop_route').innerText = `${thisItem.route ? thisItem.route.name : ''} - 往${thisItem.route ? [thisItem.route.endPoints.destination, thisItem.route.endPoints.departure, ''][thisItem.direction ? thisItem.direction : 0] : ''}`;
    }
    if (previousItem === null) {
      updateStatus(thisElement, thisItem);
      updateName(thisElement, thisItem);
      updateRoute(thisElement, thisItem);
    } else {
      if (!(thisItem.status.code === previousItem.status.code) || !compareThings(previousItem.status.text, thisItem.status.text)) {
        updateStatus(thisElement, thisItem);
      }
      if (!compareThings(previousItem.name, thisItem.name)) {
        updateName(thisElement, thisItem);
      }
      if (!compareThings(previousItem.id, thisItem.id)) {
        updateRoute(thisElement, thisItem);
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
    var currentItemSeatQuantity = elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_home_folder`)[i], `.css_home_folder_content .css_home_folder_item_stop`).length;
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
          elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_home_folder`)[i], `.css_home_folder_content .css_home_folder_item_stop`)[itemIndex].remove();
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
    elementQuerySelector(thisHeadElement, '.css_home_folder_icon').innerHTML = folders[folderKey].icon.source === 'icons' ? icons[folders[folderKey].icon.id] : '';
    for (var j = 0; j < itemQuantity[folderKey]; j++) {
      var thisElement = elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_home_folder`)[i], `.css_home_folder_content .css_home_folder_item_stop`)[j];
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

export async function refreshFolders(): object {
  var refresh_interval_setting = getSettingOptionValue('refresh_interval');
  foldersRefreshTimer.auto = refresh_interval_setting.auto;
  foldersRefreshTimer.defaultInterval = refresh_interval_setting.defaultInterval;
  foldersRefreshTimer.refreshing = true;
  foldersRefreshTimer.currentRequestID = `r_${md5(Math.random() * new Date().getTime())}`;
  var integration = await integrateFolders(foldersRefreshTimer.currentRequestID);
  var Field = documentQuerySelector('.css_home_field .css_home_body .css_home_folders');
  updateFolderField(Field, integration, false);
  foldersRefreshTimer.lastUpdate = new Date().getTime();
  var updateRate = await getUpdateRate();
  if (foldersRefreshTimer.auto) {
    foldersRefreshTimer.nextUpdate = Math.max(new Date().getTime() + foldersRefreshTimer.minInterval, integration.dataUpdateTime + foldersRefreshTimer.defaultInterval / updateRate);
  } else {
    foldersRefreshTimer.nextUpdate = new Date().getTime() + foldersRefreshTimer.defaultInterval;
  }
  foldersRefreshTimer.dynamicInterval = Math.max(foldersRefreshTimer.minInterval, foldersRefreshTimer.nextUpdate - new Date().getTime());
  foldersRefreshTimer.refreshing = false;
  return { status: 'Successfully refreshed the folders.' };
}

export async function streamFolders(): void {
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

export function initializeFolders(RouteID: number, PathAttributeId: [number]) {
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
