/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;
// export {}; // make a script a module if no any export or import

import { Decompress } from 'fflate';
import { MapLoaderTile, MapLoaderWorkerMessageData, MapLoaderWorkerMessageError } from '.';
import { CircleLabelProperties, LabelFeature, LabelFeatureCollection, TextLabelProperties } from './labels';

self.onmessage = function (event: MessageEvent): void {
  const batch = event.data as Array<MapLoaderTile>;
  for (const tile of batch) {
    loadTile(tile).catch((error: Error) => self.postMessage({ type: 'error', error: error.message, tile } as MapLoaderWorkerMessageError));
  }
};

const nativeSize = 1024;
const renderSize = 1024;
/** Font sizes, halo radii, offsets and marker widths in the label data are authored against a 256x256 tile. */
const designSize = 256;
const scale = nativeSize / designSize;
const decoder = new TextDecoder();

const fontWeight = 400;
const fontFamily: string = "'Noto Sans TC', sans-serif";
/** Multiplier applied to the font size to get the baseline-to-baseline distance of wrapped lines. */
const lineHeightRatio = 1.2;
/** Extra breathing room around every label box, in 256-space units. */
const collisionPadding = 3;

interface Box {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/** A label that has been measured but not yet committed to the canvas. */
interface LabelPlan {
  box: Box;
  draw: () => void;
}

async function getRaster(url: string): Promise<ImageBitmap> {
  const response = await fetch(url);
  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);
  return bitmap;
}

async function getLabels(url: string): Promise<LabelFeatureCollection> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  if (!response.body) throw new Error('No response body to stream');

  const inflater = new Decompress();

  let size: number = 0;
  const chunks: Array<Uint8Array> = [];
  inflater.ondata = (chunk, final) => {
    const out = chunk.slice();
    chunks.push(out);
    size += out.length;
  };

  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    inflater.push(value, false); // feed compressed bytes incrementally
  }

  inflater.push(new Uint8Array(0), true); // final = true -> flush the tail

  const buffer = new Uint8Array(size);
  let pos = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, pos);
    pos += chunk.length;
  }
  return JSON.parse(decoder.decode(buffer)) as LabelFeatureCollection;
}

function intersects(a: Box, b: Box): boolean {
  return !(a.maxX <= b.minX || a.minX >= b.maxX || a.maxY <= b.minY || a.minY >= b.maxY);
}

/**
 * Axis-aligned bounds of a box rotated about an anchor. Used so labels placed along a
 * street reserve the space they actually cover. The AABB of a rotated box is a
 * conservative approximation, which errs towards dropping a colliding label.
 */
function rotateBox(box: Box, anchorX: number, anchorY: number, angle: number): Box {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const corners = [
    [box.minX, box.minY],
    [box.maxX, box.minY],
    [box.maxX, box.maxY],
    [box.minX, box.maxY]
  ];

  for (const [cornerX, cornerY] of corners) {
    const localX = cornerX - anchorX;
    const localY = cornerY - anchorY;
    const rotatedX = anchorX + localX * cos - localY * sin;
    const rotatedY = anchorY + localX * sin + localY * cos;
    if (rotatedX < minX) minX = rotatedX;
    if (rotatedX > maxX) maxX = rotatedX;
    if (rotatedY < minY) minY = rotatedY;
    if (rotatedY > maxY) maxY = rotatedY;
  }

  return { minX, minY, maxX, maxY };
}

function padBox(box: Box, padding: number): Box {
  return {
    minX: box.minX - padding,
    minY: box.minY - padding,
    maxX: box.maxX + padding,
    maxY: box.maxY + padding
  };
}

function mergeBoxes(a: Box, b: Box): Box {
  return {
    minX: Math.min(a.minX, b.minX),
    minY: Math.min(a.minY, b.minY),
    maxX: Math.max(a.maxX, b.maxX),
    maxY: Math.max(a.maxY, b.maxY)
  };
}

/**
 * Breaks a label onto multiple lines at `text-wrap-width`. Falls back to per-character
 * breaking for tokens that do not fit, which is what keeps Chinese labels (no spaces)
 * from producing one very long line.
 */
function wrapText(context: OffscreenCanvasRenderingContext2D, text: string, maxWidth: number): Array<string> {
  if (!(maxWidth > 0)) return [text];
  if (context.measureText(text).width <= maxWidth) return [text];

  const lines: Array<string> = [];
  let line = '';

  const pushLine = () => {
    if (line.length > 0) lines.push(line);
    line = '';
  };

  for (const token of text.split(/(\s+)/)) {
    if (token.length === 0) continue;
    if (/^\s+$/.test(token)) {
      if (line.length > 0) line += ' ';
      continue;
    }

    const candidate = line + token;
    if (context.measureText(candidate).width <= maxWidth) {
      line = candidate;
      continue;
    }

    if (context.measureText(token).width <= maxWidth) {
      pushLine();
      line = token;
      continue;
    }

    // Token alone is wider than the wrap width: break it character by character.
    for (const character of Array.from(token)) {
      const characterCandidate = line + character;
      if (line.length > 0 && context.measureText(characterCandidate).width > maxWidth) {
        pushLine();
        line = character;
      } else {
        line = characterCandidate;
      }
    }
  }

  pushLine();
  return lines.length > 0 ? lines : [text];
}

