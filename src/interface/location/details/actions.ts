import { getLocation, MergedLocation, MergedLocationItem } from '../../../data/apis/getLocation/index';
import { deleteDataReceivingProgress, deleteDataUpdateTime } from '../../../data/apis/loader';
import { generateIdentifier } from '../../../tools/index';
import { getPermalink } from '../../../tools/permalink';
import { promptMessage } from '../../prompt/index';
import { openQRCode } from '../../qrcode/index';

export async function shareLocationPermalink(hash: string) {
  const requestID = generateIdentifier();
  const Location = (await getLocation(requestID, 1)) as MergedLocation;
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  const thisLocationKey = `ml_${hash}`;
  if (Location.hasOwnProperty(thisLocationKey)) {
    const thisLocation = Location[thisLocationKey] as MergedLocationItem;
    const link = getPermalink(1, {
      hash: hash
    });
    if (navigator.share) {
      navigator
        .share({
          title: thisLocation.n,
          url: link
        })
        .then(() => {
          promptMessage('已分享地點連結', 'link');
        })
        .catch((e) => {
          promptMessage('已取消分享連結', 'cancel');
          console.error(e);
        });
    }
  }
}

export async function showLocationPermalinkQRCode(hash: string) {
  const requestID = generateIdentifier();
  const Location = (await getLocation(requestID, 1)) as MergedLocation;
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  const thisLocationKey = `ml_${hash}`;
  if (Location.hasOwnProperty(thisLocationKey)) {
    const link = getPermalink(1, {
      hash: hash
    });
    openQRCode(link);
  }
}
