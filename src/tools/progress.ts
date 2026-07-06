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

  /**
   * Track the progress of sources
   * @param count the number of listened sources in expectation
   * @param callback function to receive ProgressMessage
   */
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

  /**
   * listen to a source
   * @returns source identifier
   */
  listen(): number {
    const id = this.nextId++;
    this.sources.set(id, [0, 0]);
    return id;
  }

  /**
   * update the progress of a source
   * @param id source identifier
   * @param loaded index or quantity representing current progress
   * @param total index or quantity representing the end of the process
   * @example
   * update(sourceId, receivedByteLength, totalByteLength)
   */
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

  /**
   * record timestamp of sources; most recent one takes precedence
   * @param value timestamp
   * @param timeZoneOffset time zone offset in minutes
   */
  timestamp(value: string | number, timeZoneOffset: number): void {
    let timeNumber = 0;
    if (typeof value === 'string') {
      timeNumber = timestampToNumber(value, timeZoneOffset);
    }
    if (timeNumber > this.time) {
      this.time = timeNumber;
    }
  }

  /**
   * get the most recent timestamp in milliseconds
   * @returns timestamp
   */
  getTime(): number {
    return this.time;
  }

  /**
   * send the 'end' message
   */
  terminate(): void {
    this.callback({
      type: 'end',
      percent: 1
    });
  }

  /**
   * get the average progress of sources
   * @returns percent
   */
  getPercent(): number {
    if (this.count > 0) {
      return this.total / this.count;
    } else {
      return 0;
    }
  }
}
