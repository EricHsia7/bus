import { preloadData } from './data/apis/index.ts';
import { getRoute } from './data/apis/getRoute.ts';
import { searchRouteByName } from './data/search/searchRoute.ts';
import { calculateDataUsage } from './data/analytics/data-usage.ts';
import { listRecordedEstimateTime, getUpdateRate } from './data/analytics/update-rate.ts';
import { openRoute, closeRoute, switchRoute, stretchItemBody, initializeRouteSliding, openRouteByURLScheme, ResizeRouteField, switchRouteBodyTab, saveItemAsStop } from './interface/route/index.ts';
import { openSearchPage, closeSearchPage } from './interface/search-page/index.ts';
import { typeTextIntoInput, deleteCharFromInout, emptyInput } from './interface/search-page/keyboard.ts';
import { initializeFolderStores, saveStop, isSaved } from './data/folder/index.ts';
import { setUpFolderFieldSkeletonScreen, initializeFolders } from './interface/home-page/folder.ts';
import { checkAppVersion } from './data/settings/version.ts';
import { fadeOutSplashScreen } from './interface/index.ts';
import { integrateRouteInformation } from './data/apis/index.ts';

import './interface/theme.css';
import './interface/index.css';
import './interface/animation.css';
import './interface/home-page/index.css';
import './interface/home-page/folder.css';
import './interface/search-page/index.css';
import './interface/search-page/keyboard.css';
import './interface/route/index.css';
import './interface/prompt/index.css';

//for development
/*
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
*/

window.bus = {
  initialize: function () {
    var FolderField = document.querySelector('.home_page_field .home_page_body .home_page_folders');
    setUpFolderFieldSkeletonScreen(FolderField);
    checkAppVersion()
      .then((e) => {
        if (e.status === 'ok') {
          initializeRouteSliding();
          ResizeRouteField();
          window.addEventListener('resize', (event) => {
            ResizeRouteField();
          });
          if (screen) {
            if (screen.orientation) {
              screen.orientation.addEventListener('change', (event) => {
                ResizeRouteField();
              });
            }
          }
          initializeFolderStores().then((e) => {
            initializeFolders();
          });
          preloadData();
          openRouteByURLScheme();
          fadeOutSplashScreen();
        }
        if (e.status === 'fetchError' || e.status === 'unknownError') {
          fadeOutSplashScreen();
          alert(e.status);
        }
      })
      .catch((e) => {
        fadeOutSplashScreen();
        alert(e);
      });
  },
  route: {
    stretchItemBody: stretchItemBody,
    openRoute: openRoute,
    closeRoute: closeRoute,
    switchRoute: switchRoute,
    switchRouteBodyTab: switchRouteBodyTab,
    saveItemAsStop: saveItemAsStop
  },
  folder: {
    isSaved: isSaved,
    saveStop: saveStop
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
    getUpdateRate,
    initializeFolderStores,
    integrateRouteInformation
  }
};
window.bus.searchRouteByName = searchRouteByName;

export default window.bus;
