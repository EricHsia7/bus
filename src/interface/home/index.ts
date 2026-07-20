import { getCarInfo } from '../../data/apis/getCarInfo/index';
import { getLocation } from '../../data/apis/getLocation/index';
import { getMaterialSymbolsDescription } from '../../data/apis/getMaterialSymbolsDescription/index';
import { getMaterialSymbolsList } from '../../data/apis/getMaterialSymbolsList';
import { getMaterialSymbolsSearchIndex } from '../../data/apis/getMaterialSymbolsSearchIndex/index';
import { getMaterialSymbolsSimilarity } from '../../data/apis/getMaterialSymbolsSimilarity';
import { getRoute } from '../../data/apis/getRoute/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { Progress } from '../../tools/progress';

export let dataDownloadCompleted = false;

const Field = documentQuerySelector('.css_home_field');
const HeadElement = elementQuerySelector(Field, '.css_home_head');
const HeadButtonLeftElement = elementQuerySelector(HeadElement, '.css_home_button_left');
const HeadButtonRightElement = elementQuerySelector(HeadElement, '.css_home_button_right');
const ProgressElement = elementQuerySelector(HeadButtonRightElement, 'svg#download-svg path[component="progress"]');

export async function downloadData() {
  const progress = new Progress(10, function (message) {
    const pixels = (1 - message.percent) * 189;
    ProgressElement.style.setProperty('--b-cssvar-stroke-dashoffset', `${pixels}px`);
    if (message.type === 'end') {
      HeadButtonRightElement.setAttribute('complete', 'true');
      ProgressElement.style.setProperty('--b-cssvar-stroke-dashoffset', `${0}px`);
      dataDownloadCompleted = true;
    }
  });
  // getRoute: 2 + getLocation: 2 + getCarInfo: 2 + getMaterialSymbolsSearchIndex: 1 + getMaterialSymbolsDescription: 1 + getMaterialSymbolsSimilarity: 1 + getMaterialSymbolsList: 1
  await Promise.all([getRoute(progress, true), getLocation(progress, 1), getCarInfo(progress, true)]);
  await Promise.all([getMaterialSymbolsSearchIndex(progress), getMaterialSymbolsDescription(progress), getMaterialSymbolsList(progress), getMaterialSymbolsSimilarity(progress)]);
  progress.terminate();
}

export function showHome(): void {
  Field.setAttribute('displayed', 'true');
}

export function hideHome(): void {
  Field.setAttribute('displayed', 'false');
}
