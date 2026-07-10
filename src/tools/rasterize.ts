export async function rasterizeSVGPath(width: number, height: number, path: string): string {
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
  context.fillStyle = 'black';
  context.fill(new Path2D(path));
  const blob = await canvas.convertToBlob();
  return URL.createObjectURL(blob);
}
