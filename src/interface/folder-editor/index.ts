async function initializeFolderEditorField(folderID: string): void {}

export function openFolderEditor(folderID: string): void {
  const Field = documentQuerySelector('.css_folder_manager_field');
  Field.setAttribute('displayed', 'true');
  initializeFolderEditorField(folderID);
}

export function closeFolderEditor(): void {
  const Field = documentQuerySelector('.css_folder_manager_field');
  Field.setAttribute('displayed', 'false');
}
