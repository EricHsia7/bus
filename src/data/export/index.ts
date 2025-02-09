import { FolderWithContentArray, listFoldersWithContent } from '../folder/index';
import { listPersonalSchedules, PersonalScheduleArray } from '../personal-schedule/index';
import { listRecentViews, RecentViewArray } from '../recent-views/index';
import { listSettingsWithOptions, SettingsWithOptionsArray } from '../settings/index';

export interface ExportedDataVersion1 {
  time: string;
  version: 1;
  folders: FolderWithContentArray;
}

export interface ExportedDataVersion2 {
  time: string;
  version: 2;
  folders: FolderWithContentArray;
  settings: SettingsWithOptionsArray;
}

export interface ExportedDataVersion3 {
  time: string;
  version: 3;
  folders: FolderWithContentArray;
  settings: SettingsWithOptionsArray;
  personal_schedules: PersonalScheduleArray;
}

export interface ExportedDataVersion4 {
  time: string;
  version: 4;
  folders: FolderWithContentArray;
  settings: SettingsWithOptionsArray;
  personal_schedules: PersonalScheduleArray;
  recent_views: RecentViewArray;
}

export type ExportedData = ExportedDataVersion1 | ExportedDataVersion2 | ExportedDataVersion3 | ExportedDataVersion4;

export async function exportData(): Promise<string> {
  const foldersWithContent = await listFoldersWithContent();
  const settings = listSettingsWithOptions();
  const personalSchedules = await listPersonalSchedules();
  const RecentViews = await listRecentViews();
  let result: ExportedDataVersion4 = {};
  result.time = new Date().toISOString();
  result.version = 4;
  result.folders = foldersWithContent;
  result.settings = settings;
  result.personal_schedules = personalSchedules;
  result.recent_views = RecentViews;
  return JSON.stringify(result);
}
