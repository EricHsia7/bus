import { integrateRoute } from './data/apis/index.ts';
import { getRoute } from './data/apis/getRoute.ts';
import { searchRoute } from './data/search/searchRoute.ts';
import { displayRoute } from './interface/route.ts';


//for development

const ErrorStackParser = require('error-stack-parser');
const StackTrace = require('stacktrace-js');

window.onerror = async function (message, source, lineno, colno, error) {
  StackTrace.fromError(error).then(function (stackTrace) {
    var parsedStackTrace = stackTrace.map(function (frame) {
      return {
        functionName: frame.functionName,
        fileName: frame.fileName,
        lineNumber: frame.lineNumber,
        columnNumber: frame.columnNumber
      };
    });
    console.log('%c ----------', 'color: #888;');
    parsedStackTrace.forEach((e) => {
      console.error(`func: ${e.functionName}\npath: ${e.fileName}\nlocation: L${e.lineNumber} C${e.columnNumber}`);
    });
  });
};


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
    }).catch((e)=>{
console.log(e)
});
    displayRoute(e[0].id, e[0].pid).then((f) => {
      console.log(f);
    }).catch((e)=>{
console.log(e)
})
  });
};
export default window.bus;
