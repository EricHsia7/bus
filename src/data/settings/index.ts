import { lfSetItem, lfGetItem, lfListItemKeys, isStoragePersistent } from '../storage/index';
import { dateToRelativeTime, formatTime } from '../../tools/time';
import { getHTMLVersionBranchName, getHTMLVersionHash, getHTMLVersionTimeStamp } from './version';
import { MaterialSymbols } from '../../interface/icons/material-symbols-type';
import { getNotificationClientStatus } from '../notification/index';

type SettingType = 'select' | 'page' | 'info' | 'action';

export interface SettingSelectOptionStringValue {
  type: 0;
  string: string;
}

export interface SettingSelectOptionNumberValue {
  type: 1;
  number: number;
}

export interface SettingSelectOptionBooleanValue {
  type: 2;
  boolean: boolean;
}

export interface SettingSelectOptionRefreshIntervalValue {
  type: 3;
  baseInterval: number;
  dynamic: boolean;
}

export type SettingSelectOptionValue = SettingSelectOptionStringValue | SettingSelectOptionNumberValue | SettingSelectOptionBooleanValue | SettingSelectOptionRefreshIntervalValue;

export interface SettingSelectOption {
  name: string;
  value: SettingSelectOptionValue;
  resourceIntensive: boolean;
  powerSavingAlternative: -1 | number; // index of an option
}

export type SettingSelectOptions = Array<SettingSelectOption>;

export interface SettingSelect {
  key: string;
  name: string;
  icon: MaterialSymbols;
  status: string;
  action: string;
  type: 'select';
  default_option: number;
  option: number;
  options: SettingSelectOptions;
  description: string;
}

export interface SettingPage {
  key: string;
  name: string;
  icon: MaterialSymbols;
  status: string;
  type: 'page';
  action: string;
  description: string;
}

export interface SettingInfo {
  key: string;
  name: string;
  icon: MaterialSymbols;
  status: string;
  type: 'info';
  action: string;
  description: string;
}

export interface SettingAction {
  key: string;
  name: string;
  icon: MaterialSymbols;
  status: string;
  type: 'action';
  action: string;
  description: string;
}

export type Setting = SettingSelect | SettingPage | SettingInfo | SettingAction;

export type SettingsObject = { [key: string]: Setting };

export type SettingsArray = Array<Setting>;

export interface SettingWithOption {
  key: string;
  option: number;
}

export type SettingsWithOptionsArray = Array<SettingWithOption>;

export type ExportedSettings = { [key: string]: number };

const SettingKeys: Array<string> = ['time_formatting_mode', 'refresh_interval', 'display_user_location', 'display_user_orientation', 'location_labels', 'proxy', 'folder', 'personal_schedule', 'notification', 'playing_animation', 'power_saving', 'data_usage', 'storage', 'persistent_storage', 'export', 'import', 'version', 'branch', 'last_update_date', 'github'];

