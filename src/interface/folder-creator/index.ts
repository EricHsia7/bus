import { createFolder } from '../../data/folder/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { openIconSelector } from '../icon-selector/index';
import { MaterialSymbol } from '../icons/material-symbols-type';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';
import { promptMessage } from '../prompt/index';

const Field = documentQuerySelector('.css_folder_creator_field');

const HeadElement = elementQuerySelector(Field, '.css_folder_creator_head');
const HeadButtonRightElement = elementQuerySelector(HeadElement, '.css_folder_creator_button_right');

const BodyElement = elementQuerySelector(Field, '.css_folder_creator_body');
const GroupsElement = elementQuerySelector(BodyElement, '.css_folder_creator_groups');

const FolderNameGroupElement = elementQuerySelector(GroupsElement, '.css_folder_creator_group[group="folder-name"]');
const FolderNameGroupBodyElement = elementQuerySelector(FolderNameGroupElement, '.css_folder_creator_group_body');
const FolderNameInputElement = elementQuerySelector(FolderNameGroupBodyElement, 'input') as HTMLInputElement;

const IconGroupElement = elementQuerySelector(GroupsElement, '.css_folder_creator_group[group="folder-icon"]');
const IconGroupBodyElement = elementQuerySelector(IconGroupElement, '.css_folder_creator_group_body');
const IconInputElement = elementQuerySelector(IconGroupBodyElement, '.css_folder_creator_icon_input input') as HTMLInputElement;
const OpenIconSelectorElement = elementQuerySelector(GroupsElement, '.css_folder_creator_icon_input .css_folder_creator_open_icon_selector');

export async function createFormulatedFolder(callback: Function) {
  const name = FolderNameInputElement.value;
  const icon = IconInputElement.value;
  const creation = await createFolder(name, icon as MaterialSymbol);
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

function initializeFolderCreatorFeild(callback: Function): void {
  FolderNameInputElement.value = '';
  IconInputElement.value = '';
  HeadButtonRightElement.onclick = function () {
    createFormulatedFolder(callback);
  };
  OpenIconSelectorElement.onclick = function () {
    openIconSelector(IconInputElement);
  };
}

export function showFolderCreator(): void {
  Field.setAttribute('displayed', 'true');
}

export function hideFolderCreator(): void {
  Field.setAttribute('displayed', 'false');
}

export function openFolderCreator(callback: Function): void {
  pushPageHistory('FolderCreator');
  initializeFolderCreatorFeild(callback);
  showFolderCreator();
  hidePreviousPage();
}

export function closeFolderCreator(): void {
  hideFolderCreator();
  showPreviousPage();
  revokePageHistory('FolderCreator');
}
