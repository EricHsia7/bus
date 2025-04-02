import { getRoute } from '../../data/apis/getRoute/index';
import { getLocation } from '../../data/apis/getLocation/index';
import { setDataReceivingProgress, getDataReceivingProgress, deleteDataReceivingProgress, deleteDataUpdateTime, DataReceivingProgressEvent } from '../../data/apis/loader';
import { documentQuerySelector } from '../../tools/query-selector';
import { getMaterialSymbols } from '../../data/apis/getMaterialSymbols/index';
import { getCarInfo } from '../../data/apis/getCarInfo/index';

const dataDownloadRequestID = 'downloadData';
export let dataDownloadCompleted = false;
const progressElement: HTMLElement = documentQuerySelector('.css_home_button_right svg#download-svg path[progress="progress"]');

function handleDataReceivingProgressUpdates(event: Event): void {
  const CustomEvent = event as DataReceivingProgressEvent;
  const pixels = (1 - getDataReceivingProgress(dataDownloadRequestID)) * 189;
  progressElement.style.setProperty('--b-cssvar-stroke-dashoffset', `${pixels}px`);
  if (CustomEvent.detail.stage === 'end') {
    document.removeEventListener(CustomEvent.detail.target, handleDataReceivingProgressUpdates);
    progressElement.style.setProperty('--b-cssvar-stroke-dashoffset', `${0}px`);
    documentQuerySelector('.css_home_button_right').setAttribute('complete', 'true');
    dataDownloadCompleted = true;
  }
}

export async function downloadData() {
  /*
  setDataReceivingProgress(dataDownloadRequestID, 'getRoute_0', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getRoute_1', 0, false);
  */
  // eliminate duplicate downloads in integrateFolders
  setDataReceivingProgress(dataDownloadRequestID, 'getLocation_0', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getLocation_1', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getCarInfo_0', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getCarInfo_1', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getMaterialSymbols', 0, false);
  document.addEventListener(dataDownloadRequestID, handleDataReceivingProgressUpdates);
  await getRoute(dataDownloadRequestID, true);
  await getLocation(dataDownloadRequestID, 1);
  await getCarInfo(dataDownloadRequestID, true);
  await getMaterialSymbols(dataDownloadRequestID);
  deleteDataReceivingProgress(dataDownloadRequestID);
  deleteDataUpdateTime(dataDownloadRequestID);
}
