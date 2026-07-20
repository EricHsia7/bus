export class BitState {
  state: Uint8Array;
  bit: Int32Array;
  length: number;

  constructor(length: number) {
    this.state = new Uint8Array(length);
    this.bit = new Int32Array(length + 1);
    this.length = length;
  }

  resize(length: number): void {
    if (length === this.length) return;

    // Preserve overlapping state; new cells default to 0, extra cells are dropped.
    const newState = new Uint8Array(length);
    newState.set(this.state.subarray(0, Math.min(length, this.length)));

    this.state = newState;
    this.bit = new Int32Array(length + 1);
    this.length = length;

    // O(n) Fenwick build from state.
    for (let i = 1; i <= length; i++) {
      this.bit[i] += this.state[i - 1];
      const parent = i + (i & -i);
      if (parent <= length) {
        this.bit[parent] += this.bit[i];
      }
    }
  }

  set(index: number, value: number): void {
    const difference = value - this.state[index];
    this.state[index] = value;
    this.add(index, difference);
  }

  add(index: number, difference: number): void {
    if (index < 0) {
      index += this.length + 1;
    }
    if (index < 1) {
      return;
    }
    for (let i = index; i <= this.length; i += i & -i) {
      this.bit[i] += difference;
    }
  }

  sum(index: number): number {
    if (index < 1) return 0;
    let total = 0;
    for (let i = index; i > 0; i -= i & -i) {
      total += this.bit[i];
    }
    return total;
  }

  clear(): void {
    this.state.fill(0);
    this.bit.fill(0);
  }
}
