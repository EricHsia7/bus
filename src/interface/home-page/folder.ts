import { listFolderContent } from '../../data/folder/index.ts';

function generateElementOfFolder(folder: object, items: []): object {
  function generateElementOfItem(item: object): string {
    if (item.type === 'stop') {
      return `<div class="home_page_folder_item_stop"><div class="home_page_folder_item_stop_status" code="0">--:--</div><div class="home_page_folder_item_stop_route">${item.route.name} - ${[item.endPoints.destination, item.endPoints.departure, ''][item.direction ? item.direction : 0]}</div><div class="home_page_folder_item_stop_name">${item.name}</div></div>`;
    }
    return '';
  }
  var folderIcon = '';
  var folderName = folder.name;
  var folderContent = items.map((item) => generateElementOfItem(item)).join('');
  return `<div class="home_page_folder"><div class="home_page_folder_title"><div class="home_page_folder_icon">${folderIcon}</div><div class="home_page_folder_name">${folderName}</div></div><div class="home_page_folder_content">${folderContent}</div></div>`;
}

async function updateFolderField(): void {
  var foldersElement = document.querySelector('.home_page_field .home_page_body .home_page_folders');
  var folders = await listFolders();
  for(var folder of folders) {
    var FolderContent = await listFolderContent(folder.id);
    foldersElement.innerHTML = generateElementOfFolder(folder, FolderContent);
  }
}
