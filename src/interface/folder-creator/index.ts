import { createFolder } from '../../data/folder/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { openFolderIconSelector } from '../folder-icon-selector/index';
import { closePreviousPage, openPreviousPage, pushPageHistory } from '../index';
import { promptMessage } from '../prompt/index';

const FolderCreatorField = documentQuerySelector('.css_folder_creator_field');
const FolderCreatorBodyElement = elementQuerySelector(FolderCreatorField, '.css_folder_creator_body');
const FolderCreatorGroupsElement = elementQuerySelector(FolderCreatorBodyElement, '.css_folder_creator_groups');
const NameInputElement = elementQuerySelector(FolderCreatorGroupsElement, '.css_folder_creator_group[group="folder-name"] .css_folder_creator_group_body input');
const IconInputElement = elementQuerySelector(FolderCreatorGroupsElement, '.css_folder_creator_group[group="folder-icon"] .css_folder_creator_group_body .css_folder_creator_icon_input input');
const OpenFolderIconSelectorElement = elementQuerySelector(FolderCreatorGroupsElement, '.css_folder_creator_field .css_folder_creator_body .css_folder_creator_groups .css_folder_creator_group[group="folder-icon"] .css_folder_creator_group_body .css_folder_creator_icon_input .css_folder_creator_open_folder_icon_selector');

OpenFolderIconSelectorElement.onclick = function () {
  openFolderIconSelector('creator');
};

export function createFormulatedFolder(): void {
  const name = NameInputElement.value;
  const icon = IconInputElement.value;
  createFolder(name, icon).then((e) => {
    if (e) {
      closeFolderCreator();
      promptMessage('已建立資料夾', 'folder');
    } else {
      promptMessage('無法建立資料夾', 'error');
    }
  });
}

export function openFolderCreator(): void {
  pushPageHistory('FolderCreator');
  FolderCreatorField.setAttribute('displayed', 'true');
  closePreviousPage();
}

export function closeFolderCreator(): void {
  // revokePageHistory('FolderCreator');
  FolderCreatorField.setAttribute('displayed', 'false');
  openPreviousPage();
}