let Settings: SettingsObject = {
  time_formatting_mode: {
    key: 'time_formatting_mode',
    name: '預估時間格式',
    icon: 'glyphs',
    status: '',
    action: `bus.settings.openSettingsOptions('time_formatting_mode')`,
    type: 'select',
    default_option: 0,
    option: 0,
    options: [
      {
        name: `${formatTime(11, 3)}/${formatTime(61, 3)}/${formatTime(60 * 61 + 1, 3)}`,
        value: {
          type: 1,
          number: 3
        },
        resourceIntensive: false,
        powerSavingAlternative: -1
      },
      {
        name: `${formatTime(11, 2)}/${formatTime(61, 2)}/${formatTime(60 * 61 + 1, 2)}`,
        value: {
          type: 1,
          number: 2
        },
        resourceIntensive: false,
        powerSavingAlternative: -1
      },
      {
        name: `${formatTime(11, 1)}/${formatTime(61, 1)}/${formatTime(60 * 61 + 1, 1)}`,
        value: {
          type: 1,
          number: 1
        },
        resourceIntensive: false,
        powerSavingAlternative: -1
      },
      {
        name: `${formatTime(11, 0)}/${formatTime(61, 0)}/${formatTime(60 * 61 + 1, 0)}`,
        value: {
          type: 1,
          number: 0
        },
        resourceIntensive: false,
        powerSavingAlternative: -1
      }
    ],
    description: '在首頁、路線頁面、地點頁面上的預估公車到站時間的顯示格式。'
  },
  refresh_interval: {
    key: 'refresh_interval',
    name: '預估時間更新頻率',
    icon: 'pace',
    status: '',
    action: `bus.settings.openSettingsOptions('refresh_interval')`,
    type: 'select',
    default_option: 0,
    option: 0,
    options: [
      {
        name: '自動',
        value: {
          baseInterval: 15 * 1000,
          dynamic: true,
          type: 3
        },
        resourceIntensive: true,
        powerSavingAlternative: 2
      },
      {
        name: '10秒',
        value: {
          baseInterval: 10 * 1000,
          dynamic: false,
          type: 3
        },
        resourceIntensive: true,
        powerSavingAlternative: 2
      },
      {
        name: '20秒',
        value: {
          baseInterval: 20 * 1000,
          dynamic: false,
          type: 3
        },
        resourceIntensive: true,
        powerSavingAlternative: 3
      },
      {
        name: '30秒',
        value: {
          baseInterval: 30 * 1000,
          dynamic: false,
          type: 3
        },
        resourceIntensive: true,
        powerSavingAlternative: 4
      },
      {
        name: '40秒',
        value: {
          baseInterval: 40 * 1000,
          dynamic: false,
          type: 3
        },
        resourceIntensive: true,
        powerSavingAlternative: 5
      },
      {
        name: '50秒',
        value: {
          baseInterval: 50 * 1000,
          dynamic: false,
          type: 3
        },
        resourceIntensive: true,
        powerSavingAlternative: 6
      },
      {
        name: '60秒',
        value: {
          baseInterval: 60 * 1000,
          dynamic: false,
          type: 3
        },
        resourceIntensive: true,
        powerSavingAlternative: 6
      }
    ],
    description: '在首頁、路線頁面、地點頁面上的預估公車到站時間、公車等即時資料更新的頻率。'
  },
  display_user_location: {
    key: 'display_user_location',
    name: '顯示所在位置',
    icon: 'near_me',
    status: '',
    action: `bus.settings.openSettingsOptions('display_user_location')`,
    type: 'select',
    default_option: 1,
    option: 1,
    options: [
      {
        name: '開啟',
        value: {
          type: 2,
          boolean: true
        },
        resourceIntensive: true,
        powerSavingAlternative: 1
      },
      {
        name: '關閉',
        value: {
          type: 2,
          boolean: false
        },
        resourceIntensive: false,
        powerSavingAlternative: -1
      }
    ],
    description: '是否在路線頁面上標註目前所在位置。若設為開啟，本應用程式將要求位置存取權限。'
  },
  display_user_orientation: {
    key: 'display_user_orientation',
    name: '顯示裝置指向',
    icon: 'explore',
    status: '',
    action: `bus.settings.openSettingsOptions('display_user_orientation')`,
    type: 'select',
    default_option: 1,
    option: 1,
    options: [
      {
        name: '開啟',
        value: {
          type: 2,
          boolean: true
        },
        resourceIntensive: true,
        powerSavingAlternative: 1
      },
      {
        name: '關閉',
        value: {
          type: 2,
          boolean: false
        },
        resourceIntensive: false,
        powerSavingAlternative: -1
      }
    ],
    description: '是否在地點頁面上顯示裝置所指方向。若設為開啟，本應用程式將要求動作與方向存取權限。'
  },
  location_labels: {
    key: 'location_labels',
    name: '站牌位置標籤',
    icon: 'tag',
    status: '',
    action: `bus.settings.openSettingsOptions('location_labels')`,
    type: 'select',
    default_option: 0,
    option: 0,
    options: [
      {
        name: '行徑方向',
        value: {
          type: 0,
          string: 'directions'
        },
        resourceIntensive: false,
        powerSavingAlternative: -1
      },
      {
        name: '地址特徵',
        value: {
          type: 0,
          string: 'address'
        },
        resourceIntensive: false,
        powerSavingAlternative: -1
      },
      {
        name: '英文字母',
        value: {
          type: 0,
          string: 'letters'
        },
        resourceIntensive: false,
        powerSavingAlternative: -1
      }
    ],
    description: '用於區分位於同個地點的不同站牌。行徑方向表示可搭乘路線從本站到下一站的方向（與車流同向）；地址特徵表示不同站牌的地址差異處；英文字母表示按照順序以字母編號。'
  },
  proxy: {
    key: 'proxy',
    name: '網路代理',
    icon: 'router',
    status: '',
    action: `bus.settings.openSettingsOptions('proxy')`,
    type: 'select',
    default_option: 1,
    option: 1,
    options: [
      {
        name: '開啟',
        value: {
          type: 2,
          boolean: true
        },
        resourceIntensive: false,
        powerSavingAlternative: -1
      },
      {
        name: '關閉',
        value: {
          type: 2,
          boolean: false
        },
        resourceIntensive: false,
        powerSavingAlternative: -1
      }
    ],
    description: '使用網路代理來擷取資料。'
  },
  folder: {
    key: 'folder',
    name: '資料夾',
    icon: 'folder',
    status: '',
    type: 'page',
    action: 'bus.folder.openFolderManager()',
    description: ''
  },
  personal_schedule: {
    key: 'personal_schedule',
    name: '個人化行程',
    icon: 'calendar_view_day',
    status: '',
    action: `bus.personalSchedule.openPersonalScheduleManager()`,
    type: 'page',
    description: ''
  },
  notification: {
    key: 'notification',
    name: '通知',
    icon: 'notifications',
    status: '',
    action: `bus.notification.openNotificationScheduleManager()`,
    type: 'page',
    description: ''
  },
  playing_animation: {
    key: 'playing_animation',
    name: '動畫',
    icon: 'animation',
    description: '是否在介面中播放動畫。',
    status: '',
    type: 'select',
    action: `bus.settings.openSettingsOptions('playing_animation')`,
    default_option: 0,
    option: 0,
    options: [
      {
        name: '開啟',
        value: {
          type: 2,
          boolean: true
        },
        resourceIntensive: true,
        powerSavingAlternative: 1
      },
      {
        name: '關閉',
        value: {
          type: 2,
          boolean: false
        },
        resourceIntensive: false,
        powerSavingAlternative: -1
      }
    ]
  },
  power_saving: {
    key: 'power_saving',
    name: '省電模式',
    icon: 'battery_low',
    description: '暫停使用耗電功能來節省電力。',
    status: '',
    type: 'select',
    action: `bus.settings.openSettingsOptions('power_saving')`,
    default_option: 1,
    option: 1,
    options: [
      {
        name: '開啟',
        value: {
          type: 2,
          boolean: true
        },
        resourceIntensive: false,
        powerSavingAlternative: -1
      },
      {
        name: '關閉',
        value: {
          type: 2,
          boolean: false
        },
        resourceIntensive: false,
        powerSavingAlternative: -1
      }
    ]
  },
  data_usage: {
    key: 'data_usage',
    name: '網路使用量',
    icon: 'bigtop_updates',
    status: '',
    type: 'page',
    action: 'bus.dataUsage.openDataUsage()',
    description: ''
  },
  storage: {
    key: 'storage',
    name: '儲存空間',
    icon: 'database',
    status: '',
    type: 'page',
    action: 'bus.storage.openStorage()',
    description: ''
  },
  persistent_storage: {
    key: 'persistent_storage',
    name: '永久儲存',
    icon: 'storage',
    status: '',
    action: `bus.settings.showPromptToAskForPersistentStorage()`,
    type: 'action',
    description: '開啟此選項以避免瀏覽器自動刪除重要資料。'
  },
  export: {
    key: 'export',
    name: '匯出資料',
    icon: 'upload',
    status: '',
    type: 'action',
    action: 'bus.settings.downloadExportFile()',
    description: ''
  },
  import: {
    key: 'import',
    name: '匯入資料',
    icon: 'download',
    status: '',
    type: 'action',
    action: 'bus.settings.openFileToImportData()',
    description: ''
  },
  version: {
    key: 'version',
    name: '版本',
    icon: 'commit',
    status: '',
    type: 'info',
    action: 'bus.settings.viewCommitOfCurrentVersion()',
    description: ''
  },
  branch: {
    key: 'branch',
    name: '分支',
    icon: 'rebase',
    status: '',
    type: 'info',
    action: '',
    description: ''
  },
  last_update_date: {
    key: 'last_update_date',
    name: '更新時間',
    icon: 'update',
    status: '',
    type: 'info',
    action: '',
    description: ''
  },
  github: {
    key: 'github',
    name: 'GitHub',
    icon: 'book_2',
    status: '@EricHsia7/bus',
    type: 'info',
    action: '',
    description: ''
  }
};

