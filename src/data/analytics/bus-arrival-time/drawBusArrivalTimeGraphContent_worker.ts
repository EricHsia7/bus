import { nearestPowerOf2 } from '../../../tools/index';
import { findExtremum } from '../../../tools/math';
import { formatNumberWithSuffix } from '../../../tools/text';
import { PersonalScheduleArray } from '../../personal-schedule/index';
import { BusArrivalTimeDataGroupArray } from './index';

let taskQueue = [];
let isProcessing: boolean = false;

if ('onconnect' in self) {
  self.onconnect = function (e) {
    const port = e.ports[0];
    port.onmessage = function (event) {
      const [personalSchedules, busArrivalTimes, taskID] = event.data;
      taskQueue.push({ personalSchedules, busArrivalTimes, taskID, port });
      drawBusArrivalTimeGraphContent_worker();
    };
  };
} else {
  const port = self;
  self.onmessage = function (event) {
    const [personalSchedules, busArrivalTimes, taskID] = event.data;
    taskQueue.push({ personalSchedules, busArrivalTimes, taskID, port });
    drawBusArrivalTimeGraphContent_worker();
  };
}

interface Sheet {
  canvas: OffscreenCanvas;
  ctx: OffscreenCanvasRenderingContext2D;
}

function createSheet(width: number, height: number): Sheet {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
  ctx.clearRect(0, 0, width, height);
  const sheet: Sheet = {
    canvas,
    ctx
  };
  return sheet;
}

const fontFamily: string = '"Noto Sans TC", sans-serif';
const fontSize: string = '15px'
const fontWeight: string  = '400'
let sheets: Array<Sheet> = [];

function drawBusArrivalTimeGraphContent_worker(chartWidth: number, chartHeight: number): void {
  if (isProcessing || taskQueue.length === 0) return;

  isProcessing = true;
  const { personalSchedules, busArrivalTimes, taskID, port }: { personalSchedules: PersonalScheduleArray; busArrivalTimes: BusArrivalTimeDataGroupArray } = taskQueue.shift();

  let result = {};

  const roundedChartHeight = Math.min(nearestPowerOf2(chartHeight), 512);
  const roundedChartWidth = (chartWidth / chartHeight) * roundedChartHeight;

  // Initialize sheets
  const chartQuantityPerSheet = 2048 / roundedChartHeight;
  const sheetQuantity = Math.ceil(busArrivalTimes.length / chartQuantityPerSheet) + 1; // +1 > background

  const currentSheetQuantity = sheets.length;
  const capacity = currentSheetQuantity - sheetQuantity;
  if (capacity > 0) {
    sheets.splice(sheetQuantity - 1, capacity);
  } else {
    for (let i = Math.abs(capacity); i > 0; i--) {
      sheets.push(createSheet(roundedChartWidth, roundedChartHeight * chartQuantityPerSheet));
    }
  }


  const busArrivalTimesLength = busArrivalTimes.length;
  let extremums = new Uint32Array(busArrivalTimesLength * 2);
  for (let i = 0; i < busArrivalTimesLength; i++) {
    const busArrivalTime = busArrivalTimes[i];
    extremums[i * 2] = busArrivalTime.min;
    extremums[i * 2 + 1] = busArrivalTime.max;
  }
  const extremums = findExtremum(extremums);
  const labels = [];
  const widths = []
  const labelQuantity = 4;
  const interval = (extremums[1] - extremums[0]) / labelQuantity;
  let maxLabelWidth = 0;
  for (let i = 0; i < labelQuantity; i++) {
    const label = formatNumberWithSuffix(extremums[0] + interval * i);
    const width = currentSheet.ctx.measureText(label);
    labels.push(label)
    widths.push(width)
    if(width > maxLabelWidth) {
      maxLabelWidth = width
    }
  }

const personalSchedulesLength


  const currentSheet = sheets[sheets.length - 1];

  // --- Draw chart background ---
  // Initialize styles
  currentSheet.ctx.fillStyle = '#888888';
  currentSheet.ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
currentSheet.ctx.textBaseline = 'top'

  // Draw labels and gridlines


  for(let j = 0 ; j < labelQuantity; j++) {
    const label = labels[j]
    const width = widths[j]
    currentSheet.ctx.fillText(label, maxLabelWidth - width, )
  }

  // Draw personal schedules
  for (const personalSchedule of personalSchedules) {
    const startTime = personalSchedule.period.start.hours * 60 + personalSchedule.period.start.minutes;
    const endTime = personalSchedule.period.end.hours * 60 + personalSchedule.period.end.minutes;
  }

  // Draw gridlines
  const upperGridlineY = 0;
  const lowerGridlineY = currentSheet.ctx;

  // Send the result back to the main thread
  port.postMessage([result, taskID]);

  isProcessing = false;
  drawBusArrivalTimeGraphContent_worker(); // Process next task in queue, if any
}
