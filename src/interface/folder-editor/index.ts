import { Folder, FolderContent, getFolder, listFolderContent, removeFromFolder, updateFolder, updateFolderContentIndex } from '../../data/folder/index';
import { getSettingOptionValue } from '../../data/settings';
import { booleanToString } from '../../tools';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/elements';
import { openIconSelector } from '../icon-selector/index';
import { getBlankIconElement, getIconElement, setIcon } from '../icons/index';
import { hidePreviousPage, pushPageHistory, querySize, revokePageHistory, showPreviousPage } from '../index';
import { promptMessage } from '../prompt/index';

const FolderEditorField = documentQuerySelector('.css_folder_editor_field');
const FolderEditorHeadElement = elementQuerySelector(FolderEditorField, '.css_folder_editor_head');
const LeftButtonElement = elementQuerySelector(FolderEditorHeadElement, '.css_folder_editor_button_left');
const FolderEditorBodyElement = elementQuerySelector(FolderEditorField, '.css_folder_editor_body');
const FolderEditorGroupsElement = elementQuerySelector(FolderEditorBodyElement, '.css_folder_editor_groups');
const NameInputElement = elementQuerySelector(FolderEditorGroupsElement, '.css_folder_editor_group[group="folder-name"] .css_folder_editor_group_body input') as HTMLInputElement;
const IconInputElement = elementQuerySelector(FolderEditorGroupsElement, '.css_folder_editor_group[group="folder-icon"] .css_folder_editor_group_body .css_folder_editor_icon_input input') as HTMLInputElement;
const OpenIconSelectorElement = elementQuerySelector(FolderEditorGroupsElement, '.css_folder_editor_group[group="folder-icon"] .css_folder_editor_group_body .css_folder_editor_icon_input .css_folder_editor_open_icon_selector');
const FolderContentElement = elementQuerySelector(FolderEditorGroupsElement, '.css_folder_editor_group[group="folder-content"] .css_folder_editor_group_body');

const itemElements: Array<HTMLElement> = [];

let previousContent: Array<FolderContent> = [];
let previousSkeletonScreen: boolean = false;
let previousAnimation: boolean = false;

OpenIconSelectorElement.onclick = function () {
  openIconSelector(IconInputElement);
};

function generateElementOfItem(): HTMLElement {
  // Main container
  const itemElement = documentCreateDivElement();
  itemElement.classList.add('css_folder_editor_folder_item');
  itemElement.setAttribute('skeleton-screen', 'false');
  itemElement.setAttribute('animation', 'false');

  // Head
  const headElement = documentCreateDivElement();
  headElement.classList.add('css_folder_editor_folder_item_head');

  // Icon
  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_folder_editor_folder_item_icon');
  iconElement.appendChild(getBlankIconElement());

  // Context
  const contextElement = documentCreateDivElement();
  contextElement.classList.add('css_folder_editor_folder_item_context');

  // Main
  const mainElement = documentCreateDivElement();
  mainElement.classList.add('css_folder_editor_folder_item_main');

  // Drawer
  const drawerElement = documentCreateDivElement();
  drawerElement.classList.add('css_folder_editor_folder_item_drawer');

  // Sort up control
  const sortUpElement = documentCreateDivElement();
  sortUpElement.classList.add('css_folder_editor_folder_item_drawer_button');
  sortUpElement.appendChild(getIconElement('keyboard_arrow_down'));

  // Sort down control
  const sortDownElement = documentCreateDivElement();
  sortDownElement.classList.add('css_folder_editor_folder_item_drawer_button');
  sortDownElement.appendChild(getIconElement('keyboard_arrow_down'));

  // Delete control
  const deleteElement = documentCreateDivElement();
  deleteElement.classList.add('css_folder_editor_folder_item_drawer_button');
  deleteElement.appendChild(getIconElement('delete'));

  // Assemble drawer
  drawerElement.appendChild(sortUpElement);
  drawerElement.appendChild(sortDownElement);
  drawerElement.appendChild(deleteElement);

  // Assemble head
  headElement.appendChild(iconElement);
  headElement.appendChild(contextElement);
  headElement.appendChild(mainElement);

  itemElement.appendChild(headElement);
  itemElement.appendChild(drawerElement);

  return itemElement;
}

