import { FoldersWithContent, listFoldersWithContent } from '../folder/index';
import { listSettings } from '../settings/index';

export interface ExportedDataVersion1 {
  time: string
  version: 1
  folders: Array<FoldersWithContent>
}

export interface ExportedDataVersion2 {
  time: string
  version: 2
  folders: Array<FoldersWithContent>
  settings
}

export async function exportData(): Promise<string> {
  const foldersWithContent = await listFoldersWithContent();
  const settings = listSettings();
  let result = {};
  result.time = new Date().toISOString();
  result.version = 2;
  result.folders = foldersWithContent;
  result.settings = settings;
  return JSON.stringify(result);
}
