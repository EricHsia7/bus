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

      // Gridline
      let verticalGridlinePathCommand = '';
      let verticalGridlineInterval = 0; // minutes
      if (statsArrayLength / 30 <= 3) {
        verticalGridlineInterval = 10;
      } else {
        verticalGridlineInterval = 30;
      }
      const verticalGridlineQuantity = statsArray / verticalGridlineInterval;
      const verticalGridlineGap = chartWidth / verticalGridlineQuantity;
      for (let i = verticalGridlineQuantity - 1; i >= 0; i--) {
        verticalGridlinePathCommand += ` M${i * verticalGridlineGap},0`;
        verticalGridlinePathCommand += ` M${i * verticalGridlineGap},${chartHeight}`;
      }
      verticalGridlinePathCommand += ' Z';
      const verticalGridline = `<path d="${verticalGridlinePathCommand}" fill="none" stroke-width="0.35" class="css_bus_arrival_time_chart_vertical_gridline"/>`;

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
      const bars = `<path d="${barsPathCommand}" stroke="none" stroke-width="0" class="css_bus_arrival_time_chart_bars"/>`;

      const svg = `<svg width="${chartWidth}" height="${chartHeight}" viewBox="0 0 ${chartWidth} ${chartHeight}" xmlns="http://www.w3.org/2000/svg">${verticalGridline}${bars}</svg>`;
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