function updateFolderEditorField(folder: Folder, content: Array<FolderContent>, callback: Function, skeletonScreen: boolean, animation: boolean): void {
  function updateItem(thisElement: HTMLElement, thisItem: FolderContent, previousItem: FolderContent | null, skeletonScreen: boolean, animation: boolean): void {
    function updateIcon(thisElement: HTMLElement, thisItem: FolderContent): void {
      const headElement = elementQuerySelector(thisElement, '.css_folder_editor_folder_item_head');
      const iconElement = elementQuerySelector(headElement, '.css_folder_editor_folder_item_icon');
      switch (thisItem.type) {
        case 'stop':
          setIcon(iconElement, 'location_on');
          break;
        case 'route':
          setIcon(iconElement, 'route');
          break;
        case 'location':
          setIcon(iconElement, 'location_on');
          break;
        case 'bus':
          setIcon(iconElement, 'directions_bus');
          break;
        case 'empty':
          setIcon(iconElement, 'lightbulb');
          break;
        default:
          break;
      }
    }

    function updateContext(thisElement: HTMLElement, thisItem: FolderContent): void {
      const headElement = elementQuerySelector(thisElement, '.css_folder_editor_folder_item_head');
      const contextElement = elementQuerySelector(headElement, '.css_folder_editor_folder_item_context');
      let context = '';
      switch (thisItem.type) {
        case 'stop':
          context = `${thisItem.route ? thisItem.route.name : ''} - 往${thisItem.route ? [thisItem.route.endPoints.destination, thisItem.route.endPoints.departure, ''][thisItem.direction ? thisItem.direction : 0] : ''}`;
          break;
        case 'route':
          context = `${thisItem.endPoints.departure} \u2194 ${thisItem.endPoints.destination}`;
          break;
        case 'location':
          context = '地點';
          break;
        case 'bus':
          context = '';
          break;
        case 'empty':
          context = '提示';
          break;
        default:
          break;
      }
      contextElement.innerText = context;
    }

    function updateMain(thisElement: HTMLElement, thisItem: FolderContent): void {
      const headElement = elementQuerySelector(thisElement, '.css_folder_editor_folder_item_head');
      const mainElement = elementQuerySelector(headElement, '.css_folder_editor_folder_item_main');
      let main = '';
      switch (thisItem.type) {
        case 'stop':
          main = thisItem.name;
          break;
        case 'route':
          main = thisItem.name;
          break;
        case 'location':
          main = thisItem.name;
          break;
        case 'bus':
          main = thisItem.busID;
          break;
        case 'empty':
          main = '沒有內容';
          break;
        default:
          break;
      }
      mainElement.innerText = main;
    }

    function updateDrawer(thisElement: HTMLElement, thisItem: FolderContent): void {
      const [sortUpElement, sortDownElement, deleteElement] = elementQuerySelectorAll(thisElement, '.css_folder_editor_folder_item_drawer_button');
      sortUpElement.onclick = function () {
        moveItemOnFolderEditor(thisElement, folder.id, thisItem.type, thisItem.id, 'up');
      };

      sortDownElement.onclick = function () {
        moveItemOnFolderEditor(thisElement, folder.id, thisItem.type, thisItem.id, 'down');
      };

      deleteElement.onclick = function () {
        removeItemOnFolderEditor(thisElement, folder.id, thisItem.type, thisItem.id);
      };
    }

    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      thisElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }

    function updateAnimation(thisElement: HTMLElement, animation: boolean): void {
      thisElement.setAttribute('animation', booleanToString(animation));
    }

    if (previousItem !== null) {
      if (previousItem.type !== thisItem.type || previousItem.id !== thisItem.id) {
        updateIcon(thisElement, thisItem);
        updateContext(thisElement, thisItem);
        updateMain(thisElement, thisItem);
        updateDrawer(thisElement, thisItem);
      }

      if (skeletonScreen !== previousSkeletonScreen) {
        updateSkeletonScreen(thisElement, skeletonScreen);
      }

      if (animation !== previousAnimation) {
        updateAnimation(thisElement, animation);
      }
    } else {
      updateIcon(thisElement, thisItem);
      updateContext(thisElement, thisItem);
      updateMain(thisElement, thisItem);
      updateDrawer(thisElement, thisItem);
      updateSkeletonScreen(thisElement, skeletonScreen);
      updateAnimation(thisElement, animation);
    }
  }

  LeftButtonElement.onclick = function () {
    saveEditedFolder(folder.id, callback);
  };
  NameInputElement.value = folder.name;
  IconInputElement.value = folder.icon;

  const contentLength = content.length;

  const itemElementsLength = itemElements.length;
  if (contentLength !== itemElementsLength) {
    const difference = itemElementsLength - contentLength;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newItemElement = generateElementOfItem();
        fragment.appendChild(newItemElement);
        itemElements.push(newItemElement);
      }
      FolderContentElement.append(fragment);
    } else if (difference > 0) {
      for (let p = itemElementsLength - 1, q = itemElementsLength - difference - 1; p > q; p--) {
        itemElements[p].remove();
        itemElements.splice(p, 1);
      }
    }
  }

  for (let i = 0; i < contentLength; i++) {
    const thisElement = itemElements[i];
    const thisItem = content[i];
    const previousItem = previousContent[i];
    if (previousItem) {
      updateItem(thisElement, thisItem, previousItem, skeletonScreen, animation);
    } else {
      updateItem(thisElement, thisItem, null, skeletonScreen, animation);
    }
  }

  previousContent = content;
  previousSkeletonScreen = skeletonScreen;
  previousAnimation = animation;
}

