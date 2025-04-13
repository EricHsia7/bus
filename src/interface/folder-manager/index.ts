import { FolderWithContent, listFoldersWithContent } from '../../data/folder/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { getIconHTML } from '../icons/index';
import { GeneratedElement, pushPageHistory, revokePageHistory } from '../index';

const FolderManagerField = documentQuerySelector('.css_folder_manager_field');
const FolderManagerBodyElement = elementQuerySelector(FolderManagerField, '.css_folder_manager_body');
const FolderManagerFolderListElement = elementQuerySelector(FolderManagerBodyElement, '.css_folder_manager_folder_list');

function generateElementOfItem(item: FolderWithContent): GeneratedElement {
  const element = document.createElement('div');
  element.classList.add('css_folder_manager_folder_item');
  element.setAttribute('onclick', `bus.folder.openFolderEditor('${item.id}')`);
  element.innerHTML = /*html*/ `<div class="css_folder_manager_folder_item_icon">${getIconHTML(item.icon)}</div><div class="css_folder_manager_folder_item_name">${item.name}</div><div class="css_folder_manager_folder_item_status">${item.contentLength}</div><div class="css_folder_manager_folder_item_arrow">${getIconHTML('arrow_forward_ios')}</div>`;
  return {
    element: element,
    id: ''
  };
}

async function initializeFolderManagerField() {
  const foldersWithContent = await listFoldersWithContent();
  FolderManagerFolderListElement.innerHTML = '';
  const fragment = new DocumentFragment();
  for (const item of foldersWithContent) {
    const newItemElement = generateElementOfItem(item);
    fragment.appendChild(newItemElement.element);
  }
  FolderManagerFolderListElement.append(fragment);
}

export function openFolderManager(): void {
  pushPageHistory('FolderManager');
  FolderManagerField.setAttribute('displayed', 'true');
  initializeFolderManagerField();
  // closePreviousPage();
}

export function closeFolderManager(): void {
  revokePageHistory('FolderManager');
  FolderManagerField.setAttribute('displayed', 'false');
  // openPreviousPage();
}
