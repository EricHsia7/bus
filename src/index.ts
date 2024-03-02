import { integrateRoute } from './data/apis/index.ts';
import { getRoute } from './data/apis/getRoute.ts';
import { searchRouteByName } from './data/search/searchRoute.ts';
import { displayRoute, updateRouteField, formatRoute, openRoute, stretchItemBody, initializeRouteSliding, openRouteByURLScheme } from './interface/route.ts';
import { FieldResize } from './interface/index.ts';

import './interface/css/theme.css';
import './interface/css/index.css';
import './interface/css/route.css';

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

window.bus = {
  initialize: function () {
    initializeRouteSliding();
    FieldResize();
    window.addEventListener('resize', (event) => {
      FieldResize();
    });
    openRouteByURLScheme()
  },
  route: {
    stretchItemBody: stretchItemBody,
    closeRoute: closeRoute,
    openRoute: openRoute
  }
};
window.bus.searchRouteByName = searchRouteByName;

window.bus.test = function () {};
export default window.bus;
