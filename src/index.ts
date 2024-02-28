import { getRoute } from './data/index.ts';

window.bus = {};
window.bus.initialize = function () {};
window.bus.getRoute = getRoute;
export default window.bus;
