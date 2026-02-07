import { getCarInfo } from '../../data/apis/getCarInfo/index';
import { getLocation } from '../../data/apis/getLocation/index';
import { getMaterialSymbolsSearchIndex } from '../../data/apis/getMaterialSymbolsSearchIndex/index';
import { getRoute } from '../../data/apis/getRoute/index';
import { DataReceivingProgressEvent, deleteDataReceivingProgress, deleteDataUpdateTime, getDataReceivingProgress, setDataReceivingProgress } from '../../data/apis/loader';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';

const dataDownloadRequestID = 'downloadData';
export let dataDownloadCompleted = false;

const HomeField = documentQuerySelector('.css_home_field');
const HomeHeadElement = elementQuerySelector(HomeField, '.css_home_head');
const homeButtonRightElement = elementQuerySelector(HomeHeadElement, '.css_home_button_right');
const progressElement = elementQuerySelector(homeButtonRightElement, 'svg#download-svg path[progress="progress"]');

function handleDataReceivingProgressUpdates(event: Event): void {
  const CustomEvent = event as DataReceivingProgressEvent;
  const pixels = (1 - getDataReceivingProgress(dataDownloadRequestID)) * 189;
  progressElement.style.setProperty('--b-cssvar-stroke-dashoffset', `${pixels}px`);
  if (CustomEvent.detail.stage === 'end') {
    document.removeEventListener(CustomEvent.detail.target, handleDataReceivingProgressUpdates);
    progressElement.addEventListener(
      'transitionend',
      function () {
        homeButtonRightElement.setAttribute('complete', 'true');
      },
      { once: true }
    );
    progressElement.style.setProperty('--b-cssvar-stroke-dashoffset', `${0}px`);
    dataDownloadCompleted = true;
  }
}

export async function downloadData() {
  setDataReceivingProgress(dataDownloadRequestID, 'getRoute_0', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getRoute_1', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getLocation_0', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getLocation_1', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getCarInfo_0', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getCarInfo_1', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getMaterialSymbolsSearchIndex', 0, false);
  document.addEventListener(dataDownloadRequestID, handleDataReceivingProgressUpdates);
  await Promise.all([getRoute(dataDownloadRequestID, true), getLocation(dataDownloadRequestID, 1), getCarInfo(dataDownloadRequestID, true), getMaterialSymbolsSearchIndex(dataDownloadRequestID)]);
  deleteDataReceivingProgress(dataDownloadRequestID);
  deleteDataUpdateTime(dataDownloadRequestID);
}

export function showHome(): void {
  HomeField.setAttribute('displayed', 'true');
}

export function hideHome(): void {
  HomeField.setAttribute('displayed', 'false');
}
