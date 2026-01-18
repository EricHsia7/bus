import { FolderWithContent, listFoldersWithContent } from '../../data/folder/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { openFolderEditor } from '../folder-editor/index';
import { getIconElement } from '../icons/index';
import { GeneratedElement, pushPageHistory, revokePageHistory } from '../index';

const FolderManagerField = documentQuerySelector('.css_folder_manager_field');
const FolderManagerBodyElement = elementQuerySelector(FolderManagerField, '.css_folder_manager_body');
const FolderManagerFolderListElement = elementQuerySelector(FolderManagerBodyElement, '.css_folder_manager_folder_list');

function generateElementOfItem(item: FolderWithContent): GeneratedElement {
  // Main container
  const folderItemElement = document.createElement('div');
  folderItemElement.classList.add('css_folder_manager_folder_item');
  folderItemElement.onclick = () => {
    openFolderEditor(item.id);
  };

  // Icon
  const iconElement = document.createElement('div');
  iconElement.classList.add('css_folder_manager_folder_item_icon');
  iconElement.appendChild(getIconElement(item.icon));

  // Name
  const nameElement = document.createElement('div');
  nameElement.classList.add('css_folder_manager_folder_item_name');
  nameElement.appendChild(document.createTextNode(item.name));

  // Status
  const statusElement = document.createElement('div');
  statusElement.classList.add('css_folder_manager_folder_item_status');
  statusElement.appendChild(document.createTextNode(String(item.contentLength)));

  // Arrow
  const arrowElement = document.createElement('div');
  arrowElement.classList.add('css_folder_manager_folder_item_arrow');
  arrowElement.appendChild(getIconElement('arrow_forward_ios'));

  // Assemble
  folderItemElement.appendChild(iconElement);
  folderItemElement.appendChild(nameElement);
  folderItemElement.appendChild(statusElement);
  folderItemElement.appendChild(arrowElement);

  return {
    element: folderItemElement,
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
