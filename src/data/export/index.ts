import { FoldersWithContentArray, listFoldersWithContent } from '../folder/index';
import { listSettingsWithOptions, SettingsWithOptions } from '../settings/index';

export interface ExportedDataVersion1 {
  time: string;
  version: 1;
  folders: FoldersWithContentArray;
}

export interface ExportedDataVersion2 {
  time: string;
  version: 2;
  folders: FoldersWithContentArray;
  settings: SettingsWithOptions;
}

export type ExportedData = ExportedDataVersion1 | ExportedDataVersion2;

export async function exportData(): Promise<string> {
  const foldersWithContent = await listFoldersWithContent();
  const settings = listSettingsWithOptions();
  let result: ExportedData = {};
  result.time = new Date().toISOString();
  result.version = 2;
  result.folders = foldersWithContent;
  result.settings = settings;
  return JSON.stringify(result);
}
