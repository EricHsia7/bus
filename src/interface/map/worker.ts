/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;
// export {}; // make a script a module if no any export or import

import { fetchInflate } from '../../data/apis/loader';
import { latToMercY, lngToMercX } from './camera';
import { LabelStyle, PackedLabelTile, WorkerRequest } from './types';

const controllers = new Map<number, AbortController>();
const decoder = new TextDecoder();
const encoder = new TextEncoder();

self.onmessage = (event: MessageEvent) => {
  const msg = event.data as WorkerRequest;
  if (msg.type === 'abort') {
    controllers.get(msg.id)?.abort();
    controllers.delete(msg.id);
    return;
  }
  void handle(msg);
};

async function handle(msg: Exclude<WorkerRequest, { type: 'abort' }>): Promise<void> {
  const ac = new AbortController();
  controllers.set(msg.id, ac);
  try {
    if (msg.type === 'raster') {
      const res = await fetch(msg.url, { signal: ac.signal, credentials: 'same-origin' });
      if (!res.ok) {
        self.postMessage({
          type: 'error',
          id: msg.id,
          key: msg.key,
          status: res.status,
          message: `HTTP ${res.status}`
        });
        return;
      }
      const blob = await res.blob();
      const bitmap = await createImageBitmap(blob);
      self.postMessage({ type: 'raster', id: msg.id, key: msg.key, bitmap }, [bitmap]);
      return;
    } else {
      const data = await fetchInflate(msg.url, function () {});
      const tile = pack(JSON.parse(decoder.decode(data)), msg.key, msg.z, msg.x, msg.y);
      self.postMessage({ type: 'labels', id: msg.id, key: msg.key, tile }, [tile.anchors.buffer, tile.priority.buffer, tile.styleIdx.buffer, tile.lineStart.buffer, tile.lines.buffer, tile.textStart.buffer, tile.text.buffer]);
    }
  } catch (err) {
    const aborted = (err as Error)?.name === 'AbortError';
    self.postMessage({
      type: 'error',
      id: msg.id,
      key: msg.key,
      aborted,
      message: aborted ? 'aborted' : String((err as Error)?.message ?? err)
    });
  } finally {
    controllers.delete(msg.id);
  }
}

type AnyRec = Record<string, unknown>;

const num = (v: unknown): number | undefined => {
  if (v == null || v === '') return undefined;
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : undefined;
};

