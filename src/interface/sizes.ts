export let Sizes: SizesMap = {
  window: [0, 0],
  head: [0, 0],
  head_one_button: [0, 0],
  head_two_button: [0, 0],
  route_details_canvas: [0, 0],
  route_bus_arrival_time_chart: [0, 0],
  location_bus_arrival_time_chart: [0, 0]
};

export type SizeType = 'window' | 'head' | 'head_one_button' | 'head_two_button' | 'route_details_canvas' | 'route_bus_arrival_time_chart' | 'location_bus_arrival_time_chart';

export type Size = [width: number, height: number];

export type SizesMap = {
  [sizeType: string]: Size;
};

export function getSize(sizeType: SizeType): Size {
  return Sizes[sizeType] 
}

export function updateSizes(): void {
  const w = window.innerWidth;
  const h = window.innerHeight;
  Sizes.window = [w, h];
  Sizes.head = [w, 55];
  Sizes.head_one_button = [w - 55, 55];
  Sizes.head_two_button = [w - 55 * 2, 55];
  Sizes.route_details_canvas = [w - 10 * 2 - 10 * 2, 24 * 70];
  Sizes.route_bus_arrival_time_chart = [w - 45 - 15 - 20, 75];
  Sizes.location_bus_arrival_time_chart = [w - 30 - 20, 75];
}
