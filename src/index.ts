import { integrateRoute } from './data/apis/index.ts';
import { getRoute } from './data/apis/getRoute.ts';
import { searchRoute } from './data/search/searchRoute.ts';

window.bus = {};
window.bus.initialize = function () {};
window.bus.getRoute = getRoute;
window.bus.integrateRoute = integrateRoute;
window.bus.searchRoute = searchRoute;
window.bus.test = function () {
  searchRoute('236').then((e) => {
    console.log(e);
    integrateRoute(e[0].id, e[0].pid).then((f) => {
      console.log(f);
    });
  });
};
export default window.bus;
