import { ExportedData } from '../export/index';
import { createFolder, FolderWithContentArray, saveToFolder, updateFolder } from '../folder/index';
import { createPersonalSchedule, getPersonalSchedule, PersonalScheduleArray, updatePersonalSchedule } from '../personal-schedule/index';
import { getRecentView, logRecentView, RecentViewArray } from '../recent-views/index';
import { changeSettingOption, getSetting, SettingsWithOptionsArray } from '../settings/index';
import { lfGetItem } from '../storage/index';

export async function importFolders(data: FolderWithContentArray): Promise<boolean> {
  for (const FolderWithContent of data) {
    const folder = FolderWithContent;
    var update = false;
    var creation = false;
    const folderKey: string = `f_${folder.id}`;
    const existingFolder: string = await lfGetItem(9, folderKey);
    if (existingFolder) {
      update = await updateFolder(folder.id, folder.name, folder.icon);
    } else {
      creation = await createFolder(folder.name, folder.icon);
    }
    if (update) {
      for (const content of FolderWithContent.content) {
        await saveToFolder(FolderWithContent.id, content);
      }
    }
    if (creation) {
      for (const content of FolderWithContent.content) {
        await saveToFolder(creation, content);
      }
    }
  }
}

export async function importSettings(data: SettingsWithOptionsArray): Promise<boolean> {
  for (const SettingWithOption of data) {
    const existingSetting = getSetting(SettingWithOption.key);
    if (existingSetting) {
      if (existingSetting.type === 'select') {
        await changeSettingOption(SettingWithOption.key, SettingWithOption.option);
      }
    }
  }
  return true;
}

export async function importPersonalSchedules(data: PersonalScheduleArray): Promise<boolean> {
  for (const PersonalSchedule of data) {
    const existingPersonalSchedule = await getPersonalSchedule(PersonalSchedule.id);
    if (existingPersonalSchedule) {
      await updatePersonalSchedule(PersonalSchedule);
    } else {
      await createPersonalSchedule(PersonalSchedule.name, PersonalSchedule.period.start.hours, PersonalSchedule.period.start.minutes, PersonalSchedule.period.end.hours, PersonalSchedule.period.end.minutes, PersonalSchedule.days);
    }
  }
  return true;
}

export async function importRecentViews(data: RecentViewArray): Promise<boolean> {
  for (const RecentView of data) {
    switch (RecentView.type) {
      case 'route':
        const existingRecentViewRoute = await getRecentView('route', RecentView.id);
        if (!existingRecentViewRoute) {
          await logRecentView(RecentView.type, RecentView.id);
        }
        break;
      case 'location':
        const existingRecentViewLocation = await getRecentView('location', RecentView.hash);
        if (!existingRecentViewLocation) {
          await logRecentView(RecentView.type, RecentView.hash);
        }
        break;
      case 'bus':
        const existingRecentViewBus = await getRecentView('bus', RecentView.id);
        if (!existingRecentViewBus) {
          await logRecentView(RecentView.type, RecentView.id);
        }
        break;
      default:
        break;
    }
  }
  return true;
}

export async function importData(data: string): Promise<boolean> {
  const parsedData: ExportedData = JSON.parse(data);
  switch (parsedData.version) {
    case 1:
      await importFolders(parsedData.folders);
      return true;
      break;
    case 2:
      await importFolders(parsedData.folders);
      await importSettings(parsedData.settings);
      return true;
      break;
    case 3:
      await importFolders(parsedData.folders);
      await importSettings(parsedData.settings);
      await importPersonalSchedules(parsedData.personal_schedules);
      return true;
      break;
    case 4:
      await importFolders(parsedData.folders);
      await importSettings(parsedData.settings);
      await importPersonalSchedules(parsedData.personal_schedules);
      await importRecentViews(parsedData.recent_views);
      return true;
      break;
    default:
      return false;
      break;
  }
}
