import { FolderWithContentLength, listFoldersWithContentLength } from '../../data/folder/index';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { openFolderEditor } from '../folder-editor/index';
import { getIconElement } from '../icons/index';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';

const FolderManagerField = documentQuerySelector('.css_folder_manager_field');
const FolderManagerBodyElement = elementQuerySelector(FolderManagerField, '.css_folder_manager_body');
const FolderManagerFolderListElement = elementQuerySelector(FolderManagerBodyElement, '.css_folder_manager_folder_list');

function generateElementOfItem(item: FolderWithContentLength): HTMLElement {
  // Main container
  const folderItemElement = documentCreateDivElement();
  folderItemElement.classList.add('css_folder_manager_folder_item');
  folderItemElement.onclick = () => {
    openFolderEditor(item.id);
  };

  // Icon
  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_folder_manager_folder_item_icon');
  iconElement.appendChild(getIconElement(item.icon));

  // Name
  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_folder_manager_folder_item_name');
  nameElement.innerText = item.name;

  // Status
  const statusElement = documentCreateDivElement();
  statusElement.classList.add('css_folder_manager_folder_item_status');
  statusElement.innerText = String(item.contentLength);

  // Arrow
  const arrowElement = documentCreateDivElement();
  arrowElement.classList.add('css_folder_manager_folder_item_arrow');
  arrowElement.appendChild(getIconElement('arrow_forward_ios'));

  // Assemble
  folderItemElement.appendChild(iconElement);
  folderItemElement.appendChild(nameElement);
  folderItemElement.appendChild(statusElement);
  folderItemElement.appendChild(arrowElement);

  return folderItemElement;
}

async function initializeFolderManagerField() {
  const foldersWithContent = await listFoldersWithContentLength();
  FolderManagerFolderListElement.innerHTML = '';
  const fragment = new DocumentFragment();
  for (const item of foldersWithContent) {
    const newItemElement = generateElementOfItem(item);
    fragment.appendChild(newItemElement);
  }
  FolderManagerFolderListElement.append(fragment);
}

export function showFolderManager(): void {
  FolderManagerField.setAttribute('displayed', 'true');
}

export function hideFolderManager(): void {
  FolderManagerField.setAttribute('displayed', 'false');
}

export function openFolderManager(): void {
  pushPageHistory('FolderManager');
  showFolderManager();
  initializeFolderManagerField();
  hidePreviousPage();
}

export function closeFolderManager(): void {
  hideFolderManager();
  showPreviousPage();
  revokePageHistory('FolderManager');
}
