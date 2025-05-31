import { MaterialSymbols } from '../../interface/icons/material-symbols-type';
import { shareLocationPermalink, showLocationPermalinkQRCode } from '../../interface/location/details/index';
import { openSaveToFolder } from '../../interface/save-to-folder/index';
import { generateIdentifier } from '../../tools/index';
import { getLocation, MergedLocation, MergedLocationItem } from '../apis/getLocation/index';
import { deleteDataReceivingProgress, deleteDataUpdateTime } from '../apis/loader';

export interface IntegratedLocationDetailsAction {
  icon: MaterialSymbols;
  action: Function;
  name: string;
}

export type IntegratedLocationDetailsActionArray = Array<IntegratedLocationDetailsAction>;

export interface IntegratedLocationDetails {
  actions: IntegratedLocationDetailsActionArray;
  hash: string;
}

async function integrateLocationDetails(hash: string): Promise<IntegratedLocationDetails> {
  const requestID = generateIdentifier();
  const Location = (await getLocation(requestID, 1)) as MergedLocation;
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  const thisLocationKey = `ml_${hash}`;
  let thisLocation = {} as MergedLocationItem;
  if (Location.hasOwnProperty(thisLocationKey)) {
    thisLocation = Location[thisLocationKey];
  } else {
    return;
  }
  const actions: IntegratedLocationDetailsActionArray = [
    {
      icon: 'folder',
      name: '儲存',
      action: function () {
        openSaveToFolder('location', [hash]);
      }
    },
    {
      icon: 'link',
      name: '連結',
      action: function () {
        shareLocationPermalink(hash);
      }
    },
    {
      icon: 'qr_code_2',
      name: '二維條碼',
      action: function () {
        showLocationPermalinkQRCode(hash);
      }
    }
  ];
  const result: IntegratedLocationDetails = {
    actions: actions,
    hash: hash
  };
  return result;
}
