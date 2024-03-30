import { listFolders, listFolderContent, integrateFolders } from '../../data/folder/index.ts';
import { compareThings } from '../../tools/index.ts';
import { formatEstimateTime } from '../../tools/format-time.ts';
import { getUpdateRate } from '../../data/analytics/update-rate.ts';

var md5 = require('md5');

var previousFormattedFoldersWithContent = [];

var foldersRefreshTimer = {
  defaultInterval: 30 * 1000,
  minInterval: 20 * 1000,
  dynamicInterval: 30 * 1000,
  streaming: false,
  lastUpdate: 0,
  nextUpdate: 0,
  refreshing: false,
  currentRequestID: '',
  streamStarted: false
};

async function formatFoldersWithContent(requestID: string): object {
  var integration = await integrateFolders(requestID);
  var foldedItems = {};
  var itemQuantity = {};
  var folderQuantity = 0;
  var folders = {};
  for (var item of integration.items) {
    var folderKey = `f_${item.folder.index}`;
    if (!foldedItems.hasOwnProperty(folderKey)) {
      foldedItems[folderKey] = [];
      itemQuantity[folderKey] = 0;
      folders[folderKey] = item.folder;
    }
    for (var item2 of item.content) {
      var formattedItem = item2;
      formattedItem.status = formatEstimateTime(item2._EstimateTime.EstimateTime, 3);
      foldedItems[folderKey].push(formattedItem);
      itemQuantity[folderKey] = itemQuantity[folderKey] + 1;
    }
    folderQuantity += 1;
  }
  var result = {
    foldedItems: foldedItems,
    folders: folders,
    folderQuantity: folderQuantity,
    itemQuantity: itemQuantity,
    dataUpdateTime: integration.dataUpdateTime
  };
  return result;
}

