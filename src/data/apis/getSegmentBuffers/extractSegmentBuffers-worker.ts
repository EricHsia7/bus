import { SegmentBuffers } from './index';

self.onmessage = function (e) {
  const result = processWorkerTask(e.data);
  self.postMessage(result); // Send the result back to the main thread
};

function processWorkerTask(xml: string): SegmentBuffers {
  const startingTagRegex = /^\s*<([a-z_]*)>/im;
  const endingTagRegex = /^\s*<\/([a-z_]*)>/im;
  const inlineRegex = /^\s*<([a-z_]*)>([^<>]*)<\/([a-z_]*)>/im;

  const lines = xml.split(/\n/m);

  const result = [];
  let resultLastIndex = -1;
  let bufferZoneLastIndex = -1;
  let currentTagName = '';
  var currentValue;

  for (const line of lines) {
    const startingTagTest = startingTagRegex.test(line);
    const endingTagTest = endingTagRegex.test(line);
    const inlineTest = inlineRegex.test(line);
    if (startingTagTest && !inlineTest && !endingTagTest) {
      // starting tag
      currentTagName = line.match(startingTagRegex)[1];
      currentValue = null;
      switch (currentTagName) {
        // To prevent the second concatenated dataset erasing the first one, ignore RouteFares
        /*
        case 'RouteFares':
          result = []; // [NOTE] L15: const
          resultLastIndex = -1;
          break;
        */
        case 'RouteFare':
          result.push({});
          resultLastIndex++;
          break;
        case 'BufferZones':
          if (!result[resultLastIndex].hasOwnProperty('BufferZones')) {
            result[resultLastIndex]['BufferZones'] = [];
            bufferZoneLastIndex = -1;
          }
          break;
        case 'BufferZone':
          result[resultLastIndex]['BufferZones'].push({});
          bufferZoneLastIndex++;
          break;
        default:
          break;
      }
    }

    if (startingTagTest && inlineTest && !endingTagTest) {
      // inline tag
      currentTagName = line.match(inlineRegex)[1];
      currentValue = line.match(inlineRegex)[2];
      if (currentTagName === 'RouteID') {
        result[resultLastIndex]['RouteID'] = parseInt(currentValue, 10);
      } else if (currentTagName === 'OriginStopID' || currentTagName === 'DestinationStopID' || currentTagName === 'Direction') {
        result[resultLastIndex]['BufferZones'][bufferZoneLastIndex][currentTagName] = parseInt(currentValue, 10);
      }
    }
    /*
    if (!startingTagTest && !inlineTest && endingTagTest) {
      // ending tag
      currentTagName = line.match(endingTagRegex)[1];
      currentValue = null
    }
    */
  }

  return result;
}
