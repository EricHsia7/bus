/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;
// export {}; // make a script a module if no any export or import

import { fetchInflate } from '../../data/apis/loader';
import { latToMercY, lngToMercX } from '../../tools/camera';
import { LabelStyle, PackedLabelTile } from './labels';
import { TileKey } from './tiles';

export type WorkerRequest = { type: 'raster'; id: number; key: TileKey; url: string } | { type: 'labels'; id: number; key: TileKey; url: string; z: number; x: number; y: number } | { type: 'abort'; id: number };

export type WorkerResponse =
  | { type: 'raster'; id: number; key: TileKey; bitmap: ImageBitmap }
  | { type: 'labels'; id: number; key: TileKey; tile: PackedLabelTile }
  | {
      type: 'error';
      id: number;
      key: TileKey;
      message: string;
      status: number;
      aborted: boolean;
    };

const controllers = new Map<number, AbortController>();
const decoder = new TextDecoder();
const encoder = new TextEncoder();

self.onmessage = (event: MessageEvent) => {
  const message = event.data as WorkerRequest;
  if (message.type === 'abort') {
    controllers.get(message.id)?.abort();
    controllers.delete(message.id);
    return;
  }
  void handleRequest(message);
};

async function handleRequest(message: Exclude<WorkerRequest, { type: 'abort' }>): Promise<void> {
  const abortController = new AbortController();
  controllers.set(message.id, abortController);
  try {
    if (message.type === 'raster') {
      const response = await fetch(message.url, {
        signal: abortController.signal,
        credentials: 'same-origin'
      });
      if (!response.ok) {
        self.postMessage({
          type: 'error',
          id: message.id,
          key: message.key,
          status: response.status,
          message: `HTTP ${response.status}`
        });
        return;
      }
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);
      self.postMessage({ type: 'raster', id: message.id, key: message.key, bitmap }, [bitmap]);
      return;
    } else {
      const data = await fetchInflate(message.url, function () {});
      const tile = packLabelTile(JSON.parse(decoder.decode(data)), message.key, message.z, message.x, message.y);
      self.postMessage({ type: 'labels', id: message.id, key: message.key, tile }, [tile.anchors.buffer, tile.priority.buffer, tile.styleIdx.buffer, tile.angles.buffer, tile.textStart.buffer, tile.text.buffer]);
    }
  } catch (error) {
    const aborted = (error as Error)?.name === 'AbortError';
    self.postMessage({
      type: 'error',
      id: message.id,
      key: message.key,
      aborted,
      message: aborted ? 'aborted' : String((error as Error)?.message ?? error)
    });
  } finally {
    controllers.delete(message.id);
  }
}

type AnyRecord = Record<string, unknown>;

/** parse an unknown value into a finite number, or undefined */
const toNumber = (value: unknown): number | undefined => {
  if (value == null || value === '') return undefined;
  const parsed = typeof value === 'number' ? value : parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : undefined;
};

/** split a Mapnik-style font-face name into a CSS weight/style prefix + family list */
function parseFace(face: unknown): { prefix: string; family: string } {
  const raw = Array.isArray(face) ? String(face[0] ?? '') : String(face ?? '');
  let weight = 400;
  let italic = false;
  let name = raw;
  const take = (pattern: RegExp, apply: () => void) => {
    if (pattern.test(name)) {
      name = name.replace(pattern, ' ');
      apply();
    }
  };
  take(/\b(italic|oblique)\b/i, () => (italic = true));
  take(/\bblack|heavy\b/i, () => (weight = 900));
  take(/\bextra[- ]?bold\b/i, () => (weight = 800));
  take(/\bbold\b/i, () => (weight = 700));
  take(/\bsemi[- ]?bold\b/i, () => (weight = 600));
  take(/\bmedium\b/i, () => (weight = 500));
  take(/\b(regular|book|normal)\b/i, () => (weight = 400));
  take(/\blight\b/i, () => (weight = 300));
  name = name.replace(/\s+/g, ' ').trim();
  const family = [name && `"${name}"`, '"Noto Sans TC"', '"Noto Sans"', 'system-ui', 'sans-serif'].filter(Boolean).join(', ');
  return { prefix: `${italic ? 'italic ' : ''}${weight}`, family };
}

