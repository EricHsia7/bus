import { findExtremum } from '../../../tools/math';
import { Segments, segmentsToPath, simplifyPath } from '../../../tools/path';
import { createDateObjectFromDate } from '../../../tools/time';
import { DataUsagePeriod, DataUsageStats, DataUsageStatsChunkArray } from './index';

interface task {
  dataUsageStatsChunks: DataUsageStatsChunkArray;
  width: number;
  height: number;
  padding: number;
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
      port.postMessage([-1]);
      const [dataUsageStatsChunks, width, height, padding, taskID] = event.data;
      taskQueue.push({ dataUsageStatsChunks, width, height, padding, taskID, port });
      processWorkerTask();
    };
  };
} else {
  const port = self;
  self.onmessage = function (event) {
    port.postMessage([-1]);
    const [dataUsageStatsChunks, width, height, padding, taskID] = event.data;
    taskQueue.push({ dataUsageStatsChunks, width, height, padding, taskID, port });
    processWorkerTask();
  };
}

const minutesPerDay = 60 * 24;

// Main processing function
function processWorkerTask(): void {
  if (isProcessing || taskQueue.length === 0) return;
  isProcessing = true;

  // Dequeue the next task
  const { dataUsageStatsChunks, width, height, padding, taskID, port }: task = taskQueue.shift();

  const dataUsageStatsChunksLength = dataUsageStatsChunks.length;

  let extremum: Array<number> = [];
  let sum: number = 0;
  for (const dataUsageStatsChunk of dataUsageStatsChunks) {
    extremum.push(dataUsageStatsChunk.stats.max);
    extremum.push(dataUsageStatsChunk.stats.min);
    sum += dataUsageStatsChunk.stats.sum;
  }

  const globalExtremum = findExtremum(extremum);
  const max = globalExtremum[1] === 0 ? 1 : globalExtremum[1]; // prevent division by zero
  const min = globalExtremum[0] === 0 ? 1 : globalExtremum[0]; // prevent division by zero

  const start = dataUsageStatsChunks[0].date;
  const end = dataUsageStatsChunks[dataUsageStatsChunksLength - 1].date;
  const startDate = createDateObjectFromDate(start[0], start[1], start[2]);
  const endDate = createDateObjectFromDate(end[0], end[1], end[2]);

  const points: Segments = [];
  for (let i = 0; i < dataUsageStatsChunksLength; i++) {
    const dataUsageStatsChunk = dataUsageStatsChunks[i];
    const data = dataUsageStatsChunk.data;
    for (let j = 0; j < minutesPerDay; j++) {
      const x = padding + (i / DataUsagePeriod + j / minutesPerDay) * width;
      const y = padding + (1 - data[j] / max) * height;
      points.push({ x, y });
    }
  }

  // X-axis (horizontal)
  const xAxis = `<line x1="${padding}" y1="${height + padding}" x2="${padding + width}" y2="${height + padding}" stroke="var(--b-cssvar-333333)" stroke-width="1" />`;

  // Y-axis (vertical)
  const yAxis = `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height + padding}" stroke="var(--b-cssvar-333333)" stroke-width="1" />`;

  // Axis Labels
  const xAxisLabel = `<text x="${padding + width / 2}" y="${padding + height + padding}" text-anchor="middle" font-size="12" fill="var(--b-cssvar-333333)">時間</text>`;
  const yAxisLabel = `<text x="${padding / 2}" y="${padding + height / 2}" text-anchor="middle" font-size="12" fill="var(--b-cssvar-333333)" transform="rotate(-90, ${padding * 0.7}, ${padding + height / 2})">傳輸量</text>`;

  // Paths
  const simplifiedPath = simplifyPath(points, 1.1);
  const pathData = segmentsToPath(simplifiedPath, 1);
  const fillingPathData = `M${padding},${height + padding}${pathData}L${padding + width},${height + padding}L${padding},${height + padding}`;
  const path = `<path d="${pathData}" fill="none" stroke="var(--b-cssvar-main-color)" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round" opacity="1"></path>`;
  const fillingPath = `<path d="${fillingPathData}" stroke="none" stroke-width="0" fill="url(#grad1)"></path>`;
  const filling = `<linearGradient id="grad1" x1="50%" y1="0%" x2="50%" y2="100%"><stop offset="0%" style="stop-color:rgba(var(--b-cssvar-main-color-r), var(--b-cssvar-main-color-g), var(--b-cssvar-main-color-b), 0.3);" /><stop offset="73%" style="stop-color:rgba(var(--b-cssvar-main-color-r), var(--b-cssvar-main-color-g), var(--b-cssvar-main-color-b), 0.09);" /><stop offset="100%" style="stop-color:rgba(var(--b-cssvar-main-color-r), var(--b-cssvar-main-color-g), var(--b-cssvar-main-color-b), 0);" /></linearGradient>`;

  // SVG
  const chart = /*html*/ `<svg xmlns="http://www.w3.org/2000/svg" width="${width + padding * 2}px" height="${height + padding * 2}px" viewBox="0 0 ${width + padding * 2} ${height + padding * 2}"><defs>${filling}</defs>${fillingPath}${path}${xAxis}${yAxis}${xAxisLabel}${yAxisLabel}</svg>`;

  const result: DataUsageStats = {
    stats: {
      max,
      min,
      sum
    },
    period: {
      start: startDate,
      end: endDate
    },
    chart
  };

  // Send the result back to the main thread
  port.postMessage([result, taskID]);

  isProcessing = false;
  processWorkerTask(); // Process next task in the queue if any
}
