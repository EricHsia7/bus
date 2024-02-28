import { integrateRoute } from './data/index.ts';
import { getRoute } from './data/apis/getRoute.ts';

window.bus = {};
window.bus.initialize = function () {};
window.bus.getRoute = getRoute
window.bus.integrateRoute = integrateRoute;
window.bus.test = function () {
  getRoute().then((e) => {
console.log(e)
    var rf = {};
    for (var o in e) {
      if (String(e[o].n).indexOf('236')>-1) {
        rf.id = parseInt(o.split('_')[1]);
        rf.pid = e[o].pid;
console.log(e[o])
      }
      break;
    }
    integrateRoute(rf.id, rf.pid).then((f) => {
      console.log(f);
    });
  });
};
export default window.bus;
