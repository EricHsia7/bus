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
    if (length !== this.length) {
      const newState = new Uint8Array(length);
      newState.set(this.state, 0);
      this.state = newState;

      const newBit = new Int32Array(length + 1);
      newBit.set(this.bit, 0);
      this.bit = newBit;

      this.length = length;
    }
  }

  add(index: number, delta: number): void {
    if (index < 0) {
      index += this.length + 1;
    }
    if (index < 1) {
      return;
    }
    for (let i = index; i < this.length; i += i & -i) {
      this.bit[i] += delta;
    }
  }

  sum(index: number): number {
    if (index < 0) {
      index += this.length + 1;
    }
    if (index < 1) {
      return 0;
    }
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