function setupFolderEditorFieldSkeletonScreen(): void {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const folder: Folder = {
    name: '',
    icon: '',
    id: '',
    timestamp: -1
  };
  const WindowSize = querySize('window');
  const defaultItemQuantity = Math.floor(WindowSize.height / 70 / 3) + 2;
  const content: Array<FolderContent> = new Array(defaultItemQuantity).fill({
    type: 'stop',
    id: -1,
    timestamp: -1,
    name: '',
    direction: 0,
    route: {
      name: '',
      endPoints: {
        departure: '',
        destination: ''
      },
      id: -1
    }
  });
  updateFolderEditorField(folder, content, function () {}, true, playing_animation);
}

async function initializeFolderEditorField(folderID: string, callback: Function) {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  setupFolderEditorFieldSkeletonScreen();
  const folder = getFolder(folderID);
  const content = await listFolderContent(folderID);
  if (typeof folder === 'boolean') return;
  updateFolderEditorField(folder, content, callback, false, playing_animation);
}

export function showFolderEditor(): void {
  FolderEditorField.setAttribute('displayed', 'true');
}

export function hideFolderEditor(): void {
  FolderEditorField.setAttribute('displayed', 'false');
}

export function openFolderEditor(folderID: string, callback: Function): void {
  pushPageHistory('FolderEditor');
  showFolderEditor();
  initializeFolderEditorField(folderID, callback);
  hidePreviousPage();
}

export function closeFolderEditor(): void {
  hideFolderEditor();
  showPreviousPage();
  revokePageHistory('FolderEditor');
}

export async function removeItemOnFolderEditor(itemElement: HTMLElement, folderID: Folder['id'], type: FolderContent['type'], id: FolderContent['id']) {
  const removal = await removeFromFolder(folderID, type, id);
  if (removal) {
    itemElement.remove();
    switch (type) {
      case 'stop':
        promptMessage('delete', '已移除站牌');
        break;
      case 'route':
        promptMessage('delete', '已移除路線');
        break;
      case 'location':
        promptMessage('delete', '已移除地點');
        break;
      default:
        promptMessage('delete', '已移除項目');
        break;
    }
  } else {
    promptMessage('error', '無法移除');
  }
}

export async function moveItemOnFolderEditor(itemElement: HTMLElement, folderID: Folder['id'], type: FolderContent['type'], id: FolderContent['id'], direction: 'up' | 'down') {
  const update = await updateFolderContentIndex(folderID, type, id, direction);
  if (update) {
    switch (direction) {
      case 'up': {
        const previousSibling = itemElement.previousElementSibling;
        const parentNode = itemElement.parentNode;
        if (previousSibling && parentNode) {
          parentNode.insertBefore(itemElement, previousSibling);
        }
        promptMessage('arrow_circle_up', '已往上移');
        break;
      }
      case 'down': {
        const nextSibling = itemElement.nextElementSibling;
        const parentNode = itemElement.parentNode;
        if (nextSibling && parentNode) {
          parentNode.insertBefore(nextSibling, itemElement);
        }
        promptMessage('arrow_circle_down', '已往下移');
        break;
      }
      default:
        break;
    }
  } else {
    promptMessage('error', '無法移動');
  }
}

export async function saveEditedFolder(folderID: string, callback: Function) {
  const name = NameInputElement.value;
  const icon = IconInputElement.value;
  const update = await updateFolder(folderID, name, icon);
  if (update) {
    closeFolderEditor();
    if (typeof callback === 'function') {
      callback();
    }
  } else {
    promptMessage('error', '無法儲存變更');
  }
}
