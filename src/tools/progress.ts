import { timestampToNumber } from './time';

export interface ProgressMessage {
  type: 'start' | 'run' | 'end';
  percent: number;
}

export type ProgressCallback = (message: ProgressMessage) => void;

export type ProgressSource = [loaded: number, total: number];

export type ProgressSources = Map<number, ProgressSource>;

export class Progress {
  callback: ProgressCallback;
  sources: ProgressSources;
  nextId: number;
  count: number;
  total: number;
  time: number;

  constructor(count: number, callback: ProgressCallback) {
    this.callback = callback;
    this.sources = new Map();
    this.nextId = 0;
    this.count = count;
    this.total = 0;
    this.time = 0;
    this.callback({
      type: 'start',
      percent: 0
    });
  }

  listen(): number {
    const id = this.nextId++;
    this.sources.set(id, [0, 0]);
    return id;
  }

  update(id: number, loaded: number, total: number): void {
    const previous = this.sources.get(id);
    if (previous) {
      this.total += (loaded - previous[0]) / total;
      this.sources.set(id, [loaded, total]);
    } else {
      this.total += loaded / total;
      this.sources.set(id, [loaded, total]);
    }
    this.callback({
      type: 'run',
      percent: this.getPercent()
    });
  }

  timestamp(value: string | number, timeZoneOffset: number): void {
    let timeNumber = 0;
    if (typeof value === 'string') {
      timeNumber = timestampToNumber(value, timeZoneOffset);
    }
    if (timeNumber > this.time) {
      this.time = timeNumber;
    }
  }

  getTime(): number {
    return this.time;
  }

  terminate(): void {
    this.callback({
      type: 'end',
      percent: 1
    });
  }

  getPercent(): number {
    if (this.count > 0) {
      return this.total / this.count;
    } else {
      return 0;
    }
  }
}
