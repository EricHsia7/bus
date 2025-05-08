export interface Segment {
  x: number;
  y: number;
}

export type Segments = Array<Segment>;

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
  const segmentsLength1 = segments.length - 1;
  for (let i = 1; i < segmentsLength1; i++) {
    const current = segments[i];
    const next = segments[i + 1] || current;

    pathCommand += `Q${current.x * scale},${current.y * scale},${(current.x * scale + next.x * scale) / 2},${(current.y * scale + next.y * scale) / 2}`;
  }
  const lastPoint = segments[segmentsLength1];
  pathCommand += `L${lastPoint.x * scale},${lastPoint.y * scale}`;
  return pathCommand;
}
