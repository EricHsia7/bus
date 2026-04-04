export class VisibilityMonitor {
  visibilityState: WeakMap<Element, boolean>;
  observer: IntersectionObserver;

  constructor(options: IntersectionObserverInit = {}) {
    this.visibilityState = new WeakMap();
    this.handleIntersectionObserverCallback = this.handleIntersectionObserverCallback.bind(this);
    this.observer = new IntersectionObserver(this.handleIntersectionObserverCallback, options);
  }

  handleIntersectionObserverCallback(entries: Array<IntersectionObserverEntry>): void {
    for (const entry of entries) {
      this.visibilityState.set(entry.target, entry.isIntersecting);
    }
  }

  // Starts monitoring a list of elements
  add(elements: Array<HTMLElement>): void {
    if (!elements || elements.length === 0) return;

    // NodeList supports .forEach()
    for (const element of elements) {
      // Initialize state to false until the observer fires its first check
      this.visibilityState.set(element, false);
      this.observer.observe(element);
    }
  }

  // Stops monitoring a list of elements
  remove(elements: Array<HTMLElement>): void {
    if (!elements || elements.length === 0) return;

    for (const element of elements) {
      this.observer.unobserve(element);
      // Clean up the state tracking for these elements
      this.visibilityState.delete(element);
    }
  }

  isVisible(element: HTMLElement) {
    return !!this.visibilityState.get(element);
  }

  disconnect() {
    this.observer.disconnect();
  }
}
