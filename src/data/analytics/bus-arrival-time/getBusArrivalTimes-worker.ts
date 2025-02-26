import { PersonalScheduleArray } from '../../personal-schedule/index';
import { BusArrivalTimeDataGroupArray, BusArrivalTimes } from './index';

interface task {
  personalSchedules: PersonalScheduleArray;
  busArrivalTimeDataGroups: BusArrivalTimeDataGroupArray;
  chartWidth: number;
  chartHeight: number;
  taskID: string;
  port: any;
}

let taskQueue: Array<task> = [];
let isProcessing: boolean = false;

// Setup message handling (works for dedicated or shared workers)
if ('onconnect' in self) {
  self.onconnect = function (e) {
    const port = e.ports[0];
    port.onmessage = function (event) {
      const [personalSchedules, busArrivalTimeDataGroups, chartWidth, chartHeight, taskID] = event.data;
      taskQueue.push({ personalSchedules, busArrivalTimeDataGroups, chartWidth, chartHeight, taskID, port });
      processWorkerTask();
    };
  };
} else {
  const port = self;
  self.onmessage = function (event) {
    const [personalSchedules, busArrivalTimeDataGroups, chartWidth, chartHeight, taskID] = event.data;
    taskQueue.push({ personalSchedules, busArrivalTimeDataGroups, chartWidth, chartHeight, taskID, port });
    processWorkerTask();
  };
}

let canvas;
let ctx;
let supportOffscreenCanvas: boolean = false;
if ('OffscreenCanvas' in self) {
  canvas = new OffscreenCanvas();
  ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
  const fontFamily: string = '"Noto Sans TC", sans-serif';
  ctx.font = `400 ${12}px ${fontFamily}`;
  ctx.textBaseline = 'top';
  supportOffscreenCanvas = true;
}

// Main processing function
function processWorkerTask(): void {
  if (isProcessing || taskQueue.length === 0) return;
  isProcessing = true;

  // Dequeue the next task
  const { personalSchedules, busArrivalTimeDataGroups, chartWidth, chartHeight, taskID, port }: task = taskQueue.shift();

  const result: BusArrivalTimes = {};

  // For each personalSchedule, build an SVG graph
  for (const personalSchedule of personalSchedules) {
    const startIndex = personalSchedule.period.start.hours * 60 + personalSchedule.period.start.minutes;
    const endIndex = personalSchedule.period.end.hours * 60 + personalSchedule.period.end.minutes;
    const barWidth = chartWidth / (endIndex - startIndex);
    for (const busArrivalTimeDataGroup of busArrivalTimeDataGroups) {
      if (personalSchedule.days.indexOf(busArrivalTimeDataGroup.day) < 0) {
        continue;
      }
      const statsMax = busArrivalTimeDataGroup.max;
      const statsArray = busArrivalTimeDataGroup.stats.slice(startIndex, endIndex);
      const statsArrayLength = statsArray.length;

      // Gridline and labels
      let verticalGridlineLabels = '';
      let verticalGridlinePathCommand = '';
      let verticalGridlineInterval = 0; // minutes
      if (statsArrayLength / 30 <= 3) {
        verticalGridlineInterval = 10;
      } else {
        verticalGridlineInterval = 30;
      }
      const verticalGridlineQuantity = Math.floor(statsArrayLength / verticalGridlineInterval);
      const verticalGridlineGap = chartWidth / verticalGridlineQuantity;
      for (let i = verticalGridlineQuantity - 1; i >= 0; i--) {
        const x = 0.35 / 2 + i * verticalGridlineGap;
        verticalGridlinePathCommand += ` M${x},0`;
        verticalGridlinePathCommand += ` L${x},${chartHeight}`;
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
        const y = (chartHeight - labelHeight) / 2;
        verticalGridlineLabels += `<text x="${x}" y="${y}" transform="rotate(-90 ${(x + x + labelWidth) / 2} ${(y + y + labelHeight) / 2})">${label}</text>`;
      }
      const verticalGridline = `<path d="${verticalGridlinePathCommand}" fill="none" stroke-width="0.35" component="vertical-gridline"/>`;

      // Bottom line
      const bottomLinePathCommand = `M0,${chartHeight} L${chartWidth},${chartHeight - 0.35 / 2}`;
      const bottomLine = `<path d="${bottomLinePathCommand}" fill="none" stroke-width="0.35" component="bottom-line"/>`;

      // Bars
      let barsPathCommand = '';
      barsPathCommand += `M${chartWidth},${chartHeight}`;
      for (let j = statsArrayLength - 1; j >= 0; j--) {
        let x = ((j + 1) / statsArrayLength) * chartWidth; // Shift right for correct alignment
        let y = (1 - statsArray[j] / statsMax) * chartHeight;
        barsPathCommand += ` L${x},${y}`;
        barsPathCommand += ` L${x - barWidth},${y}`;
        barsPathCommand += ` L${x - barWidth},${chartHeight}`;
      }
      barsPathCommand += ' Z';
      const bars = `<path d="${barsPathCommand}" stroke="none" stroke-width="0" component="bars"/>`;

      const svg = `<svg width="${chartWidth}" height="${chartHeight}" viewBox="0 0 ${chartWidth} ${chartHeight}" xmlns="http://www.w3.org/2000/svg">${verticalGridline}${verticalGridlineLabels}${bottomLine}${bars}</svg>`;
      const stopKey = `s_${busArrivalTimeDataGroup.id}`;
      if (!result.hasOwnProperty(stopKey)) {
        result[stopKey] = [];
      }
      result[stopKey].push({
        personalSchedule: personalSchedule,
        chart: svg,
        day: busArrivalTimeDataGroup.day
      });
    }
  }

  // Send the complete HTML back to the main thread
  port.postMessage([result, taskID]);

  isProcessing = false;
  processWorkerTask(); // Process next task in the queue if any
}
