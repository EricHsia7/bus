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