function parseFace(face: unknown): { prefix: string; family: string } {
  const raw = Array.isArray(face) ? String(face[0] ?? '') : String(face ?? '');
  let weight = 400;
  let italic = false;
  let name = raw;
  const take = (re: RegExp, fn: () => void) => {
    if (re.test(name)) {
      name = name.replace(re, ' ');
      fn();
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

function styleFromProps(p: AnyRec): LabelStyle {
  const { prefix, family } = parseFace(p['text-face-name']);
  return {
    fontPrefix: prefix,
    fontFamily: family,
    size: num(p['text-size']) ?? 12,
    fill: String(p['text-fill'] ?? '#333333'),
    haloFill: p['text-halo-fill'] ? String(p['text-halo-fill']) : null,
    haloRadius: num(p['text-halo-radius']) ?? 0,
    placement: String(p['text-placement'] ?? 'point') === 'line' ? 'line' : 'point',
    dy: num(p['text-dy']) ?? 0,
    wrapWidth: num(p['text-wrap-width']) ?? 0,
    letterSpacing: num(p['text-character-spacing']) ?? 0
  };
}

function applyTransform(text: string, transform: unknown): string {
  switch (String(transform ?? 'none').toLowerCase()) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'capitalize':
      return text.replace(/(^|\s)(\S)/g, (_, a, b) => a + b.toUpperCase());
    default:
      return text;
  }
}

interface Candidate {
  text: string;
  anchor: [number, number];
  line: number[];
  priority: number;
  styleKey: string;
  style: LabelStyle;
}

/** pull the label array out of whatever container shape the backend wrote */
function listOf(json: unknown): { items: AnyRec[]; extent: number | undefined } {
  if (Array.isArray(json)) return { items: json as AnyRec[], extent: undefined };
  const o = (json ?? {}) as AnyRec;
  const extent = num(o.extent);
  const items = (o.features ?? o.labels ?? o.data ?? []) as AnyRec[];
  return { items: Array.isArray(items) ? items : [], extent };
}

/** ring area (shoelace) used to pick the biggest polygon ring */
function ringArea(ring: number[][]): number {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  }
  return Math.abs(a / 2);
}

function ringCentroid(ring: number[][]): [number, number] {
  let x = 0;
  let y = 0;
  for (const p of ring) {
    x += p[0];
    y += p[1];
  }
  return [x / ring.length, y / ring.length];
}

function longest(lines: number[][][]): number[][] {
  let best = lines[0] ?? [];
  let bestLen = -1;
  for (const l of lines) {
    let len = 0;
    for (let i = 1; i < l.length; i++) {
      len += Math.hypot(l[i][0] - l[i - 1][0], l[i][1] - l[i - 1][1]);
    }
    if (len > bestLen) {
      bestLen = len;
      best = l;
    }
  }
  return best;
}

function pack(json: unknown, key: string, z: number, x: number, y: number): PackedLabelTile {
  const { items, extent } = listOf(json);
  const scale = Math.pow(2, z);

  // tile-local pixel coords -> mercator units (only used when `extent` is present)
  const localToMerc = (px: number, py: number, ex: number): [number, number] => [(x + px / ex) / scale, (y + py / ex) / scale];
  const toMerc = (pos: number[], ex: number | undefined): [number, number] => (ex ? localToMerc(pos[0], pos[1], ex) : [lngToMercX(pos[0]), latToMercY(pos[1])]);

  const candidates: Candidate[] = [];
  const styles: LabelStyle[] = [];
  const styleIndex = new Map<string, number>();

  for (const item of items) {
    const props = (item.properties ?? item) as AnyRec;
    const kind = props.kind == null ? 'text' : String(props.kind);
    // markers/points/circles are ignored for now; shields keep their own text
    if (kind !== 'text' && kind !== 'shield') continue;

    const rawText = props.label ?? props.text ?? props.name;
    if (rawText == null || String(rawText).trim() === '') continue;
    const text = applyTransform(String(rawText), props['text-transform']);

    const itemExtent = num(item.extent) ?? extent;
    const geom = (item.geometry ?? item) as AnyRec;
    const gtype = String(geom.type ?? (geom.coordinates ? 'Point' : ''));
    const coords = geom.coordinates as unknown;

    let anchor: [number, number] | null = null;
    let line: number[][] | null = null;

    if (gtype === 'Point' && Array.isArray(coords)) {
      anchor = toMerc(coords as number[], itemExtent);
    } else if (gtype === 'MultiPoint' && Array.isArray(coords)) {
      anchor = toMerc((coords as number[][])[0], itemExtent);
    } else if (gtype === 'LineString' && Array.isArray(coords)) {
      line = coords as number[][];
    } else if (gtype === 'MultiLineString' && Array.isArray(coords)) {
      line = longest(coords as number[][][]);
    } else if (gtype === 'Polygon' && Array.isArray(coords)) {
      anchor = toMerc(ringCentroid((coords as number[][][])[0] ?? []), itemExtent);
    } else if (gtype === 'MultiPolygon' && Array.isArray(coords)) {
      const rings = (coords as number[][][][]).map((poly) => poly[0] ?? []);
      rings.sort((a, b) => ringArea(b) - ringArea(a));
      if (rings[0]?.length) anchor = toMerc(ringCentroid(rings[0]), itemExtent);
    } else {
      // flat records: {lng,lat} / {lon,lat} / {x,y}
      const lng = num(item.lng ?? item.lon ?? item.longitude ?? item.x);
      const lat = num(item.lat ?? item.latitude ?? item.y);
      if (lng !== undefined && lat !== undefined) anchor = toMerc([lng, lat], itemExtent);
    }

    let mercLine: number[] = [];
    if (line && line.length >= 2) {
      mercLine = new Array(line.length * 2);
      for (let i = 0; i < line.length; i++) {
        const m = toMerc(line[i], itemExtent);
        mercLine[i * 2] = m[0];
        mercLine[i * 2 + 1] = m[1];
      }
      // anchor = midpoint of the longest segment (render.ts rotates along it)
      let bestLen = -1;
      for (let i = 2; i < mercLine.length; i += 2) {
        const dx = mercLine[i] - mercLine[i - 2];
        const dy = mercLine[i + 1] - mercLine[i - 1];
        const len = dx * dx + dy * dy;
        if (len > bestLen) {
          bestLen = len;
          anchor = [(mercLine[i] + mercLine[i - 2]) / 2, (mercLine[i + 1] + mercLine[i - 1]) / 2];
        }
      }
    }
    if (!anchor || !Number.isFinite(anchor[0]) || !Number.isFinite(anchor[1])) continue;

    const style = styleFromProps(props);
    const styleKey = JSON.stringify(style);
    if (!styleIndex.has(styleKey)) {
      styleIndex.set(styleKey, styles.length);
      styles.push(style);
    }

    // lower = placed first. explicit rank wins, then bigger text.
    const rank = num(props.rank) ?? num(props.priority) ?? num(props.zIndex) ?? 0;
    candidates.push({
      text,
      anchor,
      line: mercLine,
      priority: rank * 1000 - style.size,
      styleKey,
      style
    });
  }

  // pre-sort by priority so the main thread can place in a single pass
  candidates.sort((a, b) => a.priority - b.priority);

  const count = candidates.length;
  const anchors = new Float64Array(count * 2);
  const priority = new Float32Array(count);
  const styleIdx = new Uint16Array(count);
  const lineStart = new Uint32Array(count + 1);
  const textStart = new Uint32Array(count + 1);

  const textChunks: Uint8Array[] = [];
  const lineChunks: number[][] = [];
  let textBytes = 0;
  let linePoints = 0;

  for (let i = 0; i < count; i++) {
    const c = candidates[i];
    anchors[i * 2] = c.anchor[0];
    anchors[i * 2 + 1] = c.anchor[1];
    priority[i] = c.priority;
    styleIdx[i] = styleIndex.get(c.styleKey) ?? 0;

    const bytes = encoder.encode(c.text);
    textStart[i] = textBytes;
    textBytes += bytes.length;
    textChunks.push(bytes);

    lineStart[i] = linePoints;
    if (c.line.length) {
      lineChunks.push(c.line);
      linePoints += c.line.length / 2;
    } else {
      lineChunks.push([]);
    }
  }
  textStart[count] = textBytes;
  lineStart[count] = linePoints;

  const text = new Uint8Array(textBytes);
  for (let i = 0; i < count; i++) text.set(textChunks[i], textStart[i]);

  const lines = new Float64Array(linePoints * 2);
  for (let i = 0; i < count; i++) {
    const chunk = lineChunks[i];
    if (chunk.length) lines.set(chunk, lineStart[i] * 2);
  }

  return {
    key,
    z,
    x,
    y,
    count,
    anchors,
    priority,
    styleIdx,
    lineStart,
    lines,
    textStart,
    text,
    styles
  };
}
