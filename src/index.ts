import { integrateRoute } from './data/index.ts';
import { getRoute } from './data/apis/getRoute.ts';

window.bus = {};
window.bus.initialize = function () {};
window.bus.integrateRoute = integrateRoute;
window.bus.test = function () {
  getRoute().then((e) => {
    var rf = {};
    for (var o in e) {
      if (e[o].n === '236') {
        rf.id = n.split('_')[1];
        rf.pid = e[o].pid;
      }
      break;
    }
    integrateRoute(rf.id, rf.pid).then((f) => {
      console.log(f);
    });
  });
};
export default window.bus;
