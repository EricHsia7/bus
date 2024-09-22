import { updateSearchResult } from './interface/search/index';
import { discardExpiredEstimateTimeRecords } from './data/analytics/update-rate';
import { calculateStoresSize } from './data/storage/index';
import { askForPositioningPermission } from './data/user-position/index';
import { openRoute, closeRoute, switchRoute, stretchRouteItemBody, initializeRouteSliding, ResizeRouteField, switchRouteBodyTab } from './interface/route/index';
import { openRouteDetails, closeRouteDetails } from './interface/route/details/index';
import { shareRoutePermalink } from './interface/route/details/actions';
import { openLocation, closeLocation, initializeLocationSliding, ResizeLocationField, stretchLocationItemBody } from './interface/location/index';
import { openPermalink } from './tools/permalink';
import { openSearch, closeSearch } from './interface/search/index';
import { typeTextIntoInput, deleteCharFromInout, emptyInput, openSystemKeyboard, ResizeSearchInputCanvasSize, updateSearchInput } from './interface/search/keyboard';
import { initializeFolderStores } from './data/folder/index';
import { downloadData } from './interface/home/index';
import { checkAppVersion } from './data/settings/version';
import { openSettings, closeSettings, downloadExportFile } from './interface/settings/index';
import { openSettingsOptions, closeSettingsOptions, settingsOptionsHandler } from './interface/settings/options';
import { initializeSettings } from './data/settings/index';
import { fadeOutSplashScreen, setSplashScreenIconOffsetY } from './interface/index';
import { documentQuerySelector } from './tools/query-selector';
import { closeSaveToFolder, openSaveToFolder, saveRouteOnDetailsPage, saveStopItemOnRoute } from './interface/save-to-folder/index';
import { closeFolderManager, openFolderManager } from './interface/folder-manager/index';
import { closeFolderEditor, moveItemOnFolderEditor, openFolderEditor, removeItemOnFolderEditor, saveEditedFolder } from './interface/folder-editor/index';
import { closeFolderIconSelector, openFolderIconSelector, selectFolderIcon, updateMaterialSymbolsSearchResult } from './interface/folder-icon-selector/index';
import { loadFont } from './interface/lazy-font';
import { closeFolderCreator, createFormulatedFolder, openFolderCreator } from './interface/folder-creator/index';
import { setUpFolderFieldSkeletonScreen, initializeFolders } from './interface/home/folders/index';
import { closeDataUsage, openDataUsage, switchDataUsageGraphAggregationPeriod } from './interface/data-usage/index';

import './interface/theme.css';

import './interface/index.css';

import './interface/icons/index.css';

import './interface/animation.css';

import './interface/home/field.css';
import './interface/home/head.css';
import './interface/home/body.css';

import './interface/home/folders/folders.css';
import './interface/home/folders/item.css';

import './interface/search/index.css';
import './interface/search/keyboard.css';

import './interface/route/field.css';
import './interface/route/head.css';
import './interface/route/groups.css';
import './interface/route/item.css';
import './interface/route/thread.css';
import './interface/route/index.css';

import './interface/route/details/index.css';
import './interface/route/details/actions.css';
import './interface/route/details/properties.css';
import './interface/route/details/calendar.css';

import './interface/location/field.css';
import './interface/location/head.css';
import './interface/location/groups.css';
import './interface/location/group-details.css';
import './interface/location/group-items.css';
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
import './interface/folder-creator/body.css';
import './interface/folder-creator/groups.css';
import './interface/folder-creator/folder-name.css';
import './interface/folder-creator/folder-icon.css';

import './interface/folder-icon-selector/field.css';
import './interface/folder-icon-selector/head.css';
import './interface/folder-icon-selector/body.css';
import './interface/folder-icon-selector/symbols.css';

import './interface/data-usage/field.css';
import './interface/data-usage/head.css';
import './interface/data-usage/body.css';
import './interface/data-usage/graph.css';
import './interface/data-usage/statistics.css';

import './interface/prompt/index.css';
import { importData } from './data/import/index';

let bus_initialized = false;
let bus_secondly_initialized = false;

window.bus = {
  initialize: function () {
    if (bus_initialized === false) {
      bus_initialized = true;
      setSplashScreenIconOffsetY();
      var FolderField = documentQuerySelector('.css_home_field .css_home_body .css_home_folders');
      setUpFolderFieldSkeletonScreen(FolderField);
      checkAppVersion()
        .then((e) => {
          if (e.status === 'ok') {
            initializeSettings().then((e) => {});
            initializeRouteSliding();
            initializeLocationSliding();
            ResizeRouteField();
            ResizeLocationField();
            ResizeSearchInputCanvasSize();
            window.addEventListener('resize', (event) => {
              ResizeRouteField();
              ResizeLocationField();
              ResizeSearchInputCanvasSize();
            });
            if (screen) {
              if (screen.orientation) {
                screen.orientation.addEventListener('change', (event) => {
                  ResizeRouteField();
                  ResizeLocationField();
                  ResizeSearchInputCanvasSize();
                });
              }
            }
            initializeFolderStores().then((e) => {
              initializeFolders();
            });
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const searchInputElement: HTMLElement = documentQuerySelector('.css_search_field .css_search_head .css_search_search_input #search_input');
            mediaQuery.addEventListener('change', function () {
              updateSearchInput(searchInputElement.value);
            });
            searchInputElement.addEventListener('paste', function (event) {
              updateSearchResult(searchInputElement.value);
              updateSearchInput(searchInputElement.value);
            });
            searchInputElement.addEventListener('cut', function () {
              updateSearchResult(searchInputElement.value);
              updateSearchInput(searchInputElement.value);
            });
            searchInputElement.addEventListener('selectionchange', function () {
              updateSearchResult(searchInputElement.value);
              updateSearchInput(searchInputElement.value);
            });
            document.addEventListener('selectionchange', function () {
              updateSearchResult(searchInputElement.value);
              updateSearchInput(searchInputElement.value);
            });
            searchInputElement.addEventListener('keyup', function () {
              updateSearchResult(searchInputElement.value);
              updateSearchInput(searchInputElement.value);
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
  secondlyInitialize: function () {
    if (!bus_secondly_initialized) {
      bus_secondly_initialized = true;
      loadFont('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap', 'Noto Sans Traditional Chinese', 'noto_sans_tc');
      loadFont('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200', 'Material Symbols Rounded', 'material_symbols');
      downloadData();
      discardExpiredEstimateTimeRecords();
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
    createFormulatedFolder,
    saveEditedFolder,
    selectFolderIcon,
    saveStopItemOnRoute,
    saveRouteOnDetailsPage,
    removeItemOnFolderEditor,
    moveItemOnFolderEditor
  },
  search: {
    openSearch,
    closeSearch,
    typeTextIntoInput,
    deleteCharFromInout,
    emptyInput,
    openSystemKeyboard
  },
  test: {
    calculateStoresSize,
    importData
  },
  dataUsage: {
    openDataUsage,
    closeDataUsage,
    switchDataUsageGraphAggregationPeriod
  },
  settings: {
    openSettings,
    closeSettings,
    openSettingsOptions,
    closeSettingsOptions,
    settingsOptionsHandler,
    downloadExportFile
  }
};

export default window.bus;
