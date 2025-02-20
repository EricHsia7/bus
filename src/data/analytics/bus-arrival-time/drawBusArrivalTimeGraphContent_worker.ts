import { nearestPowerOf2 } from '../../../tools/index';
import { findExtremum } from '../../../tools/math';
import { formatNumberWithSuffix } from '../../../tools/text';
import { assignTracks } from '../../../tools/time';
import { PersonalSchedule, PersonalScheduleArray } from '../../personal-schedule/index';
import { BusArrivalTimeDataGroupArray } from './index';

let taskQueue: any[] = [];
let isProcessing: boolean = false;

// Setup message handling (works for dedicated or shared workers)
if ('onconnect' in self) {
  self.onconnect = function (e) {
    const port = e.ports[0];
    port.onmessage = function (event) {
      const [personalSchedules, busArrivalTimes, taskID, chartWidth, chartHeight] = event.data;
      taskQueue.push({ personalSchedules, busArrivalTimes, taskID, chartWidth, chartHeight, port });
      processWorkerTask();
    };
  };
} else {
  const port = self;
  self.onmessage = function (event) {
    const [personalSchedules, busArrivalTimes, taskID, chartWidth, chartHeight] = event.data;
    taskQueue.push({ personalSchedules, busArrivalTimes, taskID, chartWidth, chartHeight, port });
    processWorkerTask();
  };
}

// ─── Canvas helper functions ───
interface Sheet {
  canvas: OffscreenCanvas;
  ctx: OffscreenCanvasRenderingContext2D;
}

function createSheet(width: number, height: number): Sheet {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
  ctx.clearRect(0, 0, width, height);
  return { canvas, ctx };
}

// Font settings
const fontFamily: string = '"Noto Sans TC", sans-serif';
const fontSize: string = '15px';
const fontWeight: string = '400';

