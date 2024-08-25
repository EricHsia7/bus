import { Folder, FolderContent, FoldersWithContent, listFoldersWithContent } from '../folder/index';

export async function exportData(): Promise<string> {
  const foldersWithContent = await listFoldersWithContent();
  let result = {};
  result.time = new Date().toISOString();
  result.version = 1;
  result.folders = foldersWithContent;
  return JSON.stringify(result);
}
