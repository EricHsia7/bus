import { integrateRoute } from './data/apis/index.ts';
import { getRoute } from './data/apis/getRoute.ts';
import { searchRouteByName } from './data/search/searchRoute.ts';
import { calculateDataUsage } from './data/analytics/data-usage.ts';
import { listRecordedEstimateTime, getUpdateRate } from './data/analytics/update-rate.ts';
import { displayRoute, updateRouteField, formatRoute, openRoute, closeRoute, switchRoute, stretchItemBody, initializeRouteSliding, openRouteByURLScheme, ResizeRouteField, switchRouteBodyTab } from './interface/route.ts';
import { openSearchPage, closeSearchPage } from './interface/search-page/index.ts';
import { typeTextIntoInput, deleteCharFromInout, emptyInput } from './interface/search-page/keyboard.ts';

import './interface/css/theme.css';
import './interface/css/index.css';
import './interface/css/route.css';
import './interface/css/home-page.css';
import './interface/css/search-page/index.css';
import './interface/css/search-page/keyboard.css';

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
    ResizeRouteField();
    window.addEventListener('resize', (event) => {
      ResizeRouteField();
    });
    screen.orientation.addEventListener('change', (event) => {
      ResizeRouteField();
    });
    openRouteByURLScheme();
  },
  route: {
    stretchItemBody: stretchItemBody,
    openRoute: openRoute,
    closeRoute: closeRoute,
    switchRoute: switchRoute,
    switchRouteBodyTab: switchRouteBodyTab
  },
  searchPage: {
    openSearchPage,
    closeSearchPage,
    typeTextIntoInput,
    deleteCharFromInout,
    emptyInput
  },
  test: {
    calculateDataUsage,
    listRecordedEstimateTime,
    getUpdateRate
  }
};
window.bus.searchRouteByName = searchRouteByName;

export default window.bus;