function transformLabel(label: string, transform?: string): string {
  switch (transform) {
    case 'uppercase':
      return label.toUpperCase();
    case 'lowercase':
      return label.toLowerCase();
    default:
      return label;
  }
}

/**
 * Measures a text label and returns its box plus a deferred draw call. Measurement uses
 * the same context and the same font string that the draw call uses, so the reserved box
 * matches the glyphs that land on the tile.
 */
function planText(context: OffscreenCanvasRenderingContext2D, properties: TextLabelProperties, anchorX: number, anchorY: number): LabelPlan | null {
  if (!properties['text-size']) return null;
  if (!properties.label) return null;

  const fontSize = properties['text-size'] * scale;
  const font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  context.font = font;

  const label = transformLabel(properties.label, properties['text-transform']);
  const wrapWidth = properties['text-wrap-width'] ? properties['text-wrap-width'] * scale : 0;
  const lines = wrapText(context, label, wrapWidth);

  const lineHeight = fontSize * lineHeightRatio;
  const haloRadius = properties['text-halo-fill'] && properties['text-halo-radius'] ? properties['text-halo-radius'] * scale : 0;
  const offsetY = anchorY + (properties['text-dy'] ?? 0) * scale;

  let widest = 0;
  let ascent = fontSize * 0.8;
  let descent = fontSize * 0.2;

  for (let i = 0; i < lines.length; i++) {
    const metrics = context.measureText(lines[i]);
    const lineWidth = metrics.actualBoundingBoxLeft !== undefined && metrics.actualBoundingBoxRight !== undefined ? metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight : metrics.width;
    if (lineWidth > widest) widest = lineWidth;
    if (i === 0 && metrics.actualBoundingBoxAscent !== undefined) ascent = metrics.actualBoundingBoxAscent;
    if (i === lines.length - 1 && metrics.actualBoundingBoxDescent !== undefined) descent = metrics.actualBoundingBoxDescent;
  }

  // textBaseline is 'middle', so the block is centred on offsetY.
  const firstLineY = offsetY - ((lines.length - 1) * lineHeight) / 2;
  const lastLineY = offsetY + ((lines.length - 1) * lineHeight) / 2;

  const box: Box = {
    minX: anchorX - widest / 2 - haloRadius,
    maxX: anchorX + widest / 2 + haloRadius,
    minY: firstLineY - ascent - haloRadius,
    maxY: lastLineY + descent + haloRadius
  };

  return {
    box,
    draw: () => {
      context.font = font;

      if (haloRadius > 0 && properties['text-halo-fill']) {
        context.strokeStyle = properties['text-halo-fill'];
        context.lineWidth = haloRadius * 2;
        for (let i = 0; i < lines.length; i++) {
          context.strokeText(lines[i], anchorX, firstLineY + i * lineHeight);
        }
      }

      if (properties['text-fill']) {
        context.fillStyle = properties['text-fill'];
        for (let i = 0; i < lines.length; i++) {
          context.fillText(lines[i], anchorX, firstLineY + i * lineHeight);
        }
      }
    }
  };
}

/**
 * Measures and plans a label whose characters are placed individually along a path.
 * `coordinates` gives each character's anchor and `angles` gives each character's rotation
 * (radians), both paired index-for-index with the (transformed) label string. Mismatched
 * lengths are truncated to the shortest of the three defensively.
 */
function planTextAlongPath(context: OffscreenCanvasRenderingContext2D, properties: TextLabelProperties, coordinates: Array<[number, number]>, angles: Array<number>, extent: number): LabelPlan | null {
  if (!properties['text-size']) return null;
  if (!properties.label) return null;

  const fontSize = properties['text-size'] * scale;
  const font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  context.font = font;

  const label = transformLabel(properties.label, properties['text-transform']);
  const characters = Array.from(label);
  const count = Math.min(characters.length, coordinates.length, angles.length);
  if (count === 0) return null;

  const haloRadius = properties['text-halo-fill'] && properties['text-halo-radius'] ? properties['text-halo-radius'] * scale : 0;

  const placements: Array<{ anchorX: number; anchorY: number; angle: number; character: string }> = [];
  let box: Box | null = null;

  for (let i = 0; i < count; i++) {
    const character = characters[i];
    const [rawX, rawY] = coordinates[i];
    const anchorX = rawX / extent;
    const anchorY = rawY / extent;
    const angle = angles[i] || 0;

    const metrics = context.measureText(character);
    const charWidth = metrics.actualBoundingBoxLeft !== undefined && metrics.actualBoundingBoxRight !== undefined ? metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight : metrics.width;
    const ascent = metrics.actualBoundingBoxAscent !== undefined ? metrics.actualBoundingBoxAscent : fontSize * 0.8;
    const descent = metrics.actualBoundingBoxDescent !== undefined ? metrics.actualBoundingBoxDescent : fontSize * 0.2;

    // textAlign is 'center' and textBaseline is 'middle', so the glyph box is centred on the anchor.
    const characterBox: Box = {
      minX: anchorX - charWidth / 2 - haloRadius,
      maxX: anchorX + charWidth / 2 + haloRadius,
      minY: anchorY - ascent - haloRadius,
      maxY: anchorY + descent + haloRadius
    };

    const rotatedBox = angle ? rotateBox(characterBox, anchorX, anchorY, angle) : characterBox;
    box = box ? mergeBoxes(box, rotatedBox) : rotatedBox;

    placements.push({ anchorX, anchorY, angle, character });
  }

  if (!box) return null;

  return {
    box,
    draw: () => {
      context.font = font;
      for (const placement of placements) {
        context.save();
        context.translate(placement.anchorX, placement.anchorY);
        if (placement.angle) context.rotate(placement.angle);

        if (haloRadius > 0 && properties['text-halo-fill']) {
          context.strokeStyle = properties['text-halo-fill'];
          context.lineWidth = haloRadius * 2;
          context.strokeText(placement.character, 0, 0);
        }

        if (properties['text-fill']) {
          context.fillStyle = properties['text-fill'];
          context.fillText(placement.character, 0, 0);
        }

        context.restore();
      }
    }
  };
}

