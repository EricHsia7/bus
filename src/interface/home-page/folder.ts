import { listFolders, listFolderContent, integrateFolders } from '../../data/folder/index.ts';

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

function generateElementOfFolder(folder: object, items: []): object {
  function generateElementOfItem(item: object): string {
    if (item.type === 'stop') {
      return `<div class="home_page_folder_item_stop"><div class="home_page_folder_item_stop_status" code="0"></div><div class="home_page_folder_item_stop_route">${item.route.name} - ${[item.route.endPoints.destination, item.route.endPoints.departure, ''][item.direction ? item.direction : 0]}</div><div class="home_page_folder_item_stop_name">${item.name}</div></div>`;
    }
    return '';
  }
  var folderIcon = '';
  var folderName = folder.name;
  var folderContent = items.map((item) => generateElementOfItem(item)).join('');
  return `<div class="home_page_folder"><div class="home_page_folder_title"><div class="home_page_folder_icon">${folderIcon}</div><div class="home_page_folder_name">${folderName}</div></div><div class="home_page_folder_content">${folderContent}</div></div>`;
}

export async function updateFoldersField(Field: HTMLElement, formattedFoldersWithContent: []): void {
  function updateItem(thisElement, thisItem, previousItem) {
    if (previousItem === null) {
      updateStatus(thisElement, thisItem);
      updateName(thisElement, thisItem);
      updateBuses(thisElement, thisItem);
      updateOverlappingRoutes(thisElement, thisItem);
      updateSegmentBuffer(thisElement, thisItem);
      updateStretch(thisElement, skeletonScreen);
      updateSaveStopActionButton(thisElement, thisItem, formattedFoldersWithContent);
    } else {
      if (!(thisItem.status.code === previousItem.status.code) || !compareThings(previousItem.status.text, thisItem.status.text)) {
        updateStatus(thisElement, thisItem);
      }
      if (!compareThings(previousItem.name, thisItem.name)) {
        updateName(thisElement, thisItem);
      }
      if (!compareThings(previousItem.buses, thisItem.buses)) {
        updateBuses(thisElement, thisItem);
      }
      if (!compareThings(previousItem.overlappingRoutes, thisItem.overlappingRoutes)) {
        updateOverlappingRoutes(thisElement, thisItem);
      }
      if (!(previousItem.segmentBuffer === thisItem.segmentBuffer)) {
        updateSegmentBuffer(thisElement, thisItem);
      }
      if (!(previousItem.id === thisItem.id)) {
        updateSaveStopActionButton(thisElement, thisItem, formattedFoldersWithContent);
      }
      updateStretch(thisElement, skeletonScreen);
    }
  }

  //const FieldWidth = FieldSize.width;
  //const FieldHeight = FieldSize.height;

  if (previousFormattedFoldersWithContent === []) {
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
        var thisElement = document.createElement('div');
        thisElement.classList.add('home_page_folder');
        thisElement.setAttribute('group', currentFolderSeatQuantity + o);
        /*
        var tabElement = document.createElement('div');
        tabElement.classList.add('route_group_tab');
        Field.querySelector(`.route_groups`).appendChild(thisElement);
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
    var groupKey = `g_${i}`;
    var currentItemSeatQuantity = Field.querySelectorAll(`.home_page_folder[index="${i}"] .item`).length;
    if (!(itemQuantity[groupKey] === currentItemSeatQuantity)) {
      var capacity = currentItemSeatQuantity - itemQuantity[groupKey];
      if (capacity < 0) {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var thisElement = generateElementOfItem({}, true);
          Field.querySelector(`.home_page_folder[index="${i}"]`).appendChild(thisElement.element);
        }
      } else {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var itemIndex = currentItemSeatQuantity - 1 - o;
          Field.querySelectorAll(`.home_page_folder[index="${i}"] .item`)[itemIndex].remove();
        }
      }
    }
  }

  for (var i = 0; i < folderQuantity; i++) {
    var groupKey = `g_${i}`;
    /* var thisTabElement = Field.querySelectorAll(`.route_head .route_group_tabs .route_group_tab`)[i];
    thisTabElement.innerHTML = [formattedFoldersWithContent.RouteEndPoints.RouteDestination, formattedFoldersWithContent.RouteEndPoints.RouteDeparture, ''].map((e) => `<span>往${e}</span>`)[i];
   */
    for (var j = 0; j < itemQuantity[groupKey]; j++) {
      var thisElement = Field.querySelectorAll(`.home_page_folder[index="${i}"] .item`)[j];
      thisElement.setAttribute('skeleton-screen', skeletonScreen);
      var thisItem = foldedItems[groupKey][j];
      if (previousFormattedFoldersWithContent.hasOwnProperty('foldedItems')) {
        if (previousFormattedFoldersWithContent.foldedItems.hasOwnProperty(groupKey)) {
          if (previousFormattedFoldersWithContent.foldedItems[groupKey][j]) {
            var previousItem = previousFormattedFoldersWithContent.foldedItems[groupKey][j];
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
  var foldersWithContent = await integrateFolders();
  var formattedFoldersWithContent = formatFoldersWithContent(foldersWithContent);
  var Field = document.querySelector('.home_page_field .home_page_body .home_page_folders');
  updateFoldersField(Field, formattedFoldersWithContent, false);
  foldersRefreshTimer.lastUpdate = new Date().getTime();
  var updateRate = await getUpdateRate();
  foldersRefreshTimer.nextUpdate = Math.max(new Date().getTime() + foldersRefreshTimer.minInterval, formattedFoldersWithContent.dataUpdateTime + foldersRefreshTimer.defaultInterval / updateRate);
  foldersRefreshTimer.dynamicInterval = Math.max(foldersRefreshTimer.minInterval, formattedFoldersWithContent.nextUpdate - new Date().getTime());
  foldersRefreshTimer.refreshing = false;
  return { status: 'Successfully refreshed the route.' };
}

export async function streamFolders(): void {}
