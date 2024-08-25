import { createFolder } from '../../data/folder/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { prompt_message } from '../prompt/index';

const folderCreatorField = documentQuerySelector('.css_folder_creator_field');

export function createFormulatedFolder(): void {
  const nameInputElement = elementQuerySelector(folderCreatorField, '.css_folder_creator_body .css_folder_creator_groups .css_folder_creator_group[group="folder-name"] .css_folder_creator_group_body input');
  const iconInputElement = elementQuerySelector(folderCreatorField, '.css_folder_creator_body .css_folder_creator_groups .css_folder_creator_group[group="folder-icon"] .css_folder_creator_group_body .css_folder_creator_icon_input input');
  var name = nameInputElement.value;
  var icon = iconInputElement.value;
  createFolder(name, icon).then((e) => {
    if (e) {
      closeFolderCreator();
      prompt_message('已建立資料夾');
    } else {
      prompt_message('無法建立資料夾');
    }
  });
}

export function openFolderCreator(): void {
  const Field = documentQuerySelector('.css_folder_creator_field');
  Field.setAttribute('displayed', 'true');
}

export function closeFolderCreator(): void {
  const Field = documentQuerySelector('.css_folder_creator_field');
  Field.setAttribute('displayed', 'false');
}
