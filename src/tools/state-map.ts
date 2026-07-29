export class StateMap<K extends string, V extends number> {
  states: Map<K, number>;
  base: number;
  size: number;

  constructor(base: number, size: number) {
    this.states = new Map();
    this.base = base;
    this.size = size;
  }

  get(key: K, index: number): V {
    let value = this.states.get(key) || 0;
    for (let i = 0; i < index; i++) {
      value = (value - (value % this.base)) / this.base;
    }
    return (value % this.base) as V;
  }

  list(key: K): Array<V> {
    const result: Array<V> = new Array(this.size).fill(0);
    let value = this.states.get(key) || 0;
    for (let i = 0; i < this.size; i++) {
      result[i] = (value % this.base) as V;
      value = (value - (value % this.base)) / this.base;
      if (value <= 0) break;
    }
    return result;
  }

  set(key: K, index: number, value: V): void {
    if (value < 0 || value >= this.base) return;
    const difference = value - this.get(key, index);
    this.states.set(key, (this.states.get(key) || 0) + difference * Math.pow(this.base, index));
  }

  setAll(key: K, value: V): void {
    this.states.set(key, (value * (1 - Math.pow(this.base, this.size))) / (1 - this.base));
  }

  read(key: K): number {
    return this.states.get(key) || 0;
  }

  write(key: K, value: number): void {
    this.states.set(key, value);
  }

  has(key: K): boolean {
    return this.states.has(key);
  }
}
