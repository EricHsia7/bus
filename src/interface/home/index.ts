import { getRoute } from '../../data/apis/getRoute';
import { getStop } from '../../data/apis/getStop';
import { getLocation } from '../../data/apis/getLocation';
import { setDataReceivingProgress, getDataReceivingProgress, deleteDataReceivingProgress } from '../../data/apis/loader';
import { documentQuerySelector } from '../../tools/query-selector';
import { getMaterialSymbols } from '../../data/apis/getMaterialSymbols';

var dataPreloadRequestID = 'preload_data';
export var dataPreloadCompleted = false;
var transitioned = false;
var progressElement: HTMLElement = documentQuerySelector('.css_home_button_right svg#download-svg path[progress="progress"]');

function updateDownloadProgress() {
  var pixels = (1 - getDataReceivingProgress(dataPreloadRequestID)) * 189;
  progressElement.style.setProperty('--b-cssvar-stroke-dashoffset', `${pixels}px`);
  window.requestAnimationFrame(function () {
    if (dataPreloadCompleted === false) {
      updateDownloadProgress();
    }
  });
}

function setCompleteStatus() {
  if (dataPreloadCompleted) {
    progressElement.style.setProperty('--b-cssvar-stroke-dashoffset', `${0}px`);
    documentQuerySelector('.css_home_button_right').setAttribute('complete', true);
    progressElement.removeEventListener('transitioncancel', setCompleteStatus);
  }
}

export async function preloadData(): void {
  setDataReceivingProgress(dataPreloadRequestID, 'getRoute_0', 0, false);
  setDataReceivingProgress(dataPreloadRequestID, 'getRoute_1', 0, false);
  setDataReceivingProgress(dataPreloadRequestID, 'getStop_0', 0, false);
  setDataReceivingProgress(dataPreloadRequestID, 'getStop_1', 0, false);
  setDataReceivingProgress(dataPreloadRequestID, 'getLocation_0', 0, false);
  setDataReceivingProgress(dataPreloadRequestID, 'getLocation_1', 0, false);
  setDataReceivingProgress(dataPreloadRequestID, 'getMaterialSymbols', 0, false);
  updateDownloadProgress();
  progressElement.addEventListener('transitioncancel', setCompleteStatus);
  await getRoute(dataPreloadRequestID, true);
  await getStop(dataPreloadRequestID);
  await getLocation(dataPreloadRequestID, true);
  await getMaterialSymbols(dataPreloadRequestID);
  dataPreloadCompleted = true;
  setCompleteStatus();
  deleteDataReceivingProgress(dataPreloadRequestID);
}
