import { lfSetItem, lfGetItem, lfListItem } from '../storage/index.ts';
import { formatTime } from '../../tools/format-time.ts';

const SettingKeys = ['time_formatting_mode', 'display_current_location', 'refresh_interval'];

var Settings = {
  time_formatting_mode: {
    name: '預估時間格式',
    icon: 'format',
    default_option: 0,
    option: 0,
    type: 'select',
    options: [
      { name: formatTime(61, 3), value: 3 },
      { name: formatTime(61, 2), value: 2 },
      { name: formatTime(61, 1), value: 1 },
      { name: formatTime(61, 0), value: 0 }
    ]
  },
  display_current_location: {
    name: '顯示位置',
    icon: 'location',
    default_option: 1,
    option: 1,
    type: 'switch',
    options: [
      {
        name: '開啟',
        value: true
      },
      {
        name: '關閉',
        value: false
      }
    ]
  },
  refresh_interval: {
    name: '預估時間更新頻率',
    icon: 'frequency',
    default_option: 0,
    option: 0,
    type: 'select',
    options: [
      {
        name: '自動',
        value: {
          defaultInterval: 15 * 1000,
          dynamic: true
        }
      },
      {
        name: '10秒',
        value: {
          defaultInterval: 10 * 1000,
          dynamic: false
        }
      },
      {
        name: '20秒',
        value: {
          defaultInterval: 20 * 1000,
          dynamic: false
        }
      },
      {
        name: '30秒',
        value: {
          defaultInterval: 30 * 1000,
          dynamic: false
        }
      },
      {
        name: '40秒',
        value: {
          defaultInterval: 40 * 1000,
          dynamic: false
        }
      },
      {
        name: '50秒',
        value: {
          defaultInterval: 50 * 1000,
          dynamic: false
        }
      },
      {
        name: '60秒',
        value: {
          defaultInterval: 60 * 1000,
          dynamic: false
        }
      }
    ]
  }
};

export async function initializeSettings() {
  var userSettings = await lfListItem(1);
  for (var key of userSettings) {
    if (SettingKeys.indexOf(key) > -1) {
      var userSetting = await lfGetItem(1, key);
      if (userSetting) {
        var userSettingOption = parseInt(userSetting);
        Settings[key].option = userSettingOption;
      }
    }
  }
}

export function listSettings(): [] {
  var result = [];
  for (var key of Settings) {
    result.push(Settings[key]);
  }
  return result;
}

async function changeSettingOption(key: string, option: number): boolean {
  if (SettingKeys.indexOf(key) > -1) {
    if (Settings.hasOwnProperty(key)) {
      if (!(Settings[key].options[option] === undefined) && !(Settings[key].options[option] === null)) {
        await lfSetItem(1, key, option);
        Settings[key].option = option;
        return true;
      }
    }
  }
  return false;
}

function getSettingOption(key: string): object | void {
  if (SettingKeys.indexOf(key) > -1) {
    if (Settings.hasOwnProperty(key)) {
      var option = Settings['options'][Settings['option']];
      if (!(option === undefined) && !(option === null)) {
        return option;
      }
    }
  }
}
