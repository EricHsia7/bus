export function openFolderEditor(): void {
  const Field = documentQuerySelector('.css_folder_manager_field');
  Field.setAttribute('displayed', 'true');
  initializeFolderManagerField();
}

export function closeFolderEditor(): void {
  const Field = documentQuerySelector('.css_folder_manager_field');
  Field.setAttribute('displayed', 'false');
}
