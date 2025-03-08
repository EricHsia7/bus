import { BusArrivalTimeDataGroupArray, listBusArrivalTimeDataGroups } from '../analytics/bus-arrival-time/index';
import { DataUsageStatsChunkArray, listDataUsageStatsChunks } from '../analytics/data-usage/index';
import { listUpdateRateDataGroups, UpdateRateDataGroupArray } from '../analytics/update-rate/index';
import { Folder, FolderArray, FolderContentArray, FolderContentIndexArray, getFolderContentIndexArray, listAllFolderContent, listFolders } from '../folder/index';
import { listPersonalSchedules, PersonalScheduleArray } from '../personal-schedule/index';
import { listRecentViews, RecentViewArray } from '../recent-views/index';
import { listSettingsWithOptions, SettingsWithOptionsArray } from '../settings/index';

export interface ExportedData {
  folders: FolderArray;
  folderContentIndex: {
    [folderID: Folder['id']]: FolderContentIndexArray;
  };
  folderContent: FolderContentArray;
  settings: SettingsWithOptionsArray;
  personalSchedules: PersonalScheduleArray;
  recentViews: RecentViewArray;
  analytics: {
    busArrivalTime: BusArrivalTimeDataGroupArray;
    updateRate: UpdateRateDataGroupArray;
    dataUsage: DataUsageStatsChunkArray;
  };
  version: 5;
  timestamp: number;
}

export async function exportData(): Promise<string> {
  let result = {} as ExportedData;
  // folders
  const folders = await listFolders();
  result.folders = folders;
  result.folderContentIndex = {};
  for (const folder of folders) {
    const key = `f_${folder.id}`;
    const thisFolderContentIndexArray = await getFolderContentIndexArray(folder.id);
    folderContentIndex[key] = thisFolderContentIndexArray;
  }
  const allFolderContent = await listAllFolderContent([]);
  result.folderContent = allFolderContent;

  // settings
  const settings = listSettingsWithOptions();
  result.settings = settings;

  // personal schedules
  const personalSchedules = await listPersonalSchedules();
  result.personalSchedules = personalSchedules;

  // recent views
  const recentViews = await listRecentViews();
  result.recentViews = recentViews;

  // analytics
  result.analytics = {};
  const busArrivalTime = await listBusArrivalTimeDataGroups();
  result.analytics.busArrivalTime = busArrivalTime;
  const updateRate = listUpdateRateDataGroups();
  result.analytics.updateRate = updateRate;
  const dataUsage = await listDataUsageStatsChunks();
  result.analytics.dataUsage = dataUsage;

  result.version = 5;
  result.timestamp = new Date().getTime();
  return JSON.stringify(result);
}
