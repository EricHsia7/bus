import { formatTime } from '../../tools/format-time.ts';

var settings = {
  time_formatting_mode: {
    name: '預估時間格式',
    default_value: 0,
    value: 0,
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
    default_value: 1,
    value: 1,
    type: 'switch',
    options: [true, false]
  },
  refresh_interval: {
    name: '預估時間更新頻率',
    default_value: 0,
    value: 0,
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

