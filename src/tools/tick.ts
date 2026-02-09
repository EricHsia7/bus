export class Tick {
  pivot: number;
  interval: number;
  lastTickCount: number;
  isRunning: boolean;
  isPaused: boolean;
  isAutoPaused: boolean;
  timerId: number | null;
  callback: Function;

  constructor(callback: () => Promise<number>, interval: number): void {
    this.pivot = new Date().getTime();
    this.interval = interval;
    this.lastTickCount = -1;
    this.isRunning = false;
    this.isPaused = false;
    this.isAutoPaused = false;
    this.timerId = null;
    this.callback = callback;

    // Bind the handler so 'this' refers to the class instance
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);

    // Automatically attach listener if in a browser environment
    if ('document' in self) {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  async tick() {
    // prevent running if paused or already running
    if (this.isPaused || this.isAutoPaused || this.isRunning) return;

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

    // Re-check stop conditions before scheduling next
    if (this.isPaused || this.isAutoPaused) return;

    const t1 = new Date().getTime();

    // Pivot Shift (Dynamic Interval)
    if (typeof newInterval === 'number' && newInterval > 0 && newInterval !== this.interval) {
      this.interval = newInterval;
      this.pivot = t1;
      this.lastTickCount = 0;
    }

    this.scheduleNext();
  }

  scheduleNext(): void {
    // Clean up any existing timer just in case
    if (this.timerId) clearTimeout(this.timerId);

    // Calculate time to next beat on the grid
    const nextTickIndex = this.lastTickCount + 1;
    const targetTime = this.pivot + nextTickIndex * this.interval;
    const delay = targetTime - new Date().getTime();

    this.timerId = setTimeout(() => this.tick(), Math.max(0, delay));
  }

  handleVisibilityChange(): void {
    if (document.hidden) {
      if (!this.isPaused) {
        this.isAutoPaused = true;
        if (this.timerId) clearTimeout(this.timerId);
      }
    } else if (this.isAutoPaused) {
      this.isAutoPaused = false;
      if (!this.isRunning) this.scheduleNext();
    }
  }

  pause(): void {
    if (this.isPaused) return;
    this.isPaused = true;
    // Stop waiting for the next tick immediately
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    // If the async callback is currently running (isRunning === true), it will finish naturally, but the "if (this.isPaused) return" check inside tick() will prevent it from scheduling the next one.
  }

  resume(runImmediately: boolean = false): void {
    if (!this.isPaused) return;
    this.isPaused = false;

    // Only restart if the tab is actually visible.
    // clear 'isPaused' but leave '_autoPaused' logic to handle it when tab opens.
    if ('document' in self && document.hidden) {
      this.isAutoPaused = true;
    } else if (!this.isRunning) {
      if (runImmediately) {
        this.pivot = new Date().getTime();
        this.lastTickCount = -1;
      }
      this.scheduleNext();
    }
  }

  destroy(): void {
    this.pause();
    if ('document' in self) {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }
}
