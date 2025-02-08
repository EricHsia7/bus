import { lfGetItem, lfSetItem } from '../storage/index';

interface CompatibilityTag {
  timestamp: string; // timestamp in ISO format (the date after which changes will take effect)
  script: Function | null;
}

const compatibilityTags: Array<CompatibilityTag> = [
  {
    timestamp: '2025-02-08T00:00:00.000Z',
    script: null
  }
];

const compatibilityTagQuantity = compatibilityTags.length;

/*
export function getLastCompatibilityTag(): CompatibilityTag {
  return compatibilityTags.at(-1);
}

export function getOldestCompatibilityTag(): CompatibilityTag {
  return compatibilityTags[0];
}
*/

export async function checkCompatibility() {
  const now = new Date();
  const nowTime = now.getTime();
  const key = 'compatibility';
  const timestamp_key = `${key}_timestamp`;
  const currentCompatibilityTimestamp = await lfGetItem(1, timestamp_key);
  if (currentCompatibilityTimestamp) {
    const currentCompatibilityTime = new Date(currentCompatibilityTimestamp).getTime();
    let startIndex = -1;
    for (let i = compatibilityTagQuantity - 1; i >= 0; i--) {
      const thisCompatibilityTag = compatibilityTags[i];
      const thisCompatibilityTime = new Date(thisCompatibilityTag.timestamp).getTime();
      if (currentCompatibilityTime > thisCompatibilityTime) {
        startIndex = i + 1;
        break;
      }
    }
    if (startIndex !== -1) {
      for (let j = startIndex; j < compatibilityTagQuantity; j++) {
        const thisCompatibilityTag = compatibilityTags[j];
        if (typeof thisCompatibilityTag.script === 'function') {
          if (thisCompatibilityTag.script.constructor.name === 'AsyncFunction') {
            await thisCompatibilityTag.script();
          } else {
            thisCompatibilityTag.script();
          }
        }
      }
    }
    await lfSetItem(1, timestamp_key, now.toISOString());
  } else {
    await lfSetItem(1, timestamp_key, now.toISOString());
  }
}
