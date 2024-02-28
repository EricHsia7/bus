import { integrateRoute } from './data/index.ts';

window.bus = {};
window.bus.initialize = function () {};
window.bus.integrateRoute = integrateRoute;
window.bus.test = function () {
  integrateRoute(16406, [157402]).then((f) => {
    console.log(f);
  });
};
export default window.bus;
