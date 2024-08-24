import { documentQuerySelector } from '../../tools/query-selector.ts';

export function openFolderCreator(): void {
  const Field = documentQuerySelector('.css_folder_creator_field');
  Field.setAttribute('displayed', 'true');
}

export function closeFolderCreator(): void {
  const Field = documentQuerySelector('.css_folder_creator_field');
  Field.setAttribute('displayed', 'false');
}
