import { Page } from '../../interface/index';
import { switchToNextRouteGroup } from '../../interface/route/index';
import { openSearch } from '../../interface/search/index';

export type HotKey = 'ctrl' | 'meta' | 'shift' | string;

export interface HotKeyItem {
  keys: Array<HotKey>;
  function: Function;
  name: string;
  page: Page;
}

export type HotKeyList = Array<HotKeyItem>;

const HotKeyList: HotKeyList = [
  {
    keys: ['shift', 'N'],
    function: function () {
      switchToNextRouteGroup();
    },
    name: '下一頁',
    page: 'Route'
  },
  {
    keys: ['shift', 'P'],
    function: function () {
      console.log(1);
      // previous page
    },
    name: '上一頁',
    page: 'Route'
  },
  {
    keys: ['shift', 'S'],
    function: function () {
      openSearch();
    },
    name: '搜尋',
    page: 'Home'
  }
];

export function checkHotKey(event: KeyboardEvent, currentPage: Page): void {
  const ctrl = event.ctrlKey ? 1 : -1;
  const meta = event.metaKey ? 1 : -1;
  const shift = event.shiftKey ? 1 : -1;
  const eventKey = String(event.key).toUpperCase();
  for (const HotKeyItem of HotKeyList) {
    let meetCriteria = 1;
    const isCtrl = HotKeyItem.keys.indexOf('ctrl') > -1 ? 1 : -1;
    if (ctrl * isCtrl < 0) {
      meetCriteria *= 0;
    }

    const isMeta = HotKeyItem.keys.indexOf('meta') > -1 ? 1 : -1;
    if (meta * isMeta < 0) {
      meetCriteria *= 0;
    }

    const isShift = HotKeyItem.keys.indexOf('shift') > -1 ? 1 : -1;
    if (shift * isShift < 0) {
      meetCriteria *= 0;
    }

    for (const key of HotKeyItem.keys) {
      if (['shift', 'ctrl', 'meta'].indexOf(key) < 0) {
        if (!(eventKey === key)) {
          meetCriteria *= 0;
        }
      }
    }

    if (!(currentPage === HotKeyItem.page)) {
      meetCriteria *= 0;
    }

    if (meetCriteria === 1) {
      if (typeof HotKeyItem.function === 'function') {
        HotKeyItem.function();
      }
    }
  }
}
