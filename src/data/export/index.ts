import { FoldersWithContentArray, listFoldersWithContent } from '../folder/index';
import { listPersonalSchedules } from '../personal-schedule/index';
import { listSettingsWithOptions, SettingsWithOptionsArray } from '../settings/index';

export interface ExportedDataVersion1 {
  time: string;
  version: 1;
  folders: FoldersWithContentArray;
}

export interface ExportedDataVersion2 {
  time: string;
  version: 2;
  folders: FoldersWithContentArray;
  settings: SettingsWithOptionsArray;
}

export interface ExportedDataVersion3 {
  time: string;
  version: 3;
  folders: FoldersWithContentArray;
  settings: SettingsWithOptionsArray;
  personal_schedules: PersonalScheduleArray;
}

export type ExportedData = ExportedDataVersion1 | ExportedDataVersion2 | ExportedDataVersion3;

export async function exportData(): Promise<string> {
  const foldersWithContent = await listFoldersWithContent();
  const settings = listSettingsWithOptions();
  const personalSchedules = await listPersonalSchedules();
  let result: ExportedDataVersion3 = {};
  result.time = new Date().toISOString();
  result.version = 3;
  result.folders = foldersWithContent;
  result.settings = settings;
  result.personal_schedules = personalSchedules;
  return JSON.stringify(result);
}
