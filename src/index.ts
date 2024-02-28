import { getRoute } from './data/index.ts';

window.bus = {};
window.bus.initialize = function () {};
window.bus.test = function () {
  console.log(getRoute());
};
export default window.bus;
