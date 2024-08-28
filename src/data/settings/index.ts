import { lfSetItem, lfGetItem, lfListItemKeys } from '../storage/index';
import { formatTime } from '../../tools/format-time';
import { getHTMLVersionBranchName, getHTMLVersionHash } from './version';

const SettingKeys = ['time_formatting_mode', 'refresh_interval', 'display_user_location', 'location_labels'];

var Settings = {
  time_formatting_mode: {
    key: 'time_formatting_mode',
    name: '預估時間格式',
    icon: 'text_fields',
    status: '',
    action: `bus.settingsPage.openSettingsOptionsPage('time_formatting_mode')`,
    type: 'select',
    default_option: 0,
    option: 0,
    options: [
      { name: formatTime(61, 3), value: 3 },
      { name: formatTime(61, 2), value: 2 },
      { name: formatTime(61, 1), value: 1 },
      { name: formatTime(61, 0), value: 0 }
    ]
  },
  refresh_interval: {
    key: 'refresh_interval',
    name: '預估時間更新頻率',
    icon: 'pace',
    status: '',
    action: `bus.settingsPage.openSettingsOptionsPage('refresh_interval')`,
    type: 'select',
    default_option: 0,
    option: 0,
    options: [
      {
        name: '自動',
        value: {
          baseInterval: 15 * 1000,
          dynamic: true
        }
      },
      {
        name: '10秒',
        value: {
          baseInterval: 10 * 1000,
          dynamic: false
        }
      },
      {
        name: '20秒',
        value: {
          baseInterval: 20 * 1000,
          dynamic: false
        }
      },
      {
        name: '30秒',
        value: {
          baseInterval: 30 * 1000,
          dynamic: false
        }
      },
      {
        name: '40秒',
        value: {
          baseInterval: 40 * 1000,
          dynamic: false
        }
      },
      {
        name: '50秒',
        value: {
          baseInterval: 50 * 1000,
          dynamic: false
        }
      },
      {
        name: '60秒',
        value: {
          baseInterval: 60 * 1000,
          dynamic: false
        }
      }
    ]
  },
  display_user_location: {
    key: 'display_user_location',
    name: '顯示所在位置',
    icon: 'near_me',
    status: '',
    action: `bus.settingsPage.openSettingsOptionsPage('display_user_location')`,
    type: 'select',
    default_option: 1,
    option: 1,
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
  location_labels: {
    key: 'location_labels',
    name: '站牌位置標籤',
    icon: 'label',
    status: '',
    action: `bus.settingsPage.openSettingsOptionsPage('location_labels')`,
    type: 'select',
    default_option: 0,
    option: 0,
    options: [
      {
        name: '方位',
        value: 'directions'
      },
      {
        name: '地址特徵',
        value: 'address'
      },
      {
        name: '英文字母',
        value: 'letters'
      }
    ]
  },
  folder: {
    name: '資料夾',
    icon: 'folder',
    status: '',
    type: 'page',
    action: 'bus.folder.openFolderManager()'
  },
  data_usage: {
    key: 'data_usage',
    name: '網路使用量',
    icon: 'data_usage',
    status: '',
    type: 'page',
    action: 'bus.dataUsage.openDataUsagePage()'
  },
  storage: {
    key: 'storage',
    name: '儲存空間',
    icon: 'database',
    status: '',
    type: 'page',
    action: 'bus.storage.openStoragePage()'
  },
  export: {
    key: 'export',
    name: '匯出資料',
    icon: 'upload',
    status: '',
    type: 'action',
    action: 'bus.settingsPage.downloadExportFile()'
  },
  version: {
    key: 'version',
    name: '版本',
    icon: 'info',
    status: '',
    type: 'info',
    action: ''
  },
  github: {
    key: 'github',
    name: 'GitHub',
    icon: 'book_2',
    status: '@EricHsia7/bus',
    type: 'info',
    action: ''
  }
};

export async function initializeSettings(): void {
  var userSettings = await lfListItemKeys(1);
  for (var key of userSettings) {
    if (SettingKeys.indexOf(key) > -1) {
      var userSetting = await lfGetItem(1, key);
      if (!(userSetting === null)) {
        if (Settings[key].type === 'select') {
          var userSettingOption = parseInt(userSetting);
          Settings[key].option = userSettingOption;
        }
      } else {
        if (Settings[key].type === 'select') {
          Settings[key].option = Settings[key].default_option;
        }
      }
    }
  }
}

export function listSettings(): Array {
  var result = [];
  for (var key in Settings) {
    var item = Settings[key];
    switch (item.type) {
      case 'select':
        item.status = item.options[item.option].name;
        break;
      case 'page':
        item.status = '';
        break;
      case 'action':
        item.status = '';
        break;
      case 'info':
        if (key === 'version') {
          item.status = `${getHTMLVersionHash()}@${getHTMLVersionBranchName()}`;
        }
        break;
      default:
        break;
    }
    result.push(item);
  }
  return result;
}

export async function changeSettingOption(key: string, option: number): Promise<boolean> {
  if (SettingKeys.indexOf(key) > -1) {
    if (Settings.hasOwnProperty(key)) {
      if (Settings[key].type === 'select') {
        if (!(Settings[key].options[option] === undefined) && !(Settings[key].options[option] === null)) {
          await lfSetItem(1, key, option);
          Settings[key].option = option;
          return true;
        }
      }
    }
  }
  return false;
}

export function getSetting(key: string): object | void {
  if (SettingKeys.indexOf(key) > -1) {
    if (Settings.hasOwnProperty(key)) {
      return Settings[key];
    }
  }
}

export function getSettingOptionValue(key: string): object | void {
  if (SettingKeys.indexOf(key) > -1) {
    if (Settings.hasOwnProperty(key)) {
      return Settings[key].options[Settings[key].option].value;
    }
  }
}