function planCircle(context: OffscreenCanvasRenderingContext2D, properties: CircleLabelProperties, anchorX: number, anchorY: number): LabelPlan | null {
  if (!properties['marker-width']) return null;
  if (!properties['marker-fill']) return null;

  // marker-width is a diameter in 256-space; the outline straddles the edge.
  const radius = (properties['marker-width'] * scale) / 2;
  const lineWidth = properties['marker-line-color'] ? Math.max(1, scale) : 0;
  const extent = radius + lineWidth / 2;

  const box: Box = {
    minX: anchorX - extent,
    maxX: anchorX + extent,
    minY: anchorY - extent,
    maxY: anchorY + extent
  };

  return {
    box,
    draw: () => {
      context.beginPath();
      context.arc(anchorX, anchorY, radius, 0, Math.PI * 2);
      context.fillStyle = properties['marker-fill'] as string;
      context.fill();
      if (properties['marker-line-color']) {
        context.strokeStyle = properties['marker-line-color'];
        context.lineWidth = lineWidth;
        context.stroke();
      }
    }
  };
}

function planFeature(context: OffscreenCanvasRenderingContext2D, feature: LabelFeature, extent: number): LabelPlan | null {
  if (feature.geometry.type === 'Point') {
    const [rawX, rawY] = feature.geometry.coordinates;
    const anchorX = rawX * (renderSize / extent);
    const anchorY = rawY * (renderSize / extent);
    switch (feature.properties.kind) {
      case 'text':
        return planText(context, feature.properties, anchorX, anchorY);
      case 'circle':
        return planCircle(context, feature.properties, anchorX, anchorY);
      // TODO: 'marker' | 'point' | 'shield' need a sprite sheet. They are skipped entirely rather than reserving space from icon-width/icon-height, so an icon that cannot be drawn does not suppress a text label that can.
      default:
        return null;
    }
  } else {
    if (feature.properties.kind !== 'text') return null;
    return planTextAlongPath(context, feature.properties, feature.geometry.coordinates, feature.geometry.angles, extent);
  }
}

async function loadTile(tile: MapLoaderTile) {
  const rasterURL = `https://erichsia7.github.io/bus-map/tiles/${tile.z}/${tile.x}/${tile.y}.webp?v=4`;
  const labelsURL = `https://erichsia7.github.io/bus-map/labels/${tile.z}/${tile.x}/${tile.y}.gz?v=4`;

  const [bitmap, labels] = await Promise.all([getRaster(rasterURL), getLabels(labelsURL)]);
  const canvas = new OffscreenCanvas(renderSize, renderSize);
  const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.lineJoin = 'round';
  context.miterLimit = 2;

  context.drawImage(bitmap, 0, 0, renderSize, renderSize);

  const extent = labels.extent || 1;
  const padding = collisionPadding * scale;
  /** Boxes already committed to the tile. Features are consumed in the server's priority order. */
  const placed: Array<Box> = [];

  for (const feature of labels.features) {
    const plan = planFeature(context, feature, extent);
    if (!plan) continue;

    const box = padBox(plan.box, padding);

    let collides = false;
    for (let i = 0, l = placed.length; i < l; i++) {
      if (intersects(box, placed[i])) {
        collides = true;
        break;
      }
    }
    // The array order is the server-side priority order, so whatever is already placed
    // outranks this feature and this one is dropped.
    if (collides) continue;

    placed.push(box);
    plan.draw();
  }

  const rendered = canvas.transferToImageBitmap();
  self.postMessage(
    {
      type: 'data',
      response: {
        ...tile,
        bitmap: rendered
      }
    } as MapLoaderWorkerMessageData,
    [rendered]
  );
}