// ─── Main processing function ───
async function processWorkerTask(): Promise<void> {
  if (isProcessing || taskQueue.length === 0) return;
  isProcessing = true;

  // Dequeue the next task
  const { personalSchedules, busArrivalTimes, taskID, chartWidth, chartHeight, port }: { personalSchedules: PersonalScheduleArray; busArrivalTimes: BusArrivalTimeDataGroupArray; taskID: string; chartWidth: number; chartHeight: number; port: any } = taskQueue.shift();

  // ─── Draw the common/shared chart background on canvas ────────────
  const backgroundSheet = createSheet(chartWidth, chartHeight);
  const ctx = backgroundSheet.ctx;
  ctx.fillStyle = '#888888';
  ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
  ctx.textBaseline = 'top';

  // Compute extreme values across all datasets
  const totalDatasets = busArrivalTimes.length;
  let extremumsArray = new Uint32Array(totalDatasets * 2);
  for (let i = 0; i < totalDatasets; i++) {
    extremumsArray[i * 2] = busArrivalTimes[i].min;
    extremumsArray[i * 2 + 1] = busArrivalTimes[i].max;
  }
  const extremums = findExtremum(extremumsArray);

  // Prepare labels using the extremum values
  const labelQuantity = 4;
  const interval = (extremums[1] - extremums[0]) / labelQuantity;
  let labels: string[] = [];
  let widths: number[] = [];
  let maxLabelWidth = 0;
  for (let i = 0; i < labelQuantity; i++) {
    const label = formatNumberWithSuffix(extremums[0] + interval * i);
    const width = ctx.measureText(label).width;
    labels.push(label);
    widths.push(width);
    if (width > maxLabelWidth) {
      maxLabelWidth = width;
    }
  }

  // Assign personal schedules to tracks
  let personalScheduleTracks: Array<Array<PersonalSchedule>> = [];
  for (const ps of personalSchedules) {
    let assigned = false;
    if (personalScheduleTracks.length) {
      const lastTrack = personalScheduleTracks[personalScheduleTracks.length - 1];
      if (lastTrack.length > 0) {
        const lastPS = lastTrack[lastTrack.length - 1];
        const lastEnd = lastPS.period.end.hours * 60 + lastPS.period.end.minutes;
        const currStart = ps.period.start.hours * 60 + ps.period.start.minutes;
        if (currStart >= lastEnd) {
          lastTrack.push(ps);
          assigned = true;
        }
      }
    }
    if (!assigned) {
      personalScheduleTracks.push([ps]);
    }
  }
  const personalScheduleTrackHeight = 30;
  const personalScheduleTracksQuantity = personalScheduleTracks.length;
  const personalScheduleTracksHeight = personalScheduleTrackHeight * personalScheduleTracksQuantity;
  const personalScheduleTracksPadding = 2;

  // Define graph area for the grid (leave room for personal schedules)
  const graphAreaWidth = chartWidth - maxLabelWidth;
  const graphAreaHeight = chartHeight - personalScheduleTracksHeight;
  const distanceBetweenIntervals = graphAreaHeight / labelQuantity;

  // Draw gridlines and labels
  for (let j = 0; j < labelQuantity; j++) {
    ctx.fillText(labels[j], maxLabelWidth - widths[j], distanceBetweenIntervals * j);
    ctx.fillRect(maxLabelWidth, distanceBetweenIntervals * j, graphAreaWidth, 2);
  }

  // Draw personal schedules on the bottom part of the background
  for (let k = 0; k < personalScheduleTracksQuantity; k++) {
    const track = personalScheduleTracks[k];
    for (const ps of track) {
      const startTime = ps.period.start.hours * 60 + ps.period.start.minutes;
      const endTime = ps.period.end.hours * 60 + ps.period.end.minutes;
      const x = maxLabelWidth + graphAreaWidth * (startTime / (60 * 24));
      const y = graphAreaHeight + k * personalScheduleTrackHeight + personalScheduleTracksPadding;
      const width = graphAreaWidth * ((endTime - startTime) / (60 * 24));
      const height = personalScheduleTrackHeight - personalScheduleTracksPadding * 2;
      ctx.fillRect(x, y, width, height);
      ctx.fillText(ps.name, x + personalScheduleTracksPadding, y + personalScheduleTracksPadding);
    }
  }

  // Export the background as a Blob and create a Blob URL
  const blob = await backgroundSheet.canvas.convertToBlob();
  const blobUrl = URL.createObjectURL(blob);

  // ─── For each busArrivalTime dataset, build an SVG overlay ───
  const oneDayInMinutes = 60 * 24;
  const result = {};

  for (const busArrivalTime of busArrivalTimes) {
    // Create an SVG that draws the bus arrival bars for this dataset
    let svgBars = `<svg width="${chartWidth}" height="${chartHeight}" xmlns="http://www.w3.org/2000/svg">`;
    let pathD = `M ${maxLabelWidth} ${graphAreaHeight}`;
    for (let l = 0; l < oneDayInMinutes; l++) {
      const barX = maxLabelWidth + (graphAreaWidth / oneDayInMinutes) * l;
      const stat = busArrivalTime.stats[l];
      const barY = (1 - stat / extremums[1]) * graphAreaHeight;
      pathD += ` L ${barX} ${barY}`;
    }
    pathD += ` L ${chartWidth} ${graphAreaHeight} Z`;
    svgBars += `<path d="${pathD}" fill="rgba(136,136,136,0.5)" />`;
    svgBars += `</svg>`;

    // Each chart is a container that layers the common background and its unique SVG overlay.
    const chartHtml = `
      <div style="position: relative; width: ${chartWidth}px; height: ${chartHeight}px; margin-bottom: 10px;">
        <img src="${blobUrl}" style="position: absolute; top: 0; left: 0; z-index: 1; width: ${chartWidth}px; height: ${chartHeight}px;" />
        <div style="position: absolute; top: 0; left: 0; z-index: 2;">
          ${svgBars}
        </div>
      </div>
    `;
    const stopID = busArrivalTime.id;
    const stopKey = `s_${stopID}`;
    result[stopKey] = chartHtml;
  }

  // ─── Send the complete HTML back to the main thread ───
  port.postMessage([result, taskID]);

  isProcessing = false;
  processWorkerTask(); // Process next task in the queue if any
}
