import { createFolder } from '../../data/folder/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { closePreviousPage, openPreviousPage, pushPageHistory } from '../index';
import { promptMessage } from '../prompt/index';

const FolderCreatorField = documentQuerySelector('.css_folder_creator_field');
const FolderCreatorBodyElement = elementQuerySelector(FolderCreatorField, '.css_folder_creator_body');
const FolderCreatorGroupsElement = elementQuerySelector(FolderCreatorBodyElement, '.css_folder_creator_groups');
const NameInputElement = elementQuerySelector(FolderCreatorGroupsElement, '.css_folder_creator_group[group="folder-name"] .css_folder_creator_group_body input');
const IconInputElement = elementQuerySelector(FolderCreatorGroupsElement, '.css_folder_creator_group[group="folder-icon"] .css_folder_creator_group_body .css_folder_creator_icon_input input');

export function createFormulatedFolder(): void {
  const name = NameInputElement.value;
  const icon = IconInputElement.value;
  createFolder(name, icon).then((e) => {
    if (e) {
      closeFolderCreator();
      promptMessage('folder', '已建立資料夾');
    } else {
      promptMessage('error', '無法建立資料夾');
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
