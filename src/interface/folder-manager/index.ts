import { documentQuerySelector } from '../../tools/query-selector.ts';

async function initializeFolderManagerField(): void {}

export function openFolderManager(): void {
  var Field = documentQuerySelector('.css_folder_manager_field');
  Field.setAttribute('displayed', 'true');
}

export function closeFolderManager(): void {
  var Field = documentQuerySelector('.css_folder_manager_field');
  Field.setAttribute('displayed', 'false');
}
