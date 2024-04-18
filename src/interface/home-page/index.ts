import { getRoute } from '../../data/apis/getRoute.ts';
import { getStop } from '../../data/apis/getStop.ts';
import { getLocation } from '../../data/apis/getLocation.ts';
import { setDataReceivingProgress, getDataReceivingProgress, deleteDataReceivingProgress } from '../../data/apis/loader.ts';

var dataPreloadRequestID = 'preload_data';
var dataPreloadCompleted = false;

function updateDownloadProgress() {
  var pixels = (1 - getDataReceivingProgress(dataPreloadRequestID)) * 189;
  document.querySelector('.home_page_button_right svg#download-svg path[progress="progress"]').style.setProperty('--b-stroke-dashoffset', `${pixels}px`);
  window.requestAnimationFrame(function () {
    if (dataPreloadCompleted === false) {
      updateDownloadProgress();
    }
  });
}

export async function preloadData(): void {
  setDataReceivingProgress(dataPreloadRequestID, 'getRoute_0', 0, false);
  setDataReceivingProgress(dataPreloadRequestID, 'getRoute_1', 0, false);
  setDataReceivingProgress(dataPreloadRequestID, 'getStop_0', 0, false);
  setDataReceivingProgress(dataPreloadRequestID, 'getStop_1', 0, false);
  setDataReceivingProgress(dataPreloadRequestID, 'getLocation_0', 0, false);
  setDataReceivingProgress(dataPreloadRequestID, 'getLocation_1', 0, false);
  updateDownloadProgress();
  await getRoute(dataPreloadRequestID, true);
  await getStop(dataPreloadRequestID);
  await getLocation(dataPreloadRequestID, true);
  dataPreloadCompleted = true;
  document.querySelector('.home_page_button_right').setAttribute('complete', true);
  deleteDataReceivingProgress(dataPreloadRequestID);
}
