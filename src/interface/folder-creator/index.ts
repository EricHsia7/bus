import { createFolder } from '../../data/folder/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { closePreviousPage, openPreviousPage, pushPageHistory, revokePageHistory } from '../index';
import { promptMessage } from '../prompt/index';

const folderCreatorField = documentQuerySelector('.css_folder_creator_field');

export function createFormulatedFolder(): void {
  const nameInputElement = elementQuerySelector(folderCreatorField, '.css_folder_creator_body .css_folder_creator_groups .css_folder_creator_group[group="folder-name"] .css_folder_creator_group_body input');
  const iconInputElement = elementQuerySelector(folderCreatorField, '.css_folder_creator_body .css_folder_creator_groups .css_folder_creator_group[group="folder-icon"] .css_folder_creator_group_body .css_folder_creator_icon_input input');
  var name = nameInputElement.value;
  var icon = iconInputElement.value;
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
  const Field = documentQuerySelector('.css_folder_creator_field');
  Field.setAttribute('displayed', 'true');
  closePreviousPage();
}

export function closeFolderCreator(): void {
  // revokePageHistory('FolderCreator');
  const Field = documentQuerySelector('.css_folder_creator_field');
  Field.setAttribute('displayed', 'false');
  openPreviousPage();
}
