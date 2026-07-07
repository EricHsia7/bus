import { BusArrivalTimeRecord, BusArrivalTimes, BusArrivalTimeStats, BusArrivalTimeStatsGroup, BusArrivalTimeWorkerMessageDoneCheckout, BusArrivalTimeWorkerMessageDoneInitialize, BusArrivalTimeWorkerMessageDonePlot, BusArrivalTimeWorkerMessageDoneRecord, BusArrivalTimeWorkerMessageError, BusArrivalTimeWorkerRequest } from '.';
import { hasOwnProperty } from '../../../tools';
import { findGlobalExtrema } from '../../../tools/math';
import { WeekDayIndex, WeeklyArray } from '../../../tools/time';
import { PersonalScheduleArray } from '../../personal-schedule';

self.onmessage = function (event: MessageEvent): void {
  const request = event.data as BusArrivalTimeWorkerRequest;

  switch (request.type) {
    case 'initialize':
      initialize(request.id, request.schedules, request.tracking, request.existing).catch((error: Error) => self.postMessage({ id: request.id, type: 'error', error: error.message } as BusArrivalTimeWorkerMessageError));
      break;
    case 'record':
      record(request.id, request.records).catch((error: Error) => self.postMessage({ id: request.id, type: 'error', error: error.message } as BusArrivalTimeWorkerMessageError));
      break;
    case 'plot':
      plot(request.id, request.width, request.height).catch((error: Error) => self.postMessage({ id: request.id, type: 'error', error: error.message } as BusArrivalTimeWorkerMessageError));
      break;
    case 'checkout':
      checkout(request.id).catch((error: Error) => self.postMessage({ id: request.id, type: 'error', error: error.message } as BusArrivalTimeWorkerMessageError));
      break;
  }
};

let memoryCache_personalSchedules: PersonalScheduleArray = [];
let memoryCache_tracking: Array<number> = [];
let memoryCache_existing = new Map<BusArrivalTimeStatsGroup['id'], BusArrivalTimeStatsGroup>();
let memoryCache_modified = new Map<BusArrivalTimeStatsGroup['id'], boolean>();

async function initialize(id: number, personalSchedules: PersonalScheduleArray, tracking: Array<number>, existing: Array<BusArrivalTimeStatsGroup>) {
  memoryCache_personalSchedules = personalSchedules;
  memoryCache_tracking = tracking;
  for (const item of existing) {
    memoryCache_existing.set(item.id, item);
  }
  self.postMessage({ id, type: 'done', job: 'initialize' } as BusArrivalTimeWorkerMessageDoneInitialize);
}

async function record(id: number, records: Array<BusArrivalTimeRecord>) {
  const recordsLength = records.length;
  for (let i = 0; i < recordsLength; i++) {
    const record = records[i];
    if (record.estimate.length !== record.time.length) continue;

    if (!memoryCache_existing.has(record.id)) {
      memoryCache_existing.set(record.id, {
        stats: new Array(7).fill(new Uint32Array(60 * 24)) as WeeklyArray<BusArrivalTimeStats>,
        min: new Array(7).fill(0) as WeeklyArray<number>,
        max: new Array(7).fill(0) as WeeklyArray<number>,
        id: record.id
      });
    }

    const existingRecord = memoryCache_existing.get(record.id) as BusArrivalTimeStatsGroup;
    const dataLength = record.estimate.length;
    for (let i = dataLength - 1; i >= 0; i--) {
      if (record.estimate[i] > 0) {
        const date = new Date((record.time[i] + record.estimate[i]) * 1000);
        const index = date.getHours() * 60 + date.getMinutes();
        existingRecord.stats[date.getDay()][index] += 1;
      }
    }

    for (let j = 0; j < 7; j++) {
      const extrema = findGlobalExtrema(existingRecord.stats[j]);
      existingRecord.min[j] = extrema[0];
      existingRecord.max[j] = extrema[1];
    }

    memoryCache_existing.set(record.id, existingRecord);
    memoryCache_modified.set(record.id, true);
  }

  self.postMessage({ id, type: 'done', job: 'record' } as BusArrivalTimeWorkerMessageDoneRecord);
}

async function checkout(id: number) {
  const result: Array<BusArrivalTimeStatsGroup> = [];
  const transfer: Array<ArrayBuffer> = [];
  for (const key of memoryCache_modified.keys()) {
    if (memoryCache_existing.has(key)) {
      const group = memoryCache_existing.get(key) as BusArrivalTimeStatsGroup;
      result.push(group);
      for (let i = 0; i < 7; i++) {
        transfer.push(new Uint32Array(group.stats[i]).buffer as ArrayBuffer);
      }
    }
  }

  self.postMessage({ id, type: 'done', job: 'checkout', result: result } as BusArrivalTimeWorkerMessageDoneCheckout, transfer);

  console.log(memoryCache_existing.entries());
}

const fontWeight = 400;
const fontSize = 10;
const fontFamily: string = "'Noto Sans TC', sans-serif";

let canvas;
let ctx;
let supportOffscreenCanvas: boolean = false;
if (typeof OffscreenCanvas !== 'undefined') {
  canvas = new OffscreenCanvas(64, 64);
  ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textBaseline = 'top';
  supportOffscreenCanvas = true;
}

const encoder = new TextEncoder();

