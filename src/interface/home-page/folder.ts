import { listFolders, listFolderContent } from '../../data/folder/index.ts';

var previousFoldersWithContent = [];

var foldersRefreshTimer = {
  defaultInterval: 15 * 1000,
  minInterval: 5 * 1000,
  dynamicInterval: 15 * 1000,
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

export async function updateFoldersField(Field: HTMLElement, foldersWithContent: []): void {}

export async function refreshFolders(): object {
  foldersRefreshTimer.refreshing = true;
  foldersRefreshTimer.currentRequestID = `r_${md5(Math.random() * new Date().getTime())}`;
  document.querySelector('.update_timer').setAttribute('refreshing', true);
  var foldersWithContent = await listFoldersWithContent();
  var Field = document.querySelector('.home_page_field .home_page_body .home_page_folders');
  updateRouteField(Field, formattedRoute, false);
  routeRefreshTimer.lastUpdate = new Date().getTime();
  var updateRate = await getUpdateRate();
  routeRefreshTimer.nextUpdate = Math.max(new Date().getTime() + routeRefreshTimer.minInterval, formattedRoute.dataUpdateTime + routeRefreshTimer.defaultInterval / updateRate);
  routeRefreshTimer.dynamicInterval = Math.max(routeRefreshTimer.minInterval, routeRefreshTimer.nextUpdate - new Date().getTime());
  routeRefreshTimer.refreshing = false;
  document.querySelector('.update_timer').setAttribute('refreshing', false);
  return { status: 'Successfully refreshed the route.' };
}

export async function streamFolders(): void {}
