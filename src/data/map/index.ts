export interface MapLoaderLayerRaster {
  type: 0;
  x: number;
  y: number;
  z: number;
  url: (x: number, y: number, z: number) => string;
}

export interface MapLoaderLayerLabels {
  type: 1;
  x: number;
  y: number;
  z: number;
  url: (x: number, y: number, z: number) => string;
}

export type MapLoaderLayer = MapLoaderLayerRaster | MapLoaderLayerLabels;

/**
 * - 0: pending
 * - 1: loading
 * - 2: loaded
 * - 3: missing
 * - 4: evicted
 */
export type MapLoaderTileState = 0 | 1 | 2 | 3 | 4;

export type MapLoaderLayerArray<T> = [raster: T, labels: T];

export interface MapLoaderTile {
  x: number;
  y: number;
  z: number;
  state: MapLoaderLayerArray<MapLoaderTileState>;
}

export interface MapLoaderResponse extends MapLoaderTile {
  bitmap: ImageBitmap;
}

export interface MapLoaderWorkerMessageData {
  type: 'data';
  response: MapLoaderResponse;
}

export interface MapLoaderWorkerMessageError {
  type: 'error';
  tile: MapLoaderTile;
  error: Error['message'];
}

export type MapLoaderWorkerMessage = MapLoaderWorkerMessageData | MapLoaderWorkerMessageError;

export class MapLoader {
  layers: Array<MapLoaderLayer>;
  layersLength: number;
  tiles: Map<string, MapLoaderTile>;
  cache: Map<string, ImageBitmap>;
  queue: Array<string>;
  worker: Worker;
  batchSize: number;
  callback: (response: MapLoaderResponse) => void;

  constructor(layers: Array<MapLoaderLayer>, batchSize: number, callback: MapLoader['callback']) {
    this.layers = layers;
    this.layersLength = layers.length;
    this.tiles = new Map();
    this.cache = new Map();
    this.queue = [];
    this.worker = new Worker(new URL('./worker.ts', import.meta.url));
    this.batchSize = batchSize;
    this.callback = callback;

    this.worker.onmessage = this.handleWorkerMessage.bind(this);
  }

  getTileKey(x: number, y: number, z: number): string {
    return `${x}.${y}.${z}`;
  }

  enqueue(x: number, y: number, z: number): void {
    const key = this.getTileKey(x, y, z);
    if (this.tiles.has(key)) return;
    this.tiles.set(key, {
      x,
      y,
      z,
      state: [0, 0]
    });
    this.queue.push(key);
  }

  dequeue(x: number, y: number, z: number): void {
    const key = this.getTileKey(x, y, z);
    if (!this.tiles.has(key)) return;
    const index = this.queue.indexOf(key);
    if (index < 0) return;
    const tile = this.tiles.get(key);
    if (tile?.state[0] !== 0 || tile?.state[1] !== 0) return;
    this.queue.splice(index, 1);
    this.tiles.delete(key);
  }

  consume(): void {
    const batch = this.queue.splice(0, this.batchSize);
    const list: Array<MapLoaderTile> = [];
    if (batch.length === 0) return;
    for (let i = 0, l = batch.length; i < l; i++) {
      const tile = this.tiles.get(batch[i]);
      if (tile) {
        tile.state = [1, 1];
        list.push(tile);
      }
    }
    this.worker.postMessage(list);
  }

  handleWorkerMessage(event: MessageEvent): void {
    const message = event.data as MapLoaderWorkerMessage;
    switch (message.type) {
      case 'data': {
        const { x, y, z } = message.response;
        const key = this.getTileKey(x, y, z);
        if (!this.cache.has(key)) this.cache.set(key, message.response.bitmap);
        const tile = this.tiles.get(key);
        if (tile) tile.state = [2, 2];
        this.callback(message.response);
        break;
      }
      case 'error':
        const { x, y, z } = message.tile;
        const key = this.getTileKey(x, y, z);
        const tile = this.tiles.get(key);
        if (tile) tile.state = [3, 3];
        console.log(message.tile, message.error);
        break;
      default:
        break;
    }
  }
}
