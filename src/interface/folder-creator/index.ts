import { createFolder } from '../../data/folder/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { openIconSelector } from '../icon-selector/index';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';
import { promptMessage } from '../prompt/index';

const FolderCreatorField = documentQuerySelector('.css_folder_creator_field');

const headElement = elementQuerySelector(FolderCreatorField, '.css_folder_creator_head');
const rightButtonElement = elementQuerySelector(headElement, '.css_folder_creator_button_right');

const bodyElement = elementQuerySelector(FolderCreatorField, '.css_folder_creator_body');
const groupsElement = elementQuerySelector(bodyElement, '.css_folder_creator_groups');

const folderNameGroupElement = elementQuerySelector(groupsElement, '.css_folder_creator_group[group="folder-name"]');
const folderNameGroupBodyElement = elementQuerySelector(folderNameGroupElement, '.css_folder_creator_group_body');
const folderNameInputElement = elementQuerySelector(folderNameGroupBodyElement, 'input');

const iconGroupElement = elementQuerySelector(groupsElement, '.css_folder_creator_group[group="folder-icon"]');
const iconGroupBodyElement = elementQuerySelector(iconGroupElement, '.css_folder_creator_group_body');
const iconInputElement = elementQuerySelector(iconGroupBodyElement, '.css_folder_creator_icon_input input');
const openIconSelectorElement = elementQuerySelector(groupsElement, '.css_folder_creator_icon_input .css_folder_creator_open_icon_selector');

export async function createFormulatedFolder(callback: Function) {
  const name = folderNameInputElement.value;
  const icon = iconInputElement.value;
  const creation = await createFolder(name, icon);
  if (creation) {
    closeFolderCreator();
    promptMessage('folder', '已建立資料夾');
    if (typeof callback === 'function') {
      callback();
    }
  } else {
    promptMessage('error', '無法建立資料夾');
  }
}

function initializeFolderCreator(callback: Function): void {
  folderNameInputElement.value = '';
  iconInputElement.value = '';
  rightButtonElement.onclick = function () {
    createFormulatedFolder(callback);
  };
  openIconSelectorElement.onclick = function () {
    openIconSelector(iconInputElement);
  };
}

export function showFolderCreator(pageTransitionReverse: boolean): void {
  const className = pageTransitionReverse ? 'css_page_transition_slide_in_reverse' : 'css_page_transition_fade_in';
  FolderCreatorField.addEventListener(
    'animationend',
    function () {
      FolderCreatorField.classList.remove(className);
    },
    { once: true }
  );
  FolderCreatorField.classList.add(className);
  FolderCreatorField.setAttribute('displayed', 'true');
}

export function hideFolderCreator(pageTransitionReverse: boolean): void {
  const className = pageTransitionReverse === 'ltr' ? 'css_page_transition_slide_out_reverse' : 'css_page_transition_fade_out';
  FolderCreatorField.addEventListener(
    'animationend',
    function () {
      FolderCreatorField.setAttribute('displayed', 'false');
      FolderCreatorField.classList.remove(className);
    },
    { once: true }
  );
  FolderCreatorField.classList.add(className);
}

export function openFolderCreator(callback: Function): void {
  pushPageHistory('FolderCreator');
  initializeFolderCreator(callback);
  showFolderCreator('rtl');
  hidePreviousPage();
}

export function closeFolderCreator(): void {
  hideFolderCreator('ltr');
  showPreviousPage();
  revokePageHistory('FolderCreator');
}
