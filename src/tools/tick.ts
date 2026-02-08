export class Tick {
  pivot: number;
  interval: number;
  lastTickCount: number;
  isRunning: boolean;
  isPaused: boolean;
  timerId: number | null;
  callback: Function;

  constructor(callback: Function, interval: number) {
    this.pivot = new Date().getTime();
    this.interval = interval;
    this.lastTickCount = -1;
    this.isRunning = false; // "True" while the callback function is actually executing
    this.isPaused = false; // "True" if the user requested a stop
    this.timerId = null; // To track and clear the waiting timeout
    this.callback = callback;
  }

  async tick() {
    // prevent running if paused or already running
    if (this.isPaused || this.isRunning) return;

    const t0 = new Date().getTime();
    const tickCount0 = Math.floor((t0 - this.pivot) / this.interval);

    // If we woke up too early, retry shortly
    if (tickCount0 <= this.lastTickCount) {
      this.timerId = setTimeout(() => this.tick(), 10);
      return;
    }

    this.isRunning = true;
    this.lastTickCount = tickCount0;

    // Execution
    // check isPaused again after the await, in case pause() was called while the callback was running.
    let newInterval;
    try {
      newInterval = await this.callback();
    } catch (err) {
      console.error('Tick callback failed');
    }

    this.isRunning = false;

    // If paused during execution, stop here (do not schedule next)
    if (this.isPaused) return;

    const t1 = new Date().getTime();

    // Shift Pivot (Dynamic Interval Logic)
    if (typeof newInterval === 'number' && newInterval > 0 && newInterval !== this.interval) {
      this.interval = newInterval;
      this.pivot = t1;
      this.lastTickCount = 0;
    }

    // Schedule Next Tick
    this.scheduleNext();
  }

  scheduleNext() {
    // Clean up any existing timer just in case
    if (this.timerId) clearTimeout(this.timerId);

    // Calculate time to next beat on the grid
    const nextTickIndex = this.lastTickCount + 1;
    const targetTime = this.pivot + nextTickIndex * this.interval;
    const delay = targetTime - new Date().getTime();

    this.timerId = setTimeout(() => this.tick(), Math.max(0, delay));
  }

  pause() {
    if (this.isPaused) return;
    this.isPaused = true;

    // Stop waiting for the next tick immediately
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    // If the async callback is currently running (isRunning === true), it will finish naturally, but the "if (this.isPaused) return" check inside tick() will prevent it from scheduling the next one.
  }

  resume() {
    if (!this.isPaused) return;
    this.isPaused = false;

    if (!this.isRunning) {
      this.pivot = new Date().getTime();
      this.lastTickCount = -1;
      this.tick();
    }
  }
}
