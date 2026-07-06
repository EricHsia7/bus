import { MaterialSymbol } from '../../interface/icons/material-symbols-type';
import { shareLocationPermalink, showLocationPermalinkQRCode } from '../../interface/location-details/index';
import { openSaveToFolder } from '../../interface/save-to-folder/index';
import { hasOwnProperty } from '../../tools/index';
import { Progress, ProgressCallback } from '../../tools/progress';
import { getLocation, MergedLocation } from '../apis/getLocation/index';

export interface IntegratedLocationDetailsAction {
  icon: MaterialSymbol;
  action: Function;
  key: string;
  name: string;
}

export type IntegratedLocationDetailsActionArray = Array<IntegratedLocationDetailsAction>;

export interface IntegratedLocationDetails {
  actions: IntegratedLocationDetailsActionArray;
  actionsQuantity: number;
  hash: string;
}

export async function integrateLocationDetails(hash: string, progressCallback: ProgressCallback): Promise<IntegratedLocationDetails> {
  const progress = new Progress(1, progressCallback);
  const Location = (await getLocation(progress, 1)) as MergedLocation;
  const thisLocationKey = `ml_${hash}`;
  if (!hasOwnProperty(Location, thisLocationKey)) {
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
        openSaveToFolder('location', [hash], null);
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
  progress.terminate();
  return result;
}
