import { getRoute } from './data/index.ts';

window.bus = {};
window.bus.initialize = function () {};
window.bus.getRoute = getRoute;
window.bus.test = function () {
  getRoute(16406, 157402).then((f) => {
    console.log(f);
  });
};
export default window.bus;
