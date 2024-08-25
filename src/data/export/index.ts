import { Folder, FolderContent, FoldersWithContent, listFoldersWithContent } from '../folder/index';

export async function exportData(): Promise<string> {
  let result = {};
  const foldersWithContent = await listFoldersWithContent();
  result.folders = foldersWithContent;
  return JSON.stringify(result);
}