/** turn a raw feature's properties into a render-ready LabelStyle */
function parseStyleFromProps(props: AnyRecord): LabelStyle {
  const { prefix, family } = parseFace(props['text-face-name']);
  return {
    fontPrefix: prefix,
    fontFamily: family,
    size: toNumber(props['text-size']) ?? 12,
    fill: String(props['text-fill'] ?? '#333333'),
    haloFill: props['text-halo-fill'] ? String(props['text-halo-fill']) : null,
    haloRadius: toNumber(props['text-halo-radius']) ?? 0,
    placement: String(props['text-placement'] ?? 'point') === 'line' ? 'line' : 'point',
    dy: toNumber(props['text-dy']) ?? 0,
    wrapWidth: toNumber(props['text-wrap-width']) ?? 0,
    letterSpacing: toNumber(props['text-character-spacing']) ?? 0
  };
}

/** apply a CSS-style text-transform to a label string */
function applyTransform(text: string, transform: unknown): string {
  switch (String(transform ?? 'none').toLowerCase()) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'capitalize':
      return text.replace(/(^|\s)(\S)/g, (_, leading, first) => leading + first.toUpperCase());
    default:
      return text;
  }
}

interface Candidate {
  text: string;
  anchor: [number, number];
  /** upright text angle in radians (precomputed server-side; 0 for point/area labels) */
  angle: number;
  priority: number;
  styleKey: string;
  style: LabelStyle;
}

/** pull the label array out of whatever container shape the backend wrote */
function extractItemList(json: unknown): {
  items: AnyRecord[];
  extent: number | undefined;
} {
  if (Array.isArray(json)) return { items: json as AnyRecord[], extent: undefined };
  const container = (json ?? {}) as AnyRecord;
  const extent = toNumber(container.extent);
  const items = (container.features ?? container.labels ?? container.data ?? []) as AnyRecord[];
  return { items: Array.isArray(items) ? items : [], extent };
}

/** ring area (shoelace) used to pick the biggest polygon ring */
function computeRingArea(ring: number[][]): number {
  let area = 0;
  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index++) {
    area += ring[previous][0] * ring[index][1] - ring[index][0] * ring[previous][1];
  }
  return Math.abs(area / 2);
}

function computeRingCentroid(ring: number[][]): [number, number] {
  let x = 0;
  let y = 0;
  for (const point of ring) {
    x += point[0];
    y += point[1];
  }
  return [x / ring.length, y / ring.length];
}

