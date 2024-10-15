interface Segment {
  x: number;
  y: number;
}

type Segments = Array<Segment>;

function distanceToSegment(point: Segment, start: Segment, end: Segment): number {
  let dx = end.x - start.x;
  let dy = end.y - start.y;
  const d = dx * dx + dy * dy;
  const t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / d;

  if (t < 0) {
    dx = point.x - start.x;
    dy = point.y - start.y;
  } else if (t > 1) {
    dx = point.x - end.x;
    dy = point.y - end.y;
  } else {
    const closestPoint = { x: start.x + t * dx, y: start.y + t * dy };
    dx = point.x - closestPoint.x;
    dy = point.y - closestPoint.y;
  }

  return Math.sqrt(dx * dx + dy * dy);
}

export function simplifyPath(points: Segments, tolerance: number): Segments {
  if (points.length < 3) {
    return points;
  }

  let dmax = 0;
  let index = 0;

  // Find the point with the maximum distance
  for (let i = 1; i < points.length - 1; i++) {
    const d = distanceToSegment(points[i], points[0], points[points.length - 1]);
    if (d > dmax) {
      index = i;
      dmax = d;
    }
  }

  // If max distance is greater than tolerance, split the curve
  if (dmax > tolerance) {
    const leftPoints = points.slice(0, index + 1);
    const rightPoints = points.slice(index);
    const simplifiedLeft = simplifyPath(leftPoints, tolerance);
    const simplifiedRight = simplifyPath(rightPoints, tolerance);
    return simplifiedLeft.slice(0, simplifiedLeft.length - 1).concat(simplifiedRight);
  } else {
    return [points[0], points[points.length - 1]];
  }
}

export function segmentsToPath(segments: Segments, scale: number): string {
  if (segments.length < 1) {
    return '';
  }
  let pathCommand = `M${segments[0].x * scale},${segments[0].y * scale}`;
  for (let i = 1; i < segments.length - 1; i++) {
    const current = segments[i];
    const next = segments[i + 1] || current;

    pathCommand += `Q${current.x * scale},${current.y * scale},${(current.x * scale + next.x * scale) / 2},${(current.y * scale + next.y * scale) / 2}`;
  }
  const lastPoint = segments[segments.length - 1];
  pathCommand += `L${lastPoint.x * scale},${lastPoint.y * scale}`;
  return pathCommand;
}

export function getTextWidth(text: string, weight: number, size: string, fontFamily: string): number {
  const canvas: HTMLCanvasElement = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
  const context = canvas.getContext('2d');
  const font: string = `${weight} ${size} ${fontFamily}`;
  context.font = font;
  return context.measureText(text).width;
}

interface BorderRadius {
  tl: number;
  tr: number;
  br: number;
  bl: number;
}

export function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number | BorderRadius, fill: string): void {
  // If radius is a single value, treat it as the same for all corners
  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    // Set defaults if individual radii are not provided
    radius = {
      tl: radius.tl || 0,
      tr: radius.tr || 0,
      br: radius.br || 0,
      bl: radius.bl || 0
    };
  }

  // Start path
  ctx.beginPath();
  // Move to the top-left corner, accounting for the top-left radius
  ctx.moveTo(x + radius.tl, y);
  // Draw the top line, rounding the top-right corner
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  // Draw the right side, rounding the bottom-right corner
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  // Draw the bottom side, rounding the bottom-left corner
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  // Draw the left side, rounding the top-left corner
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  // Complete the path
  ctx.closePath();

  ctx.fillStyle = fill;
  ctx.fill(); // To fill the shape
}

export function drawPoint(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, fill: string, strokeStyle: string): void {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();
}

export function drawLine(ctx: CanvasRenderingContext2D, points: Segments, strokeStyle: string, lineWidth: number): void {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const currentPoint = points[i];
    const nextPoint = points[i + 1] || currentPoint;
    ctx.quadraticCurveTo(currentPoint.x, currentPoint.y, (currentPoint.x + nextPoint.x) / 2, (currentPoint.y + nextPoint.y) / 2);
  }
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
  ctx.closePath();
}
