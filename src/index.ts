import { preloadData } from './data/apis/index.ts';
import { getRoute } from './data/apis/getRoute.ts';
import { searchRouteByName } from './data/search/searchRoute.ts';
import { calculateDataUsage } from './data/analytics/data-usage.ts';
import { calculateStoresSize } from './data/storage/index.ts';
import { listRecordedEstimateTime, getUpdateRate } from './data/analytics/update-rate.ts';
import { openRoute, closeRoute, switchRoute, stretchItemBody, initializeRouteSliding, ResizeRouteField, switchRouteBodyTab, saveItemAsStop } from './interface/route/index.ts';
import { openRouteInformation, closeRouteInformation } from './interface/route/information/index.ts';
import { openSearchPage, closeSearchPage } from './interface/search-page/index.ts';
import { typeTextIntoInput, deleteCharFromInout, emptyInput } from './interface/search-page/keyboard.ts';
import { initializeFolderStores, saveStop, isSaved } from './data/folder/index.ts';
import { setUpFolderFieldSkeletonScreen, initializeFolders } from './interface/home-page/folder.ts';
import { checkAppVersion } from './data/settings/version.ts';
import { openSettingsPage, closeSettingsPage } from './interface/settings/index.ts';
import { openSettingsOptionsPage, closeSettingsOptionsPage, settingsOptionsHandler } from './interface/settings/options.ts';
import { initializeSettings } from './data/settings/index.ts';
import { fadeOutSplashScreen } from './interface/index.ts';
import { openPermalink } from './tools/permalink.ts';

import './interface/theme.css';
import './interface/index.css';
import './interface/animation.css';
import './interface/home-page/index.css';
import './interface/home-page/folder.css';
import './interface/search-page/index.css';
import './interface/search-page/keyboard.css';
import './interface/route/index.css';
import './interface/route/information/index.css';
import './interface/route/information/properties.css';
import './interface/route/information/calendar.css';
import './interface/settings/index.css';
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

let bus_initialized = false;

window.bus = {
  initialize: function () {
    if (bus_initialized === false) {
      bus_initialized = true;
      var FolderField = document.querySelector('.home_page_field .home_page_body .home_page_folders');
      setUpFolderFieldSkeletonScreen(FolderField);
      checkAppVersion()
        .then((e) => {
          if (e.status === 'ok') {
            initializeSettings();
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
            openRouteByPermalink();
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
    }
  },
  route: {
    stretchItemBody: stretchItemBody,
    openRoute: openRoute,
    closeRoute: closeRoute,
    switchRoute: switchRoute,
    switchRouteBodyTab: switchRouteBodyTab,
    saveItemAsStop: saveItemAsStop,
    openRouteInformation: openRouteInformation,
    closeRouteInformation: closeRouteInformation
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
    calculateStoresSize
  },
  settingsPage: {
    openSettingsPage,
    closeSettingsPage,
    openSettingsOptionsPage,
    closeSettingsOptionsPage,
    settingsOptionsHandler
  }
};
window.bus.searchRouteByName = searchRouteByName;

export default window.bus;
