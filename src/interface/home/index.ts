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
  /*
  setDataReceivingProgress(dataDownloadRequestID, 'getRoute_0', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getRoute_1', 0, false);
  */
  // eliminate duplicate downloads in integrateFolders
  setDataReceivingProgress(dataDownloadRequestID, 'getLocation_0', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getLocation_1', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getCarInfo_0', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getCarInfo_1', 0, false);
  setDataReceivingProgress(dataDownloadRequestID, 'getMaterialSymbolsSearchIndex', 0, false);
  document.addEventListener(dataDownloadRequestID, handleDataReceivingProgressUpdates);
  await getRoute(dataDownloadRequestID, true);
  await getLocation(dataDownloadRequestID, 1);
  await getCarInfo(dataDownloadRequestID, true);
  await getMaterialSymbolsSearchIndex(dataDownloadRequestID);
  deleteDataReceivingProgress(dataDownloadRequestID);
  deleteDataUpdateTime(dataDownloadRequestID);
}

export function showHome(pageTransitionReverse: boolean): void {
  const className = pageTransitionReverse ? 'css_page_transition_slide_in_reverse' : 'css_page_transition_fade_in';
  HomeField.addEventListener(
    'animationend',
    function () {
      HomeField.classList.remove(className);
    },
    { once: true }
  );
  HomeField.classList.add(className);
  HomeField.setAttribute('displayed', 'true');
}

export function hideHome(pageTransitionReverse: boolean): void {
  const className = pageTransitionReverse === 'ltr' ? 'css_page_transition_slide_out_reverse' : 'css_page_transition_fade_out';
  HomeField.addEventListener(
    'animationend',
    function () {
      HomeField.setAttribute('displayed', 'false');
      HomeField.classList.remove(className);
    },
    { once: true }
  );
  HomeField.classList.add(className);
}
