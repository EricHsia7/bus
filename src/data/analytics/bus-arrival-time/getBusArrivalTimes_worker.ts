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
async function processWorkerTask(): Promise<void> {
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
      let pathCommand = '';
      pathCommand += `M${chartWidth},${chartHeight}`;
      for (let j = statsArrayLength - 1; j >= 0; j--) {
        let x = ((j + 1) / statsArrayLength) * chartWidth; // Shift right for correct alignment
        let y = (1 - statsArray[j] / statsMax) * chartHeight;
        pathCommand += ` L${x},${y}`;
        pathCommand += ` L${x - barWidth},${y}`;
        pathCommand += ` L${x - barWidth},${chartHeight}`;
      }
      pathCommand += ' Z';
      const svg = `<svg width="${chartWidth}" height="${chartHeight}" viewBox="0 0 ${chartWidth} ${chartHeight}" xmlns="http://www.w3.org/2000/svg"><path d="${pathCommand}" stroke="none" stroke-width="0"/></svg>`;
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
