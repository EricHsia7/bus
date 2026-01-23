import { MaterialSymbols } from '../../interface/icons/material-symbols-type';
import { shareLocationPermalink, showLocationPermalinkQRCode } from '../../interface/location/details/index';
import { openSaveToFolder } from '../../interface/save-to-folder/index';
import { getLocation, MergedLocation, MergedLocationItem } from '../apis/getLocation/index';
import { deleteDataReceivingProgress, deleteDataUpdateTime } from '../apis/loader';

export interface IntegratedLocationDetailsAction {
  icon: MaterialSymbols;
  action: Function;
  key: string,
  name: string;
}

export type IntegratedLocationDetailsActionArray = Array<IntegratedLocationDetailsAction>;

export interface IntegratedLocationDetails {
  actions: IntegratedLocationDetailsActionArray;
  actionsQuantity: number
  hash: string;
}

export async function integrateLocationDetails(hash: string, requestID: string): Promise<IntegratedLocationDetails> {
  const Location = (await getLocation(requestID, 1)) as MergedLocation;
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  const thisLocationKey = `ml_${hash}`;
  let thisLocation = {} as MergedLocationItem;
  if (Location.hasOwnProperty(thisLocationKey)) {
    thisLocation = Location[thisLocationKey];
  } else {
    return {
      actions: [],
      actionsQuantity: 0,
      hash: hash
    };
  }
  const actions: IntegratedLocationDetailsActionArray = [
    {
      icon: 'folder',
      name: '儲存',
      key: 'save-to-folder',
      action: function () {
        openSaveToFolder('location', [hash]);
      }
    },
    {
      icon: 'ios_share',
      name: '分享',
      key: 'permalink',
      action: function () {
        shareLocationPermalink(hash);
      }
    },
    {
      icon: 'qr_code_2',
      name: '二維條碼',
      key: 'permalink-qr-code',
      action: function () {
        showLocationPermalinkQRCode(hash);
      }
    }
  ];
  const result: IntegratedLocationDetails = {
    actions: actions,
    actionsQuantity: actions.length,
    hash: hash
  };
  return result;
}
