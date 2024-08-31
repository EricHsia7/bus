import { getRoute } from '../../data/apis/getRoute/index';
import { getStop } from '../../data/apis/getStop/index';
import { getLocation } from '../../data/apis/getLocation/index';
import { setDataReceivingProgress, getDataReceivingProgress, deleteDataReceivingProgress } from '../../data/apis/loader';
import { documentQuerySelector } from '../../tools/query-selector';
import { getMaterialSymbols } from '../../data/apis/getMaterialSymbols/index';

const dataDownloadRequestID = 'downloadData';
export let dataDownloadCompleted = false;
const progressElement: HTMLElement = documentQuerySelector('.css_home_button_right svg#download-svg path[progress="progress"]');

function updateDownloadProgress() {
  var pixels = (1 - getDataReceivingProgress(dataDownloadRequestID)) * 189;
  progressElement.style.setProperty('--b-cssvar-stroke-dashoffset', `${pixels}px`);
  window.requestAnimationFrame(function () {
    if (dataDownloadCompleted === false) {
      updateDownloadProgress();
    }
  });
}

function setCompleteStatus() {
  if (dataDownloadCompleted) {
    progressElement.style.setProperty('--b-cssvar-stroke-dashoffset', `${0}px`);
    documentQuerySelector('.css_home_button_right').setAttribute('complete', true);
    progressElement.removeEventListener('transitioncancel', setCompleteStatus);
  }
}

export async function downloadData(): void {
  setDataReceivingProgress(dataDownloadRequestID, 'getRoute_0', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getRoute_1', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getStop_0', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getStop_1', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getLocation_0', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getLocation_1', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getMaterialSymbols', 0, false);
  updateDownloadProgress();
  progressElement.addEventListener('transitioncancel', setCompleteStatus);
  await getRoute(dataDownloadRequestID, true);
  await getStop(dataDownloadRequestID);
  await getLocation(dataDownloadRequestID, true);
  await getMaterialSymbols(dataDownloadRequestID);
  dataDownloadCompleted = true;
  setCompleteStatus();
  deleteDataReceivingProgress(dataDownloadRequestID);
}