async function plot(id: number, width: number, height: number) {
  const result: BusArrivalTimes = {};

  const transfer: Array<ArrayBuffer> = [];

  // For each personalSchedule, build an SVG graph
  for (const personalSchedule of memoryCache_personalSchedules) {
    const startIndex = personalSchedule.period.start.hours * 60 + personalSchedule.period.start.minutes;
    const endIndex = personalSchedule.period.end.hours * 60 + personalSchedule.period.end.minutes;
    const barWidth = width / (endIndex - startIndex);

    for (const BusArrivalTimeStatsGroup of memoryCache_existing.values()) {
      for (let i = 0; i < 7; i++) {
        if (personalSchedule.days.indexOf(i as WeekDayIndex) < 0) continue;

        const statsMax = BusArrivalTimeStatsGroup.max[i];
        const stats = BusArrivalTimeStatsGroup.stats[i].slice(startIndex, endIndex);
        const statsLength = stats.length;

        // Gridline and labels
        let verticalGridlineLabels = '';
        let verticalGridlinePathCommand = '';
        let verticalGridlineInterval = 0; // minutes
        if (statsLength / 30 <= 3) {
          verticalGridlineInterval = 10;
        } else {
          verticalGridlineInterval = 30;
        }
        const verticalGridlineQuantity = Math.floor(statsLength / verticalGridlineInterval);
        const verticalGridlineGap = width / verticalGridlineQuantity;
        for (let i = verticalGridlineQuantity - 1; i >= 0; i--) {
          const x = 0.35 / 2 + i * verticalGridlineGap;
          verticalGridlinePathCommand += ` M${x} 0`;
          verticalGridlinePathCommand += ` L${x} ${height}`;
          // the stroke alignment is "center"
          const labelTime = startIndex + i * verticalGridlineInterval;
          const labelMinutes = labelTime % 60;
          const labelHours = (labelTime - labelMinutes) / 60;
          const label = `${labelHours.toString().padStart(2, '0')}:${labelMinutes.toString().padStart(2, '0')}`;
          let labelWidth = 30;
          let labelHeight = 12;
          if (supportOffscreenCanvas) {
            const textMeasurement = ctx.measureText(label) as TextMetrics;
            labelWidth = textMeasurement.width;
            labelHeight = textMeasurement.actualBoundingBoxDescent;
          }
          const y = (height - labelHeight) / 2;
          verticalGridlineLabels += `<text x="${x + 3}" y="${y}" transform="rotate(-90 ${(x + 3 + x + 3 + labelWidth) / 2} ${(y + y + labelHeight) / 2})" font-weight="${fontWeight}" font-size="${fontSize}" font-family="${fontFamily}" component="label">${label}</text>`;
          // rotate(degree x y) x: absolute x of the origin, y: absolute y of the origin, origin: a point around which an element rotates
        }
        const verticalGridline = `<path d="${verticalGridlinePathCommand}" fill="none" stroke-width="0.35" component="vertical-gridline"/>`;

        // Bottom line
        const bottomLinePathCommand = `M0 ${height - 0.35 / 2} L${width} ${height - 0.35 / 2}`;
        const bottomLine = `<path d="${bottomLinePathCommand}" fill="none" stroke-width="0.35" component="bottom-line"/>`;

        // Bars & Numbers
        const numbers = [];
        const counts = [];
        let lastNumber = -1;
        let numberIndex = -1;

        let barsPathCommand = '';
        barsPathCommand += `M${width} ${height}`;
        if (statsMax !== 0) {
          for (let j = statsLength - 1; j >= 0; j--) {
            const x = ((j + 1) / statsLength) * width; // Shift right for correct alignment
            const y = (1 - stats[j] / statsMax) * height;
            barsPathCommand += ` L${x} ${y}`;
            barsPathCommand += ` L${x - barWidth} ${y}`;
            barsPathCommand += ` L${x - barWidth} ${height}`;

            if (stats[j] !== lastNumber) {
              numbers.push(stats[j]);
              counts.push(0);
              lastNumber = stats[j];
              numberIndex++;
            }
            counts[numberIndex]++;
          }
        }
        barsPathCommand += ' Z';
        const bars = `<path d="${barsPathCommand}" stroke="none" stroke-width="0" component="bars"/>`;

        const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${verticalGridline}${verticalGridlineLabels}${bottomLine}${bars}</svg>`;
        const encodedSvg = encoder.encode(svg);
        transfer.push(encodedSvg.buffer);
        const stopKey = `s_${BusArrivalTimeStatsGroup.id}`;
        if (!hasOwnProperty(result, stopKey)) {
          result[stopKey] = [];
        }
        const state = new Int32Array(2 + numbers.length + 1 + counts.length);
        state[0] = width;
        state[1] = height;
        state.set(numbers, 2);
        state[2 + numbers.length] = -1;
        state.set(counts, 2 + numbers.length + 1);
        result[stopKey].push({
          personalSchedule: personalSchedule,
          chart: encodedSvg,
          state: state,
          day: i as WeekDayIndex
        });
        transfer.push(state.buffer);
      }
    }
  }

  // Send the complete SVG back to the main thread
  self.postMessage({ id, type: 'done', job: 'plot', result } as BusArrivalTimeWorkerMessageDonePlot, transfer);
}
