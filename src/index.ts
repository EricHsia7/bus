import { updateSearchResult } from './interface/search-page/index.ts';
import { calculateDataUsage } from './data/analytics/data-usage.ts';
import { calculateStoresSize } from './data/storage/index.ts';
import { openRoute, closeRoute, switchRoute, stretchRouteItemBody, initializeRouteSliding, ResizeRouteField, switchRouteBodyTab, saveItemAsStop } from './interface/route/index.ts';
import { openRouteDetails, closeRouteDetails } from './interface/route/details/index.ts';
import { shareRoutePermalink } from './interface/route/details/actions.ts';
import { openLocation, closeLocation, initializeLocationSliding, ResizeLocationField, stretchLocationItemBody } from './interface/location/index.ts';
import { openPermalink } from './tools/permalink.ts';
import { openSearchPage, closeSearchPage } from './interface/search-page/index.ts';
import { typeTextIntoInput, deleteCharFromInout, emptyInput } from './interface/search-page/keyboard.ts';
import { initializeFolderStores, saveStop } from './data/folder/index.ts';
import { setUpFolderFieldSkeletonScreen, initializeFolders } from './interface/home-page/folder.ts';
import { preloadData } from './interface/home-page/index.ts';
import { checkAppVersion } from './data/settings/version.ts';
import { openSettingsPage, closeSettingsPage } from './interface/settings/index.ts';
import { openSettingsOptionsPage, closeSettingsOptionsPage, settingsOptionsHandler } from './interface/settings/options.ts';
import { initializeSettings } from './data/settings/index.ts';
import { fadeOutSplashScreen } from './interface/index.ts';

import './interface/theme.css';
import './interface/index.css';
import './interface/animation.css';
import './interface/home-page/index.css';
import './interface/home-page/folder.css';
import './interface/search-page/index.css';
import './interface/search-page/keyboard.css';
import './interface/route/index.css';
import './interface/route/details/index.css';
import './interface/route/details/actions.css';
import './interface/route/details/properties.css';
import './interface/route/details/calendar.css';
import './interface/location/index.css';
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
            initializeSettings().then((e) => {});
            initializeRouteSliding();
            initializeLocationSliding();
            ResizeRouteField();
            ResizeLocationField();
            window.addEventListener('resize', (event) => {
              ResizeRouteField();
              ResizeLocationField();
            });
            if (screen) {
              if (screen.orientation) {
                screen.orientation.addEventListener('change', (event) => {
                  ResizeRouteField();
                  ResizeLocationField();
                });
              }
            }
            initializeFolderStores().then((e) => {
              initializeFolders();
            });
            var searchInputElement: HTMLElement = document.querySelector('.search_page_field .search_page_head .search_page_search_input #search_route_input');
            searchInputElement.addEventListener('paste', function (event) {
              updateSearchResult(event.target.value);
            });
            searchInputElement.addEventListener('cut', function () {
              updateSearchResult(searchInputElement.value);
            });
            searchInputElement.addEventListener('selectionchange', function () {
              updateSearchResult(searchInputElement.value);
            });
            document.addEventListener('selectionchange', function () {
              updateSearchResult(searchInputElement.value);
            });
            searchInputElement.addEventListener('keyup', function () {
              updateSearchResult(searchInputElement.value);
            });
            openPermalink();
            fadeOutSplashScreen();
            preloadData().then((e) => {});
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
    stretchRouteItemBody,
    openRoute,
    closeRoute,
    switchRoute,
    switchRouteBodyTab,
    saveItemAsStop,
    openRouteDetails,
    closeRouteDetails,
    shareRoutePermalink
  },
  location: {
    openLocation,
    closeLocation,
    stretchLocationItemBody
  },
  folder: {
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

export default window.bus;
