export type Segment = [x: number, y: number];

export type Segments = Array<Segment>;

function distanceToSegment(point: Segment, start: Segment, end: Segment): number {
  let dx = end[0] - start[0];
  let dy = end[1] - start[1];
  const d = dx * dx + dy * dy;
  const t = ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / d;

  if (t < 0) {
    dx = point[0] - start[0];
    dy = point[1] - start[1];
  } else if (t > 1) {
    dx = point[0] - end[0];
    dy = point[1] - end[1];
  } else {
    const closestPoint = [start.x + t * dx, start.y + t * dy];
    dx = point[0] - closestPoint[0];
    dy = point[1] - closestPoint[1];
  }

  return Math.sqrt(dx * dx + dy * dy);
}

export function simplifyPath(points: Segments, tolerance: number): Segments {
 const length1 = points.length - 1;
  if (length1 < 2) {
    return points;
  }

  let dmax = 0;
  let index = 0;

  // Find the point with the maximum distance
  for (let i = 1; i < length1; i++) {
    const d = distanceToSegment(points[i], points[0], points[length1]);
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
    simplifiedLeft.pop();
    return simplifiedLeft.concat(simplifiedRight);
  } else {
    return [points[0], points[length1]];
  }
}

export function segmentsToPath(segments: Segments): string {
  const segmentsLength1 = segments.length - 1;
  if (segmentsLength1 < 0) {
    return '';
  }
  const pathCommand = [`M${segments[0][0]},${segments[0][1]}`];
  for (let i = 1; i < segmentsLength1; i++) {
    const current = segments[i];
    const next = segments[i + 1] || current;
    pathCommand.push(`Q${current[0]},${current[1]},${(current[0] + next[0]) / 2},${(current[1] + next[1]) / 2}`);
  }
  const lastPoint = segments[segmentsLength1];
  pathCommand.push(`L${lastPoint[0]},${lastPoint[1]}`);
  return pathCommand.join(' ');
}