function packLabelTile(json: unknown, key: string, z: number, x: number, y: number): PackedLabelTile {
  const { items, extent } = extractItemList(json);
  const scale = Math.pow(2, z);

  // tile-local pixel coords -> mercator units (only used when `extent` is present)
  const localToMerc = (localX: number, localY: number, tileExtent: number): [number, number] => [(x + localX / tileExtent) / scale, (y + localY / tileExtent) / scale];
  const toMerc = (position: number[], tileExtent: number | undefined): [number, number] => (tileExtent ? localToMerc(position[0], position[1], tileExtent) : [lngToMercX(position[0]), latToMercY(position[1])]);

  const candidates: Candidate[] = [];
  const styles: LabelStyle[] = [];
  const styleIndex = new Map<string, number>();

  for (const item of items) {
    const props = (item.properties ?? item) as AnyRecord;
    const kind = props.kind == null ? 'text' : String(props.kind);
    // markers/points/circles are ignored for now; shields keep their own text
    if (kind !== 'text' && kind !== 'shield') continue;

    const rawText = props.label ?? props.text ?? props.name;
    if (rawText == null || String(rawText).trim() === '') continue;
    const text = applyTransform(String(rawText), props['text-transform']);

    const itemExtent = toNumber(item.extent) ?? extent;
    const geometry = (item.geometry ?? item) as AnyRecord;
    const geometryType = String(geometry.type ?? (geometry.coordinates ? 'Point' : ''));
    const coordinates = geometry.coordinates as unknown;

    // Anchor + angle are precomputed server-side (see plot.js plotLineLabel):
    // every label geometry is a single Point, and line labels carry their
    // upright text angle in `properties.angle`. Point/area labels are drawn
    // horizontally (angle 0). The Polygon/MultiPolygon/flat fallbacks below
    // just keep the client resilient to hand-authored or legacy tiles.
    let anchor: [number, number] | null = null;

    if (geometryType === 'Point' && Array.isArray(coordinates)) {
      anchor = toMerc(coordinates as number[], itemExtent);
    } else if (geometryType === 'MultiPoint' && Array.isArray(coordinates)) {
      anchor = toMerc((coordinates as number[][])[0], itemExtent);
    } else if (geometryType === 'Polygon' && Array.isArray(coordinates)) {
      anchor = toMerc(computeRingCentroid((coordinates as number[][][])[0] ?? []), itemExtent);
    } else if (geometryType === 'MultiPolygon' && Array.isArray(coordinates)) {
      const rings = (coordinates as number[][][][]).map((polygon) => polygon[0] ?? []);
      rings.sort((first, second) => computeRingArea(second) - computeRingArea(first));
      if (rings[0]?.length) anchor = toMerc(computeRingCentroid(rings[0]), itemExtent);
    } else {
      // flat records: {lng,lat} / {lon,lat} / {x,y}
      const lng = toNumber(item.lng ?? item.lon ?? item.longitude ?? item.x);
      const lat = toNumber(item.lat ?? item.latitude ?? item.y);
      if (lng !== undefined && lat !== undefined) anchor = toMerc([lng, lat], itemExtent);
    }

    if (!anchor || !Number.isFinite(anchor[0]) || !Number.isFinite(anchor[1])) continue;

    // upright text angle, baked in by the renderer (radians)
    const angle = toNumber(props.angle) ?? 0;

    const style = parseStyleFromProps(props);
    const styleKey = JSON.stringify(style);
    if (!styleIndex.has(styleKey)) {
      styleIndex.set(styleKey, styles.length);
      styles.push(style);
    }

    // lower = placed first. explicit rank wins, then bigger text.
    const rank = toNumber(props.rank) ?? toNumber(props.priority) ?? toNumber(props.zIndex) ?? 0;
    candidates.push({
      text,
      anchor,
      angle,
      priority: rank * 1000 - style.size,
      styleKey,
      style
    });
  }

  // pre-sort by priority so the main thread can place in a single pass
  candidates.sort((first, second) => first.priority - second.priority);

  const count = candidates.length;
  const anchors = new Float64Array(count * 2);
  const priority = new Float32Array(count);
  const styleIdx = new Uint16Array(count);
  const angles = new Float32Array(count);
  const textStart = new Uint32Array(count + 1);

  const textChunks: Uint8Array[] = [];
  let textBytes = 0;

  for (let index = 0; index < count; index++) {
    const candidate = candidates[index];
    anchors[index * 2] = candidate.anchor[0];
    anchors[index * 2 + 1] = candidate.anchor[1];
    priority[index] = candidate.priority;
    styleIdx[index] = styleIndex.get(candidate.styleKey) ?? 0;
    angles[index] = candidate.angle;

    const bytes = encoder.encode(candidate.text);
    textStart[index] = textBytes;
    textBytes += bytes.length;
    textChunks.push(bytes);
  }
  textStart[count] = textBytes;

  const text = new Uint8Array(textBytes);
  for (let index = 0; index < count; index++) text.set(textChunks[index], textStart[index]);

  return {
    key,
    z,
    x,
    y,
    count,
    anchors,
    priority,
    styleIdx,
    angles,
    textStart,
    text,
    styles
  };
}