export async function initializeSettings(): Promise<boolean> {
  const userSettings = await lfListItemKeys(1);
  for (const key of userSettings) {
    if (SettingKeys.indexOf(key) > -1) {
      const userSetting = await lfGetItem(1, key);
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
  return true;
}

export async function listSettings(): Promise<SettingsArray> {
  let result: SettingsArray = [];
  for (const key in Settings) {
    let item = Settings[key];
    switch (item.type) {
      case 'select':
        item.status = item.options[item.option].name;
        break;
      case 'page':
        switch (key) {
          case 'notification':
            item.status = getNotificationClientStatus() ? '已註冊' : '未註冊';
            break;
          default:
            item.status = '';
            break;
        }
        break;
      case 'action':
        item.status = '';
        if (key === 'persistent_storage') {
          item.status = (await isStoragePersistent()) ? '開啟' : '關閉';
        }
        break;
      case 'info':
        if (key === 'version') {
          item.status = getHTMLVersionHash();
        }
        if (key === 'branch') {
          item.status = getHTMLVersionBranchName();
        }
        if (key === 'last_update_date') {
          const date = new Date(getHTMLVersionTimeStamp());
          item.status = dateToRelativeTime(date);
        }
        break;
      default:
        break;
    }
    result.push(item);
  }
  return result;
}

export function listSettingsWithOptions(): SettingsWithOptionsArray {
  let result: SettingsWithOptionsArray = [];
  for (const key in Settings) {
    if (SettingKeys.indexOf(key) > -1) {
      if (Settings.hasOwnProperty(key)) {
        if (Settings[key].type === 'select') {
          const item: SettingWithOption = {
            key: key,
            option: Settings[key].option
          };
          result.push(item);
        }
      }
    }
  }
  return result;
}

export async function exportSettings(): Promise<ExportedSettings> {
  const result: ExportedSettings = {};
  const userSettings = await lfListItemKeys(1);
  for (const key of userSettings) {
    if (SettingKeys.indexOf(key) < 0) {
      continue;
    }
    if (Settings[key].type !== 'select') {
      continue;
    }
    const userSetting = await lfGetItem(1, key);
    if (userSetting !== null) {
      const userSettingOption = parseInt(userSetting);
      result[key] = userSettingOption;
    } else {
      result[key] = Settings[key].default_option;
    }
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

export function getSetting(key: string): Setting | undefined {
  if (SettingKeys.indexOf(key) > -1) {
    if (Settings.hasOwnProperty(key)) {
      return Settings[key];
    }
  }
}

export function getSettingOptionValue(key: string): SettingSelectOptionStringValue['string'] | SettingSelectOptionNumberValue['number'] | SettingSelectOptionBooleanValue['boolean'] | SettingSelectOptionRefreshIntervalValue {
  if (SettingKeys.indexOf(key) > -1) {
    if (Settings.hasOwnProperty(key)) {
      const powerSavingSetting = Settings['power_saving'] as SettingSelect;
      const powerSavingSettingValue = powerSavingSetting.options[powerSavingSetting.option].value as SettingSelectOptionBooleanValue;
      const powerSavingSettingValueBoolean = powerSavingSettingValue.boolean;
      const thisSetting = Settings[key] as SettingSelect;
      let thisSettingOption = thisSetting.options[thisSetting.option];
      if (powerSavingSettingValueBoolean) {
        if (thisSettingOption.resourceIntensive) {
          thisSettingOption = thisSetting.options[thisSettingOption.powerSavingAlternative];
        }
      }
      const thisSettingValue = thisSettingOption.value;
      switch (thisSettingValue.type) {
        case 0:
          return thisSettingValue.string as string;
          break;
        case 1:
          return thisSettingValue.number as number;
          break;
        case 2:
          return thisSettingValue.boolean as boolean;
          break;
        case 3:
          return thisSettingValue as SettingSelectOptionRefreshIntervalValue;
          break;
        default:
          return '' as string;
          break;
      }
    }
  }
  return '';
}
