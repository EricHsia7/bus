import { updateSearchResult } from './interface/search/index.ts';
import { calculateDataUsage } from './data/analytics/data-usage.ts';
import { getUpdateRateInTime } from './data/analytics/update-rate.ts';
import { calculateStoresSize } from './data/storage/index.ts';
import { askForPositioningPermission } from './data/user-position/index.ts';
import { openRoute, closeRoute, switchRoute, stretchRouteItemBody, initializeRouteSliding, ResizeRouteField, ResizeRouteCanvas, switchRouteBodyTab } from './interface/route/index.ts';
import { openRouteDetails, closeRouteDetails } from './interface/route/details/index.ts';
import { shareRoutePermalink } from './interface/route/details/actions.ts';
import { openLocation, closeLocation, initializeLocationSliding, ResizeLocationField, stretchLocationItemBody } from './interface/location/index.ts';
import { openPermalink } from './tools/permalink.ts';
import { openSearchPage, closeSearchPage } from './interface/search/index.ts';
import { typeTextIntoInput, deleteCharFromInout, emptyInput } from './interface/search/keyboard.ts';
import { initializeFolderStores } from './data/folder/index.ts';
import { setUpFolderFieldSkeletonScreen, initializeFolders } from './interface/home/folder.ts';
import { preloadData } from './interface/home/index.ts';
import { checkAppVersion } from './data/settings/version.ts';
import { openSettingsPage, closeSettingsPage } from './interface/settings/index.ts';
import { openSettingsOptionsPage, closeSettingsOptionsPage, settingsOptionsHandler } from './interface/settings/options.ts';
import { initializeSettings } from './data/settings/index.ts';
import { fadeOutSplashScreen } from './interface/index.ts';
import { documentQuerySelector } from './tools/query-selector.ts';
import { closeSaveToFolder, openSaveToFolder, saveStopItemOnRoute } from './interface/save-to-folder/index.ts';
import { closeFolderManager, openFolderManager } from './interface/folder-manager/index.ts';
import { closeFolderEditor, moveItemOnFolderEditor, openFolderEditor, removeItemOnFolderEditor, saveEditedFolder } from './interface/folder-editor/index.ts';
import { closeFolderIconSelector, openFolderIconSelector, selectFolderIcon, updateMaterialSymbolsSearchResult } from './interface/folder-icon-selector/index.ts';
import { loadFont } from './interface/lazy-font.ts';
import { closeFolderCreator, openFolderCreator } from './interface/folder-creator/index.ts';


import './interface/theme.css';

import './interface/index.css';

import './interface/icons/index.css';

import './interface/animation.css';

import './interface/home/index.css';
import './interface/home/folder.css';

import './interface/search/index.css';
import './interface/search/keyboard.css';

import './interface/route/field.css';
import './interface/route/groups.css';
import './interface/route/item.css';
import './interface/route/thread.css';
import './interface/route/index.css';

import './interface/route/details/index.css';
import './interface/route/details/actions.css';
import './interface/route/details/properties.css';
import './interface/route/details/calendar.css';

import './interface/location/index.css';
import './interface/settings/index.css';

import './interface/save-to-folder/index.css';

import './interface/folder-manager/field.css';
import './interface/folder-manager/head.css';
import './interface/folder-manager/body.css';
import './interface/folder-manager/list.css';
import './interface/folder-manager/item.css';

import './interface/folder-editor/field.css';
import './interface/folder-editor/head.css';
import './interface/folder-editor/body.css';
import './interface/folder-editor/groups.css';
import './interface/folder-editor/folder-name.css';
import './interface/folder-editor/folder-icon.css';
import './interface/folder-editor/folder-content.css';

import './interface/folder-creator/field.css';
import './interface/folder-creator/head.css';

import './interface/folder-icon-selector/field.css';
import './interface/folder-icon-selector/head.css';
import './interface/folder-icon-selector/body.css';
import './interface/folder-icon-selector/symbols.css';

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
let bus_lazily_loaded = false;

window.bus = {
  initialize: function () {
    if (bus_initialized === false) {
      bus_initialized = true;
      var FolderField = documentQuerySelector('.css_home_field .css_home_body .css_home_folders');
      setUpFolderFieldSkeletonScreen(FolderField);
      checkAppVersion()
        .then((e) => {
          if (e.status === 'ok') {
            initializeSettings().then((e) => {});
            initializeRouteSliding();
            initializeLocationSliding();
            ResizeRouteField();
            ResizeRouteCanvas();
            ResizeLocationField();
            window.addEventListener('resize', (event) => {
              ResizeRouteField();
              ResizeRouteCanvas();
              ResizeLocationField();
            });
            if (screen) {
              if (screen.orientation) {
                screen.orientation.addEventListener('change', (event) => {
                  ResizeRouteField();
                  ResizeRouteCanvas();
                  ResizeLocationField();
                });
              }
            }
            initializeFolderStores().then((e) => {
              initializeFolders();
            });
            const searchInputElement: HTMLElement = documentQuerySelector('.css_search_field .css_search_head .css_search_search_input #search_route_input');
            searchInputElement.addEventListener('paste', function (event) {
              updateSearchResult(searchInputElement.value);
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

            const searchMaterialSymbolsInputElement: HTMLElement = documentQuerySelector('.css_folder_icon_selector_field .css_folder_icon_selector_head .css_folder_icon_selector_search_input #search_material_symbols_input');
            searchMaterialSymbolsInputElement.addEventListener('paste', function () {
              updateMaterialSymbolsSearchResult(searchMaterialSymbolsInputElement.value);
            });
            searchMaterialSymbolsInputElement.addEventListener('cut', function () {
              updateMaterialSymbolsSearchResult(searchMaterialSymbolsInputElement.value);
            });
            searchMaterialSymbolsInputElement.addEventListener('selectionchange', function () {
              updateMaterialSymbolsSearchResult(searchMaterialSymbolsInputElement.value);
            });
            document.addEventListener('selectionchange', function () {
              updateMaterialSymbolsSearchResult(searchMaterialSymbolsInputElement.value);
            });
            searchMaterialSymbolsInputElement.addEventListener('keyup', function () {
              updateMaterialSymbolsSearchResult(searchMaterialSymbolsInputElement.value);
            });
            openPermalink();
            fadeOutSplashScreen(function () {
              preloadData();
              askForPositioningPermission();
            });
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
  lazily_load: function () {
    if (!bus_lazily_loaded) {
      bus_lazily_loaded = true;
      loadFont('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap', 'Noto Sans', 'noto_sans');
      loadFont('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200', 'Material Symbols Rounded', 'material_symbols');
    }
  },
  route: {
    stretchRouteItemBody,
    openRoute,
    closeRoute,
    switchRoute,
    switchRouteBodyTab,
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
    openSaveToFolder,
    closeSaveToFolder,
    openFolderManager,
    closeFolderManager,
    openFolderEditor,
    closeFolderEditor,
    openFolderIconSelector,
    closeFolderIconSelector,
    openFolderCreator,
    closeFolderCreator,
    saveEditedFolder,
    selectFolderIcon,
    saveStopItemOnRoute,
    removeItemOnFolderEditor,
    moveItemOnFolderEditor
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
    calculateStoresSize,
    getUpdateRateInTime
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
