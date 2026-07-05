import { findGlobalExtrema } from '../../../tools/math';
import { Segments, segmentsToPath, simplifyPath } from '../../../tools/path';
import { createDateObjectFromDate } from '../../../tools/time';
import { DataUsagePeriod, DataUsageStats, DataUsageStatsChunkArray } from './index';

self.onmessage = function (e) {
  processWorkerTask(e.data);
};

type data = [dataUsageStatsChunks: DataUsageStatsChunkArray, width: number, height: number, padding: number];

const minutesPerDay = 60 * 24;

// Main processing function
function processWorkerTask(data: data): DataUsageStats {
  const [dataUsageStatsChunks, width, height, padding] = data;

  const dataUsageStatsChunksLength = dataUsageStatsChunks.length;

  const extrema: Array<number> = [];
  let sum: number = 0;
  for (const dataUsageStatsChunk of dataUsageStatsChunks) {
    extrema.push(dataUsageStatsChunk.stats.max, dataUsageStatsChunk.stats.min);
    sum += dataUsageStatsChunk.stats.sum;
  }

  const globalExtrema = findGlobalExtrema(extrema);
  const max = globalExtrema[1];
  const min = globalExtrema[0];

  const start = dataUsageStatsChunks[0].date;
  const end = dataUsageStatsChunks[dataUsageStatsChunksLength - 1].date;
  const startDate = createDateObjectFromDate(start[0], start[1], start[2]);
  const endDate = createDateObjectFromDate(end[0], end[1], end[2]);

  const points: Segments = [];
  let cumulative: number = 0;
  let lastX: number = 0;
  for (let i = 0; i < dataUsageStatsChunksLength; i++) {
    const dataUsageStatsChunk = dataUsageStatsChunks[i];
    if (dataUsageStatsChunk.stats.sum === 0) {
      const x1 = padding + (i / (DataUsagePeriod + 1)) * width;
      const x2 = padding + ((i + (minutesPerDay - 1) / minutesPerDay) / (DataUsagePeriod + 1)) * width;
      const y = padding + height;
      points.push([x1, y]);
      points.push([x2, y]);
      lastX = x2;
      continue;
    }
    const data = dataUsageStatsChunk.data;
    for (let j = 0; j < minutesPerDay; j++) {
      cumulative += data[j];
      const x = padding + ((i + j / minutesPerDay) / (DataUsagePeriod + 1)) * width;
      const y = padding + (1 - cumulative / sum) * height;
      points.push([x, y]);
      lastX = x;
    }
  }

  // X-axis (horizontal)
  const xAxis = `<line x1="${padding}" y1="${height + padding}" x2="${padding + width}" y2="${height + padding}" />`;

  // Y-axis (vertical)
  const yAxis = `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height + padding}" />`;

  // Axis Labels
  const xAxisLabel = `<text x="${padding + width / 2}" y="${padding + height + padding / 2}" text-anchor="middle" dominant-baseline="middle" font-size="12">時間</text>`;
  const yAxisLabel = `<text x="${padding / 2}" y="${padding + height / 2}" text-anchor="middle" dominant-baseline="middle" font-size="12" transform="rotate(-90, ${padding / 2}, ${padding + height / 2})">累計傳輸量</text>`;

  // Paths
  const simplifiedPath = simplifyPath(points, 1.1);
  const pathData = segmentsToPath(simplifiedPath);
  const fillingPathData = `M${padding},${height + padding} ${pathData} L${lastX},${height + padding} L${padding},${height + padding}`;
  const path = `<path d="${pathData}" component="curve"></path>`;
  const fillingPath = `<path d="${fillingPathData}" fill="url(#grad1)" component="fill"></path>`;
  const filling = `<linearGradient id="grad1" x1="50%" y1="0%" x2="50%" y2="100%"><stop offset="0%" /><stop offset="73%" /><stop offset="100%" /></linearGradient>`;

  // SVG
  const svg = /*html*/ `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width + padding * 2} ${height + padding * 2}"><defs>${filling}</defs>${fillingPath}${path}${xAxis}${yAxis}${xAxisLabel}${yAxisLabel}</svg>`;
  const encodedSvg = new TextEncoder().encode(svg);

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
    chart: encodedSvg.buffer
  };

  // Send the result back to the main thread
  self.postMessage(result, [encodedSvg.buffer]);
}
