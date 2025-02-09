import { lfGetItem, lfSetItem } from '../storage/index';

interface CompatibilityTag {
  timestamp: string; // timestamp in ISO format (the date after which changes will take effect)
  script: Function | null;
}

const compatibilityTags: Array<CompatibilityTag> = [
  {
    timestamp: '2025-02-08T00:00:00.000Z',
    script: null
  },
  // TODO: migrate default folders
];

const compatibilityTagQuantity = compatibilityTags.length;

export async function checkCompatibility(): Promise<boolean> {
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
        const thisCompatibilityTagTimestamp = thisCompatibilityTag.timestamp;
        const thisCompatibilityTagTime = new Date(thisCompatibilityTagTimestamp).getTime();
        const thisCompatibilityTagScript = thisCompatibilityTag.script;
        if (thisCompatibilityTagTime > nowTime) {
          break;
        }
        if (typeof thisCompatibilityTagScript === 'function') {
          if (thisCompatibilityTagScript.constructor.name === 'AsyncFunction') {
            await thisCompatibilityTagScript();
          } else {
            thisCompatibilityTagScript();
          }
        }
      }
    }
    await lfSetItem(1, timestamp_key, now.toISOString());
    return true;
  } else {
    await lfSetItem(1, timestamp_key, now.toISOString());
    return true;
  }
}
