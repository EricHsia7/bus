import { listPersonalSchedules } from '../../personal-schedule';
import { BusArrivalTimes, listBusArrivalTimeDataGroups } from './index';

export interface getBusArrivalTimesJob {
  resolve: Function;
  reject: Function;
}

export interface getBusArrivalTimesMessageDone {
  type: 'done';
  id: number;
  result: BusArrivalTimes;
}

export interface getBusArrivalTimesMessageError {
  type: 'error';
  id: number;
  error: Error['message'];
}

export type getBusArrivalTimesMessage = getBusArrivalTimesMessageDone | getBusArrivalTimesMessageError;

const worker = new Worker(new URL('./getBusArrivalTimes-worker.ts', import.meta.url));

let nextId: number = 0;
const pending = new Map<number, getBusArrivalTimesJob>();

worker.onmessage = (event: MessageEvent) => {
  const message = event.data as getBusArrivalTimesMessage;
  const job = pending.get(message.id);
  if (!job) return;

  switch (message.type) {
    case 'done':
      pending.delete(message.id);
      job.resolve(message.result);
      break;
    case 'error':
      pending.delete(message.id);
      job.reject(new Error(message.error));
      break;
  }
};

worker.onerror = (e) => console.error('Worker crashed:', e.message);

export async function getBusArrivalTimes(chartWidth: number, chartHeight: number): Promise<BusArrivalTimes> {
  const personalSchedules = listPersonalSchedules();
  const busArrivalTimeDataGroups = await listBusArrivalTimeDataGroups();
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    worker.postMessage({ id, personalSchedules, busArrivalTimeDataGroups, chartWidth, chartHeight });
  });
}
