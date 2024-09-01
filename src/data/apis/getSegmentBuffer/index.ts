export interface BufferZoneItem {
  Direction: 0 | 1 | 2;
  OriginStopID: number;
  DestinationStopID: number;
}

export type BufferZones = Array<BufferZoneItem>;

export interface SegmentBufferItem {
  RouteID: number;
  BufferZones: BufferZones;
}

export type SegmentBuffers = Array<SegmentBufferItem>;

function parseSegmentBuffers(xml: string): object {
  const startingTagRegex = /^\s*<([a-z_]*)>/im;
  const endingTagRegex = /^\s*<\/([a-z_]*)>/im;
  const inlineRegex = /^\s*<([a-z_]*)>([^<>]*)<\/([a-z_]*)>/im;

  const lines = xml.split(/\n/m);

  let result = [];
  let currentTagName = '';
  var currentValue;

  for (const line of lines) {
    const startingTagTest = startingTagRegex.test(line);
    const endingTagTest = endingTagRegex.test(line);
    const inlineTest = inlineRegex.test(line);
    if (startingTagTest && !inlineTest && !endingTagTest) {
      //starting tag
      currentTagName = line.match(startingTagRegex)[1];
      currentValue = null;
      switch (currentTagName) {
        case 'RouteFares':
          result = [];
          break;
        case 'RouteFare':
          result.push({});
          break;
        case 'BufferZones':
          if (!result[result.length - 1].hasOwnProperty('BufferZones')) {
            result[result.length - 1]['BufferZones'] = [];
          }
          break;
        case 'BufferZone':
          result[result.length - 1]['BufferZones'].push({});
          break;
        default:
          break;
      }
    }

    if (startingTagTest && inlineTest && !endingTagTest) {
      //inline tag
      currentTagName = line.match(inlineRegex)[1];
      currentValue = line.match(inlineRegex)[2];
      switch (currentTagName) {
        case 'RouteID':
          result[result.length - 1]['RouteID'] = parseInt(line.match(inlineRegex)[2]);
          break;
        case 'OriginStopID':
          result[result.length - 1]['BufferZones'][result[result.length - 1]['BufferZones'].length - 1]['OriginStopID'] = parseInt(currentValue);
          break;
        case 'DestinationStopID':
          result[result.length - 1]['BufferZones'][result[result.length - 1]['BufferZones'].length - 1]['DestinationStopID'] = parseInt(currentValue);
          break;
        case 'Direction':
          result[result.length - 1]['BufferZones'][result[result.length - 1]['BufferZones'].length - 1]['Direction'] = parseInt(currentValue);
          break;

        default:
          break;
      }
    }

    /*
    if (!startingTagTest && !inlineTest && endingTagTest) {
      //ending tag
      currentTagName = line.match(endingTagRegex)[1];
      currentValue = null
    }
    */
  }

  return result;
}
