import { createFolder } from '../../data/folder/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { openIconSelector } from '../icon-selector/index';
import { hidePreviousPage, showPreviousPage, pushPageHistory, revokePageHistory } from '../index';
import { promptMessage } from '../prompt/index';

const FolderCreatorField = documentQuerySelector('.css_folder_creator_field');
const FolderCreatorBodyElement = elementQuerySelector(FolderCreatorField, '.css_folder_creator_body');
const FolderCreatorGroupsElement = elementQuerySelector(FolderCreatorBodyElement, '.css_folder_creator_groups');
const NameInputElement = elementQuerySelector(FolderCreatorGroupsElement, '.css_folder_creator_group[group="folder-name"] .css_folder_creator_group_body input');
const IconInputElement = elementQuerySelector(FolderCreatorGroupsElement, '.css_folder_creator_group[group="folder-icon"] .css_folder_creator_group_body .css_folder_creator_icon_input input');
const OpenIconSelectorElement = elementQuerySelector(FolderCreatorGroupsElement, '.css_folder_creator_field .css_folder_creator_body .css_folder_creator_groups .css_folder_creator_group[group="folder-icon"] .css_folder_creator_group_body .css_folder_creator_icon_input .css_folder_creator_open_icon_selector');

OpenIconSelectorElement.onclick = function () {
  openIconSelector(IconInputElement);
};

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

export function showFolderCreator(): void {
  FolderCreatorField.setAttribute('displayed', 'true');
}

export function hideFolderCreator(): void {
  FolderCreatorField.setAttribute('displayed', 'false');
}

export function openFolderCreator(): void {
  pushPageHistory('FolderCreator');
  showFolderCreator();
  hidePreviousPage();
}

export function closeFolderCreator(): void {
  hideFolderCreator();
  showPreviousPage();
  revokePageHistory('FolderCreator');
}