function generateElementOfItem(item: object, skeletonScreen: boolean): string {
  var identifier = `s_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.id = identifier;
  element.setAttribute('skeleton-screen', skeletonScreen);
  element.setAttribute('stretched', false);
  element.classList.add('home_page_folder_item_stop');
  element.innerHTML = `<div class="home_page_folder_item_stop_status" code="0"></div><div class="home_page_folder_item_stop_route">${item.route ? item.route.name : ''} - ${item.route ? [item.route.endPoints.destination, item.route.endPoints.departure, ''][item.direction ? item.direction : 0] : ''}</div><div class="home_page_folder_item_stop_name">${item.name ? item.name : ''}</div>`;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfFolder(folder: object, index: number, skeletonScreen: boolean): object {
  var identifier = `f_${md5(Math.random() + new Date().getTime())}`;
  var folderIcon = '';
  var folderName = folder.name ? folder.name : '';
  var element = document.createElement('div');
  element.id = identifier;
  element.setAttribute('skeleton-screen', skeletonScreen);
  element.setAttribute('stretched', false);
  element.classList.add('home_page_folder');
  element.setAttribute('index', index);
  element.innerHTML = `<div class="home_page_folder_head"><div class="home_page_folder_icon">${folderIcon}</div><div class="home_page_folder_name">${folderName}</div></div><div class="home_page_folder_content"></div>`;
  return {
    element: element,
    id: identifier
  };
}

export async function updateFoldersField(Field: HTMLElement, formattedFoldersWithContent: {}, skeletonScreen: boolean): void {
  function updateItem(thisElement, thisItem, previousItem) {
    function updateStatus(thisElement: HTMLElement, thisItem: object): void {
      thisElement.querySelector('.home_page_folder_item_stop_status').setAttribute('code', thisItem.status.code);
      thisElement.querySelector('.home_page_folder_item_stop_status').innerText = thisItem.status.text;
    }
    function updateName(thisElement: HTMLElement, thisItem: object): void {
      thisElement.querySelector('.home_page_folder_item_stop_name').innerText = thisItem.name;
    }
    function updateRoute(thisElement: HTMLElement, thisItem: object): void {
      thisElement.querySelector('.home_page_folder_item_stop_route').innerText = [thisItem.route.endPoints.destination, thisItem.route.endPoints.departure, ''][thisItem.direction ? thisItem.direction : 0];
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

  //const FieldWidth = FieldSize.width;
  //const FieldHeight = FieldSize.height;

  if (previousFormattedFoldersWithContent === {}) {
    previousFormattedFoldersWithContent = formattedFoldersWithContent;
  }

  var folderQuantity = formattedFoldersWithContent.folderQuantity;
  var itemQuantity = formattedFoldersWithContent.itemQuantity;
  var foldedItems = formattedFoldersWithContent.foldedItems;

  Field.setAttribute('skeleton-screen', skeletonScreen);

  var currentFolderSeatQuantity = Field.querySelectorAll(`.home_page_folder`).length;
  if (!(folderQuantity === currentFolderSeatQuantity)) {
    var capacity = currentFolderSeatQuantity - folderQuantity;
    if (capacity < 0) {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var folderIndex = currentFolderSeatQuantity + o;
        var thisElement = generateElementOfFolder({}, currentFolderSeatQuantity + o, true);
        Field.appendChild(thisElement.element);
        /*
        var tabElement = document.createElement('div');
        tabElement.classList.add('route_group_tab');
        Field.querySelector(`.route_head .route_group_tabs`).appendChild(tabElement);
     */
      }
    } else {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var folderIndex = currentFolderSeatQuantity - 1 - o;
        Field.querySelectorAll(`.home_page_folder`)[folderIndex].remove();
        //Field.querySelectorAll(`.route_head .route_group_tabs .route_group_tab`)[folderIndex].remove();
      }
    }
  }

  for (var i = 0; i < folderQuantity; i++) {
    var folderKey = `f_${i}`;
    var currentItemSeatQuantity = Field.querySelectorAll(`.home_page_folder[index="${i}"] .home_page_folder_content .home_page_folder_item_stop`).length;
    if (!(itemQuantity[folderKey] === currentItemSeatQuantity)) {
      var capacity = currentItemSeatQuantity - itemQuantity[folderKey];
      if (capacity < 0) {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var thisElement = generateElementOfItem({}, true);
          Field.querySelector(`.home_page_folder[index="${i}"] .home_page_folder_content`).appendChild(thisElement.element);
        }
      } else {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var itemIndex = currentItemSeatQuantity - 1 - o;
          Field.querySelectorAll(`.home_page_folder[index="${i}"] .home_page_folder_content .home_page_folder_item_stop`)[itemIndex].remove();
        }
      }
    }
  }

  for (var i = 0; i < folderQuantity; i++) {
    var folderKey = `f_${i}`;
    var thisHeadElement = Field.querySelector(`.home_page_folder[index="${i}"] .home_page_folder_head`);
    thisHeadElement.querySelector('.home_page_folder_name').innerText = thisTabElement.innerHTML = [formattedFoldersWithContent.RouteEndPoints.RouteDestination, formattedFoldersWithContent.RouteEndPoints.RouteDeparture, ''].map((e) => `<span>往${e}</span>`)[i];
    for (var j = 0; j < itemQuantity[folderKey]; j++) {
      var thisElement = Field.querySelectorAll(`.home_page_folder[index="${i}"] .home_page_folder_content .home_page_folder_item_stop`)[j];
      thisElement.setAttribute('skeleton-screen', skeletonScreen);
      var thisItem = foldedItems[folderKey][j];
      if (previousFormattedFoldersWithContent.hasOwnProperty('foldedItems')) {
        if (previousFormattedFoldersWithContent.foldedItems.hasOwnProperty(folderKey)) {
          if (previousFormattedFoldersWithContent.foldedItems[folderKey][j]) {
            var previousItem = previousFormattedFoldersWithContent.foldedItems[folderKey][j];
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
  previousFormattedFoldersWithContent = formattedFoldersWithContent;
}

export async function refreshFolders(): object {
  foldersRefreshTimer.refreshing = true;
  foldersRefreshTimer.currentRequestID = `r_${md5(Math.random() * new Date().getTime())}`;
  var formattedFoldersWithContent = await formatFoldersWithContent(foldersRefreshTimer.currentRequestID);
  var Field = document.querySelector('.home_page_field .home_page_body .home_page_folders');
  updateFoldersField(Field, formattedFoldersWithContent, false);
  foldersRefreshTimer.lastUpdate = new Date().getTime();
  var updateRate = await getUpdateRate();
  foldersRefreshTimer.nextUpdate = Math.max(new Date().getTime() + foldersRefreshTimer.minInterval, formattedFoldersWithContent.dataUpdateTime + foldersRefreshTimer.defaultInterval / updateRate);
  foldersRefreshTimer.dynamicInterval = Math.max(foldersRefreshTimer.minInterval, formattedFoldersWithContent.nextUpdate - new Date().getTime());
  foldersRefreshTimer.refreshing = false;
  return { status: 'Successfully refreshed the folders.' };
}

export async function streamFolders(): void {}
