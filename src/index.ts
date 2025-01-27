import { updateSearchResult } from './interface/search/index';
import { discardExpiredEstimateTimeRecordsForUpdateRate } from './data/analytics/update-rate/index';
import { discardExpiredDataUsageRecords } from './data/analytics/data-usage';
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
import { openSettings, closeSettings, downloadExportFile, openFileToImportData, viewCommitOfCurrentVersion, showPromptToAskForPersistentStorage } from './interface/settings/index';
import { openSettingsOptions, closeSettingsOptions, settingsOptionsHandler } from './interface/settings/options';
import { initializeSettings } from './data/settings/index';
import { fadeOutSplashScreen, setSplashScreenIconOffsetY } from './interface/index';
import { documentQuerySelector } from './tools/query-selector';
import { closeSaveToFolder, openSaveToFolder, saveRouteOnDetailsPage, saveStopItemOnRoute } from './interface/save-to-folder/index';
import { closeFolderManager, openFolderManager } from './interface/folder-manager/index';
import { closeFolderEditor, moveItemOnFolderEditor, openFolderEditor, removeItemOnFolderEditor, saveEditedFolder } from './interface/folder-editor/index';
import { closeFolderIconSelector, openFolderIconSelector, selectFolderIcon, updateMaterialSymbolsSearchResult } from './interface/folder-icon-selector/index';
import { loadCSS } from './interface/lazy-css';
import { closeFolderCreator, createFormulatedFolder, openFolderCreator } from './interface/folder-creator/index';
import { setUpFolderFieldSkeletonScreen, initializeFolders } from './interface/home/folders/index';
import { closeDataUsage, openDataUsage, switchDataUsageGraphAggregationPeriod } from './interface/data-usage/index';
import { closeStorage, openStorage } from './interface/storage/index';
import { closePersonalScheduleManager, openPersonalScheduleManager } from './interface/personal-schedule-manager/index';
import { closePersonalScheduleCreator, createFormulatedPersonalSchedule, openPersonalScheduleCreator, switchPersonalScheduleCreatorDay } from './interface/personal-schedule-creator/index';
import { closePersonalScheduleEditor, openPersonalScheduleEditor, saveEditedPersonalSchedule, switchPersonalScheduleEditorDay } from './interface/personal-schedule-editor/index';
import { discardExpiredEstimateTimeRecordsForBusArrivalTime } from './data/analytics/bus-arrival-time';
import { closeBus, openBus } from './interface/bus/index';
import { discardExpiredRecentViews } from './data/recent-views/index';
import { initializeRecentViews, setUpRecentViewsFieldSkeletonScreen } from './interface/home/recent-views/index';
import { closeNotification, openNotification, saveFormulatedNotification } from './interface/notification/index';
import { loginNotification } from './data/notification/index';
import { closeScheduleNotification, openScheduleNotification, scheduleNotificationForStopItemOnRoute } from './interface/schedule-notification/index';

import './interface/theme.css';

import './interface/index.css';

import './interface/icons/index.css';

import './interface/animation.css';

import './interface/home/field.css';
import './interface/home/head.css';
import './interface/home/body.css';

import './interface/home/folders/folders.css';
import './interface/home/folders/item.css';

import './interface/home/recent-views/recent-views.css';
import './interface/home/recent-views/item.css';

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

import './interface/bus/field.css';
import './interface/bus/head.css';
import './interface/bus/body.css';
import './interface/bus/groups.css';
import './interface/bus/properties.css';

import './interface/settings/index.css';

import './interface/save-to-folder/field.css';
import './interface/save-to-folder/head.css';
import './interface/save-to-folder/body.css';
import './interface/save-to-folder/list.css';
import './interface/save-to-folder/item.css';

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

import './interface/personal-schedule-manager/field.css';
import './interface/personal-schedule-manager/head.css';
import './interface/personal-schedule-manager/body.css';
import './interface/personal-schedule-manager/list.css';
import './interface/personal-schedule-manager/item.css';

import './interface/personal-schedule-creator/field.css';
import './interface/personal-schedule-creator/head.css';
import './interface/personal-schedule-creator/body.css';
import './interface/personal-schedule-creator/groups.css';
import './interface/personal-schedule-creator/schedule-name.css';
import './interface/personal-schedule-creator/schedule-start-time.css';
import './interface/personal-schedule-creator/schedule-end-time.css';
import './interface/personal-schedule-creator/schedule-days.css';

import './interface/personal-schedule-editor/field.css';
import './interface/personal-schedule-editor/head.css';
import './interface/personal-schedule-editor/body.css';
import './interface/personal-schedule-editor/groups.css';
import './interface/personal-schedule-editor/schedule-name.css';
import './interface/personal-schedule-editor/schedule-start-time.css';
import './interface/personal-schedule-editor/schedule-end-time.css';
import './interface/personal-schedule-editor/schedule-days.css';

