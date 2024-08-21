import { Folder, getFolder, listFolderContent } from '../../data/folder/index.ts';
import { md5 } from '../../tools/index.ts';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector.ts';
import { GeneratedElement } from '../index.ts';

function generateElementOfItem(item: object): GeneratedElement {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('css_folder_manager_folder_item');
  element.id = identifier;
  element.innerHTML = `${item.type}`;
  return {
    element: element,
    id: identifier
  };
}

function updateFolderEditorField(folder: Folder, content: object[]): void {
  const Field = documentQuerySelector('.css_folder_manager_field');
  const nameInputElement = elementQuerySelector(Field, '.css_folder_editor_body .css_folder_editor_groups .css_folder_editor_group[group="name"] .css_folder_editor_group_body input');
  nameInputElement.value = folder.name;
  //const iconSelectElement;
  //const iconInputElement;
  const folderContentElement = elementQuerySelector(Field, '.css_folder_editor_body .css_folder_editor_groups .css_folder_editor_group[group="content"] .css_folder_editor_group_body');
  for (var item of content) {
    var thisItemElement = generateElementOfItem(item);
    folderContentElement.appendChild(thisItemElement.element);
  }
}

async function initializeFolderEditorField(folderID: string): void {
  //TODO: add skeleton screen
  var folder = await getFolder(folderID);
  var content = await listFolderContent(folderID);
  updateFolderEditorField(folder, content);
}

export function openFolderEditor(folderID: string): void {
  const Field = documentQuerySelector('.css_folder_manager_field');
  Field.setAttribute('displayed', 'true');
  initializeFolderEditorField(folderID);
}

export function closeFolderEditor(): void {
  const Field = documentQuerySelector('.css_folder_manager_field');
  Field.setAttribute('displayed', 'false');
}
