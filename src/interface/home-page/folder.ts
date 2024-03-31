import { listFolders, listFolderContent, integrateFolders } from '../../data/folder/index.ts';
import { compareThings } from '../../tools/index.ts';
import { formatEstimateTime } from '../../tools/format-time.ts';
import { getUpdateRate } from '../../data/analytics/update-rate.ts';
import { icons } from '../icons/index.ts';

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

function queryFolderFieldSize(): object {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

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

function generateElementOfItem(skeletonScreen: boolean): string {
  var identifier = `s_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.id = identifier;
  element.setAttribute('skeleton-screen', skeletonScreen);
  element.setAttribute('stretched', false);
  element.classList.add('home_page_folder_item_stop');
  element.innerHTML = `<div class="home_page_folder_item_stop_status"><div class="next_slide" code="0"></div><div class="current_slide" code="0"></div></div><div class="home_page_folder_item_stop_route"></div><div class="home_page_folder_item_stop_name"></div>`;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfFolder(index: number, skeletonScreen: boolean): object {
  var identifier = `f_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.id = identifier;
  element.setAttribute('skeleton-screen', skeletonScreen);
  element.setAttribute('stretched', false);
  element.classList.add('home_page_folder');
  element.setAttribute('index', index);
  element.innerHTML = `<div class="home_page_folder_head"><div class="home_page_folder_icon"></div><div class="home_page_folder_name"></div></div><div class="home_page_folder_content"></div>`;
  return {
    element: element,
    id: identifier
  };
}

function setUpFolderFieldSkeletonScreen(Field: HTMLElement) {
  const FieldSize = queryFolderFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;
  var defaultItemQuantity = { f_0: Math.floor(FieldHeight / 50) + 5, f_1: Math.floor(FieldHeight / 50) + 5, f_2: Math.floor(FieldHeight / 50) + 5 };
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
  updateFoldersField(
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

export async function updateFoldersField(Field: HTMLElement, formattedFoldersWithContent: {}, skeletonScreen: boolean): void {
  function updateItem(thisElement, thisItem, previousItem) {
    function updateStatus(thisElement: HTMLElement, thisItem: object): void {
      var nextSlide = thisElement.querySelector('.home_page_folder_item_stop_status .next_slide');
      var currentSlide = thisElement.querySelector('.home_page_folder_item_stop_status .current_slide');
      nextSlide.setAttribute('code', thisItem.status.code);
      nextSlide.innerText = thisItem.status.text;
      currentSlide.addEventListener(
        'animationend',
        function () {
          currentSlide.setAttribute('code', thisItem.status.code);
          currentSlide.innerText = thisItem.status.text;
          currentSlide.classList.remove('slide_fade_out');
        },
        { once: true }
      );
      currentSlide.classList.add('slide_fade_out');
    }
    function updateName(thisElement: HTMLElement, thisItem: object): void {
      thisElement.querySelector('.home_page_folder_item_stop_name').innerText = thisItem.name;
    }
    function updateRoute(thisElement: HTMLElement, thisItem: object): void {
      thisElement.querySelector('.home_page_folder_item_stop_route').innerText = `${thisItem.route ? thisItem.route.name : ''} - 往${thisItem.route ? [thisItem.route.endPoints.destination, thisItem.route.endPoints.departure, ''][thisItem.direction ? thisItem.direction : 0] : ''}`;
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

  if (previousFormattedFoldersWithContent === {}) {
    previousFormattedFoldersWithContent = formattedFoldersWithContent;
  }

  var folderQuantity = formattedFoldersWithContent.folderQuantity;
  var itemQuantity = formattedFoldersWithContent.itemQuantity;
  var foldedItems = formattedFoldersWithContent.foldedItems;
  var folders = formattedFoldersWithContent.folders;

  Field.setAttribute('skeleton-screen', skeletonScreen);

  var currentFolderSeatQuantity = Field.querySelectorAll(`.home_page_folder`).length;
  if (!(folderQuantity === currentFolderSeatQuantity)) {
    var capacity = currentFolderSeatQuantity - folderQuantity;
    if (capacity < 0) {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var folderIndex = currentFolderSeatQuantity + o;
        var thisElement = generateElementOfFolder(currentFolderSeatQuantity + o, true);
        Field.appendChild(thisElement.element);
      }
    } else {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var folderIndex = currentFolderSeatQuantity - 1 - o;
        Field.querySelectorAll(`.home_page_folder`)[folderIndex].remove();
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
          var thisElement = generateElementOfItem(true);
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
    thisHeadElement.querySelector('.home_page_folder_name').innerText = folders[folderKey].name;
    thisHeadElement.querySelector('.home_page_folder_icon').innerHTML = folders[folderKey].icon.source === 'icons' ? icons[folders[folderKey].icon.id] : '';
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
  var Field = document.querySelector('.home_page_field .home_page_body .home_page_folders');
  setUpFolderFieldSkeletonScreen(Field);
  foldersRefreshTimer.refreshing = true;
  foldersRefreshTimer.currentRequestID = `r_${md5(Math.random() * new Date().getTime())}`;
  var formattedFoldersWithContent = await formatFoldersWithContent(foldersRefreshTimer.currentRequestID);
  updateFoldersField(Field, formattedFoldersWithContent, false);
  foldersRefreshTimer.lastUpdate = new Date().getTime();
  var updateRate = await getUpdateRate();
  foldersRefreshTimer.nextUpdate = Math.max(new Date().getTime() + foldersRefreshTimer.minInterval, formattedFoldersWithContent.dataUpdateTime + foldersRefreshTimer.defaultInterval / updateRate);
  foldersRefreshTimer.dynamicInterval = Math.max(foldersRefreshTimer.minInterval, formattedFoldersWithContent.nextUpdate - new Date().getTime());
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
      console.log(err);
      if (foldersRefreshTimer.streaming) {
        foldersRefreshTimer.timer = setTimeout(function () {
          streamFolders();
        }, foldersRefreshTimer.minInterval);
      } else {
        foldersRefreshTimer.streamStarted = false;
      }
    });
}
