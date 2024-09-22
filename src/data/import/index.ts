import { ExportedData } from '../export/index';
import { createFolder, FoldersWithContentArray, getFolder, saveToFolder, updateFolder } from '../folder/index';
import { SettingsWithOptions } from '../settings/index';
import { lfGetItem } from '../storage/index';

export async function importFolders(data: FoldersWithContentArray): Promise<boolean> {
  for (const FolderWithContent of data) {
    const folder = FolderWithContent.folder;
    var update;
    var creation;
    if (['saved_stop', 'saved_route'].indexOf(folder.id) < 0 && !folder.default) {
      const folderKey: string = `f_${folder.id}`;
      const existingFolder: string = await lfGetItem(4, folderKey);
      if (existingFolder) {
        update = await updateFolder(folder);
      } else {
        creation = await createFolder(folder.name, folder.icon);
      }
    }
    if (update) {
      for (const content of FolderWithContent.content) {
        await saveToFolder(FolderWithContent.folder.id, content);
      }
    }
    if (creation) {
      for (const content of FolderWithContent.content) {
        await saveToFolder(creation, content);
      }
    }
  }
}

export async function importSettings(settings: SettingsWithOptions) {}

export async function importData(data: string): Promise<boolean> {
  const parsedData: ExportedData = JSON.parse(data);
  switch (parsedData.version) {
    case 1:
      await importFolders(parsedData.folders);
      return true;
      break;
    case 2:
      await importFolders(parsedData.folders);
      // parsedData.settings;
      return true;
      break;
    default:
      return false;
      break;
  }
}
