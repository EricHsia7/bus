import { Page } from '../../interface/index';

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
    keys: ['ctrl', 'N'],
    function: function () {
      console.log(0);
      // next page
    },
    name: 'Next Page',
    page: 'Route'
  },
  {
    keys: ['ctrl', 'P'],
    function: function () {
      console.log(1);
      // previous page
    },
    name: 'Previous Page',
    page: 'Route'
  }
];

export function handleHotKey(event: KeyboardEvent): void {
  const ctrl = event.ctrlKey ? 1 : -1;
  const meta = event.metaKey ? 1 : -1;
  const shift = event.shiftKey ? 1 : -1;
  const eventKey = String(event.key).toUpperCase();
  for (const HotKeyItem of HotKeyList) {
    let meetCriteria = 1;
    const isCtrl = HotKeyItem.keys.indexOf('ctrl') > -1 ? 1 : -1;
    if (ctrl * isCtrl > 0) {
      meetCriteria *= 1;
    } else {
      meetCriteria *= 0;
    }

    const isMeta = HotKeyItem.keys.indexOf('meta') > -1 ? 1 : -1;
    if (meta * isMeta > 0) {
      meetCriteria *= 1;
    } else {
      meetCriteria *= 0;
    }

    const isShift = HotKeyItem.keys.indexOf('shift') > -1 ? 1 : -1;
    if (meta * isShift > 0) {
      meetCriteria *= 1;
    } else {
      meetCriteria *= 0;
    }
    
    for (const key of HotKeyItem.keys) {
      if (['shift', 'ctrl', 'meta'].indexOf(key) < 0) {
        if (eventKey === key) {
          meetCriteria *= 1;
        } else {
          meetCriteria *= 0;
        }
      }
    }
    if (meetCriteria === 1) {
      if (typeof HotKeyItem.function === 'function') {
        HotKeyItem.function();
      }
    }
  }
}