import './interface/notification/field.css';
import './interface/notification/head.css';
import './interface/notification/body.css';
import './interface/notification/groups.css';
import './interface/notification/provider.css';
import './interface/notification/registration-key.css';

import './interface/schedule-notification/field.css';
import './interface/schedule-notification/head.css';
import './interface/schedule-notification/body.css';
import './interface/schedule-notification/list.css';
import './interface/schedule-notification/item.css';

import './interface/data-usage/field.css';
import './interface/data-usage/head.css';
import './interface/data-usage/body.css';
import './interface/data-usage/graph.css';
import './interface/data-usage/statistics.css';

import './interface/storage/field.css';
import './interface/storage/head.css';
import './interface/storage/body.css';
import './interface/storage/statistics.css';

import './interface/prompt/index.css';

let bus_initialized = false;
let bus_secondly_initialized = false;

window.bus = {
  initialize: function () {
    if (bus_initialized === false) {
      bus_initialized = true;
      setSplashScreenIconOffsetY();
      initializeSettings().then(function () {
        const RecentViewsField = documentQuerySelector('.css_home_field .css_home_body .css_home_recent_views');
        setUpRecentViewsFieldSkeletonScreen(RecentViewsField);
        const FolderField = documentQuerySelector('.css_home_field .css_home_body .css_home_folders');
        setUpFolderFieldSkeletonScreen(FolderField);
        checkAppVersion()
          .then((e) => {
            if (e.status === 'ok') {
              initializeRouteSliding();
              initializeLocationSliding();
              ResizeRouteField();
              ResizeLocationField();
              ResizeSearchInputCanvasSize();
              window.addEventListener('resize', () => {
                ResizeRouteField();
                ResizeLocationField();
                ResizeSearchInputCanvasSize();
              });
              if (screen) {
                if (screen.orientation) {
                  screen.orientation.addEventListener('change', () => {
                    ResizeRouteField();
                    ResizeLocationField();
                    ResizeSearchInputCanvasSize();
                  });
                }
              }
              initializeRecentViews();
              initializeFolderStores().then(() => {
                initializeFolders();
              });
              const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
              const searchInputElement: HTMLElement = documentQuerySelector('.css_search_field .css_search_head .css_search_search_input #search_input');
              mediaQuery.addEventListener('change', function () {
                updateSearchInput(searchInputElement.value, searchInputElement.selectionStart);
              });
              searchInputElement.addEventListener('paste', function () {
                updateSearchResult(searchInputElement.value);
                updateSearchInput(searchInputElement.value, searchInputElement.selectionStart);
              });
              searchInputElement.addEventListener('cut', function () {
                updateSearchResult(searchInputElement.value);
                updateSearchInput(searchInputElement.value, searchInputElement.selectionStart);
              });
              searchInputElement.addEventListener('selectionchange', function () {
                updateSearchResult(searchInputElement.value);
                updateSearchInput(searchInputElement.value, searchInputElement.selectionStart);
              });
              document.addEventListener('selectionchange', function () {
                updateSearchResult(searchInputElement.value);
                updateSearchInput(searchInputElement.value, searchInputElement.selectionStart);
              });
              searchInputElement.addEventListener('keyup', function () {
                updateSearchResult(searchInputElement.value);
                updateSearchInput(searchInputElement.value, searchInputElement.selectionStart);
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
                loginNotification();
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
      });
    }
  },
  secondlyInitialize: function () {
    if (!bus_secondly_initialized) {
      bus_secondly_initialized = true;
      loadCSS('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap', 'noto_sans_tc');
      loadCSS('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200', 'material_symbols');
      downloadData();
      discardExpiredEstimateTimeRecordsForUpdateRate();
      discardExpiredDataUsageRecords();
      discardExpiredEstimateTimeRecordsForBusArrivalTime();
      discardExpiredRecentViews();
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
  storage: {
    openStorage,
    closeStorage
  },
  dataUsage: {
    openDataUsage,
    closeDataUsage,
    switchDataUsageGraphAggregationPeriod
  },
  personalSchedule: {
    openPersonalScheduleManager,
    closePersonalScheduleManager,
    openPersonalScheduleCreator,
    closePersonalScheduleCreator,
    createFormulatedPersonalSchedule,
    switchPersonalScheduleCreatorDay,
    openPersonalScheduleEditor,
    closePersonalScheduleEditor,
    switchPersonalScheduleEditorDay,
    saveEditedPersonalSchedule
  },
  settings: {
    openSettings,
    closeSettings,
    openSettingsOptions,
    closeSettingsOptions,
    settingsOptionsHandler,
    downloadExportFile,
    openFileToImportData,
    viewCommitOfCurrentVersion,
    showPromptToAskForPersistentStorage
  },
  bus: {
    openBus,
    closeBus
  },
  notification: {
    openNotification,
    closeNotification,
    saveFormulatedNotification,
    openScheduleNotification,
    closeScheduleNotification,
    scheduleNotificationForStopItemOnRoute
  }
};

export default window.bus;
