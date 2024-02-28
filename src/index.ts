import { getRoute } from './data/index.ts';

window.bus = {};
window.bus.initialize = function () {};
window.bus.test = function () {
  var r = await getRoute();
  console.log(r);
};
export default window.bus;
