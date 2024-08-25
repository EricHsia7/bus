import { Folder, FolderContent, FoldersWithContent, listFoldersWithContent } from '../folder/index';

function generateFolderContentExport(content: FolderContent): string {
  switch (content.type) {
    case 'stop':
      return `[FolderStop]
type: stop
id: ${content.id}
time: ${content.time}
name: ${content.name}
direction: ${content.direction}
route.name: ${content.route.name}
route.endPoints.departure: ${content.route.endPoints.departure}
route.endPoints.destination: ${content.route.endPoints.destination}
route.id: ${content.route.id}
index: ${content.index}

`;
    case 'route':
      return `[FolderRoute]
type: route
id: ${content.id}
time: ${content.time}
name: ${content.name}
endPoints.departure: ${content.endPoints.departure}
endPoints.destination: ${content.endPoints.destination}
index: ${content.index}

`;
    case 'bus':
      return `[FolderBus]
type: bus
id: ${content.id}
time: ${content.time}
busID: ${content.busID}
index: ${content.index}

`;
    case 'empty':
      return `[FolderEmpty]
type: empty
id: ${content.id}
index: ${content.index}

`;
    default:
      throw new Error(`Unknown content type: ${content.type}`);
  }
}

function generateFolderExport(folder: Folder, content: FolderContent[]): string {
  let result: string = `folder:
[Folder]
name: ${folder.name}
icon: ${folder.icon}
default: ${folder.default}
storeIndex: ${folder.storeIndex}
index: ${folder.index}
contentType: ${folder.contentType.join(',')}
id: ${folder.id}
time: ${folder.time}
timeNumber: ${folder.timeNumber}
content:
`;
  for (const item of content) {
    result += generateFolderContentExport(item);
  }
  return result;
}

function generateFoldersWithContentExport(foldersWithContent: FoldersWithContent[]): string {
  let result: string = '';
  for (const folderWithContent of foldersWithContent) {
    `[FoldersWithContent]
${generateFolderExport(folderWithContent.folder, folderWithContent.content)}
`;
  }
  return result;
}

export async function exportData(): Promise<string> {
  let result: string = '';
  const foldersWithContent: FoldersWithContent[] = listFoldersWithContent();
  result += generateFoldersWithContentExport(foldersWithContent);
  return result
}
