import { BusArrivalTimeRecord, BusArrivalTimeStats, BusArrivalTimeStatsGroup, BusArrivalTimeWorkerMessageDoneInitialize, BusArrivalTimeWorkerMessageDoneRecord, BusArrivalTimeWorkerMessageError, BusArrivalTimeWorkerRequest, BusArrivalTimeWorkerRequestInitialize } from '.';
import { findGlobalExtrema } from '../../../tools/math';
import { WeeklyArray } from '../../../tools/time';
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
      break;
    case 'checkout':
      break;
  }
};

let memoryCache_personalSchedules: PersonalScheduleArray = [];
let memoryCache_tracking: Array<number> = [];
let memoryCache_existing = new Map<BusArrivalTimeStatsGroup['id'], BusArrivalTimeStatsGroup>();

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
  }

  self.postMessage({ id, type: 'done', job: 'record' } as BusArrivalTimeWorkerMessageDoneRecord);
}
