import { nearestPowerOf2 } from '../../../tools/index';
import { findExtremum } from '../../../tools/math';
import { formatNumberWithSuffix } from '../../../tools/text';
import { assignTracks } from '../../../tools/time';
import { PersonalSchedule, PersonalScheduleArray } from '../../personal-schedule/index';
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
const fontSize: string = '15px';
const fontWeight: string = '400';
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
  /*
  const currentSheetQuantity = sheets.length;
  const capacity = currentSheetQuantity - sheetQuantity;
  if (capacity > 0) {
    sheets.splice(sheetQuantity - 1, capacity);
  } else {
    for (let i = Math.abs(capacity); i > 0; i--) {
      sheets.push(createSheet(roundedChartWidth, roundedChartHeight * chartQuantityPerSheet));
    }
  }
*/

  const oneDayInMinutes = 60 * 24;

  const busArrivalTimesLength = busArrivalTimes.length;
  let extremumsArray = new Uint32Array(busArrivalTimesLength * 2);
  for (let i = 0; i < busArrivalTimesLength; i++) {
    const busArrivalTime = busArrivalTimes[i];
    extremumsArray[i * 2] = busArrivalTime.min;
    extremumsArray[i * 2 + 1] = busArrivalTime.max;
  }
  const extremums = findExtremum(extremumsArray);
  const labels: Array<string> = [];
  const widths: Array<number> = [];
  const labelQuantity = 4;
  const interval = (extremums[1] - extremums[0]) / labelQuantity;
  let maxLabelWidth = 0;
  for (let i = 0; i < labelQuantity; i++) {
    const label = formatNumberWithSuffix(extremums[0] + interval * i);
    const width = currentSheet.ctx.measureText(label);
    labels.push(label);
    widths.push(width);
    if (width > maxLabelWidth) {
      maxLabelWidth = width;
    }
  }

  let personalScheduleTracks: Array<Array<PersonalSchedule>> = [];
  for (const personalSchedule of personalSchedules) {
    let assigned: boolean = false;
    const personalScheduleTracksLength = personalScheduleTracks.length;
    if (personalScheduleTracksLength > 0) {
      const lastTrackIndex = personalScheduleTracksLength - 1;
      const lastTrack = personalScheduleTracks[lastTrackIndex];
      const lastTrackLength = lastTrack.length;
      if (lastTrackLength > 0) {
        const lastPersonalScheduleIndex = lastTrackLength - 1;
        const lastPersonalSchedule = lastTrack[lastPersonalScheduleIndex];
        if (personalSchedule.period.start.hours * 60 + personalSchedule.period.start.minutes >= lastPersonalSchedule.period.end.hours * 60 + lastPersonalSchedule.period.end.minutes) {
          personalScheduleTracks[lastTrackIndex].push(personalSchedule);
          assigned = true;
        }
      }
    }
    if (!assigned) {
      personalScheduleTracks.push([[personalSchedule]]);
    }
  }
  const personalScheduleTracksLength = personalScheduleTracks.length;
  const personalScheduleTrackHeight = 30;
  const personalScheduleTracksHeight = personalScheduleTracksLength * personalScheduleTrackHeight;
  const personalScheduleTrackPadding = 2;
  const personalSchedulePadding = 2;

  const graphAreaWidth = chartWidth - maxLabelWidth;
  const graphAreaHeight = chartHeight - personalScheduleTracksHeight;

  const barWidth = graphAreaWidth / oneDayInMinutes;

  sheets.push(createSheet(roundedChartWidth, roundedChartHeight * chartQuantityPerSheet));
  let currentSheet = sheets[sheets.length - 1];
  let currentChartCount = 0;

  // --- Draw chart background ---
  // Initialize styles
  currentSheet.ctx.fillStyle = '#888888';
  currentSheet.ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
  currentSheet.ctx.textBaseline = 'top';

  // Draw labels and gridlines
  const upperGridlineY = 0;
  const lowerGridlineY = graphAreaHeight;
  const distanceBetweenIntervals = Math.abs(lowerGridlineY - upperGridlineY) / labelQuantity;
  const gridlineThickness = 2;
  for (let j = 0; j < labelQuantity; j++) {
    const label = labels[j];
    const width = widths[j];
    currentSheet.ctx.fillText(label, maxLabelWidth - width);
    currentSheet.ctx.fillRect(maxLabelWidth, upperGridlineY + distanceBetweenIntervals * j, graphAreaWidth, gridlineThickness);
  }

  // Draw personal schedules
  for (let k = 0; k < personalScheduleTracksLength; k++) {
    const personalScheduleTrack = personalScheduleTracks[k];
    for (const personalSchedule of personalScheduleTrack) {
      const startTime = personalSchedule.period.start.hours * 60 + personalSchedule.period.start.minutes;
      const endTime = personalSchedule.period.end.hours * 60 + personalSchedule.period.end.minutes;
      const personalScheduleX = maxLabelWidth + graphAreaWidth * (startTime / oneDayInMinutes);
      const personalScheduleY = graphAreaHeight + personalScheduleTrackHeight * k + personalScheduleTrackPadding;
      const personalScheduleWidth = graphAreaWidth * (endTime / oneDayInMinutes);
      const personalScheduleHeight = personalScheduleTrackHeight - personalScheduleTrackPadding * 2;
      currentSheet.ctx.fillRect(personalScheduleX, personalScheduleY, personalScheduleWidth, personalScheduleHeight);
      currentSheet.ctx.fillText(personalSchedule.name, personalScheduleX + personalSchedulePadding, personalScheduleY + personalSchedulePadding, personalScheduleWidth - personalSchedulePadding * 2);
    }
  }
  currentChartCount += 1;

  // Draw bars

  for (const busArrivalTime of busArrivalTimes) {
    if (currentChartCount >= chartQuantityPerSheet) {
      sheets.push(createSheet(roundedChartWidth, roundedChartHeight * chartQuantityPerSheet));
      currentSheet = sheets[sheets.length - 1];
      currentChartCount = 0;
    }
    const thisBusArrivalTimeStats = busArrivalTime.stats;
    const offsetY = currentChartCount * chartHeight;
    currentSheet.ctx.beginPath();
    currentSheet.ctx.moveTo(maxLabelWidth, offsetY + graphAreaHeight);
    for (let l = 0; l < oneDayInMinutes; l++) {
      const barX = graphAreaWidth * (l / 2400) + barWidth * l;
      const barY = (1 - thisBusArrivalTimeStats[l] / extremums[1]) * graphAreaHeight;
      currentSheet.ctx.lineTo(barX, barY);
      currentSheet.ctx.lineTo(barX + barWidth, barY);
    }
    currentSheet.ctx.lineTo(chartWidth, offsetY + chartHeight);
    currentSheet.ctx.closePath();
    currentSheet.ctx.fill();
    currentChartCount += 1;
  }

  // Send the result back to the main thread
  port.postMessage([result, taskID]);

  isProcessing = false;
  drawBusArrivalTimeGraphContent_worker(); // Process next task in queue, if any
}
