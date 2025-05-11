import { recoverBusArrivalTimeDataFromWriteAheadLog } from './data/analytics/bus-arrival-time/index';
import { discardExpiredDataUsageStats } from './data/analytics/data-usage/index';
import { discardExpiredUpdateRateDataGroups, initializeUpdateRateDataGroups, recoverUpdateRateDataFromWriteAheadLog } from './data/analytics/update-rate/index';
import { initializeFolderList } from './data/folder/index';
import { discardExpiredNotificationSchedules, initializeNotificationSchedules, loadNotificationClient } from './data/notification/index';
import { discardExpiredRecentViews } from './data/recent-views/index';
import { initializeSettings } from './data/settings/index';
import { checkAppVersion } from './data/settings/version';
import { askForCalibratingPermission } from './data/user-orientation/index';
import { askForPositioningPermission } from './data/user-position/index';
import { closeBus, openBus } from './interface/bus/index';
import { closeDataUsage, openDataUsage } from './interface/data-usage/index';
import { closeFolderCreator, createFormulatedFolder, openFolderCreator } from './interface/folder-creator/index';
import { closeFolderEditor, moveItemOnFolderEditor, openFolderEditor, removeItemOnFolderEditor, saveEditedFolder } from './interface/folder-editor/index';
import { closeFolderIconSelector, openFolderIconSelector, selectFolderIcon, updateMaterialSymbolsSearchResult } from './interface/folder-icon-selector/index';
import { closeFolderManager, openFolderManager } from './interface/folder-manager/index';
import { initializeFolders, setUpFolderFieldSkeletonScreen } from './interface/home/folders/index';
import { downloadData } from './interface/home/index';
import { initializeRecentViews, setUpRecentViewsFieldSkeletonScreen } from './interface/home/recent-views/index';
import { fadeOutSplashScreen, setSplashScreenIconOffsetY, showErrorMessage } from './interface/index';
import { closeLocation, initializeLocationSliding, openLocation, stretchLocationItem, switchLocationBodyTab } from './interface/location/index';
import { cancelNotificationOnNotificationScheduleManager, closeNotificationScheduleManager, openNotificationScheduleManager } from './interface/notification-schedule-manager/index';
import { closePersonalScheduleCreator, createFormulatedPersonalSchedule, openPersonalScheduleCreator, switchPersonalScheduleCreatorDay } from './interface/personal-schedule-creator/index';
import { closePersonalScheduleEditor, openPersonalScheduleEditor, saveEditedPersonalSchedule, switchPersonalScheduleEditorDay } from './interface/personal-schedule-editor/index';
import { closePersonalScheduleManager, openPersonalScheduleManager } from './interface/personal-schedule-manager/index';
import { closeQRCode, openQRCode } from './interface/qrcode/index';
import { closeRegisterNotification, openRegisterNotification, saveFormulatedRegisterNotification } from './interface/register-notification/index';
import { shareRoutePermalink, showRoutePermalinkQRCode } from './interface/route/details/actions';
import { switchCalendarDay } from './interface/route/details/calendar';
import { closeRouteDetails } from './interface/route/details/index';
import { closeRoute, initializeRouteSliding, openRoute, stretchRouteItem, switchRoute, switchRouteBodyTab } from './interface/route/index';
import { closeSaveToFolder, openSaveToFolder, saveRouteOnDetailsPage, saveRouteOnRoute, saveStopItemOnLocation, saveStopItemOnRoute } from './interface/save-to-folder/index';
import { closeScheduleNotification, openScheduleNotification, scheduleNotificationForStopItemOnLocation, scheduleNotificationForStopItemOnRoute } from './interface/schedule-notification/index';
import { closeSearch, deleteCharFromInout, emptyInput, openSearch, openSystemKeyboard, resizeSearchInputCanvas, switchSearchTypeFilter, typeTextIntoInput, updateSearchInput, updateSearchResult } from './interface/search/index';
import { closeSettings, downloadExportFile, openFileToImportData, openSettings, showPromptToAskForPersistentStorage, viewCommitOfCurrentVersion } from './interface/settings/index';
import { closeSettingsOptions, openSettingsOptions, settingsOptionsHandler } from './interface/settings/options';
import { closeStorage, openStorage } from './interface/storage/index';
import { openPermalink } from './tools/permalink';
import { documentQuerySelector } from './tools/query-selector';

import './interface/theme.css';

import './interface/index.css';

import './interface/icons/index.css';

import './interface/animation.css';

import './interface/home/field.css';
import './interface/home/head.css';
import './interface/home/body.css';

import './interface/home/recent-views/recent-views.css';
import './interface/home/recent-views/item.css';

import './interface/home/folders/folders.css';
import './interface/home/folders/item.css';

import './interface/search/field.css';
import './interface/search/head.css';
import './interface/search/body.css';
import './interface/search/keyboard.css';

import './interface/route/field.css';
import './interface/route/head.css';
import './interface/route/groups.css';
import './interface/route/item.css';
import './interface/route/thread.css';
import './interface/route/index.css';

import './interface/route/details/field.css';
import './interface/route/details/head.css';
import './interface/route/details/body.css';
import './interface/route/details/groups.css';
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

import './interface/notification-schedule-manager/field.css';
import './interface/notification-schedule-manager/head.css';
import './interface/notification-schedule-manager/body.css';
import './interface/notification-schedule-manager/list.css';
import './interface/notification-schedule-manager/item.css';

import './interface/register-notification/field.css';
import './interface/register-notification/head.css';
import './interface/register-notification/body.css';
import './interface/register-notification/groups.css';
import './interface/register-notification/provider.css';
import './interface/register-notification/registration-key.css';

import './interface/schedule-notification/field.css';
import './interface/schedule-notification/head.css';
import './interface/schedule-notification/body.css';
import './interface/schedule-notification/list.css';
import './interface/schedule-notification/item.css';

import './interface/data-usage/field.css';
import './interface/data-usage/head.css';
import './interface/data-usage/body.css';
import './interface/data-usage/chart.css';
import './interface/data-usage/statistics.css';

import './interface/storage/field.css';
import './interface/storage/head.css';
import './interface/storage/body.css';
import './interface/storage/statistics.css';

import './interface/qrcode/field.css';
import './interface/qrcode/head.css';
import './interface/qrcode/body.css';
import './interface/qrcode/qrcode.css';

import './interface/prompt/index.css';

let busInitialized = false;
let busSecondlyInitialized = false;

window.bus = {
  initialize: function () {
    if (busInitialized === false) {
      busInitialized = true;
      setSplashScreenIconOffsetY();
      initializeSettings().then(function () {
        setUpRecentViewsFieldSkeletonScreen();
        setUpFolderFieldSkeletonScreen();
        checkAppVersion()
          .then((status) => {
            if (status === 'ok') {
              initializeRouteSliding();
              initializeLocationSliding();
              resizeSearchInputCanvas();
              window.addEventListener('resize', () => {
                resizeSearchInputCanvas();
              });
              if (screen) {
                if (screen.orientation) {
                  screen.orientation.addEventListener('change', () => {
                    resizeSearchInputCanvas();
                  });
                }
              }
              initializeRecentViews();
              initializeFolderList().then(() => {
                initializeFolders();
              });
              const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
              const searchInputElement = documentQuerySelector('.css_search_field .css_search_head .css_search_search_input #search_input') as HTMLInputElement;
              mediaQuery.addEventListener('change', function () {
                updateSearchInput(searchInputElement.selectionStart, searchInputElement.selectionEnd);
              });
              searchInputElement.addEventListener('paste', function () {
                updateSearchResult();
                updateSearchInput(searchInputElement.selectionStart, searchInputElement.selectionEnd);
              });
              searchInputElement.addEventListener('cut', function () {
                updateSearchResult();
                updateSearchInput(searchInputElement.selectionStart, searchInputElement.selectionEnd);
              });
              searchInputElement.addEventListener('selectionchange', function () {
                updateSearchResult();
                updateSearchInput(searchInputElement.selectionStart, searchInputElement.selectionEnd);
              });
              document.addEventListener('selectionchange', function () {
                updateSearchResult();
                updateSearchInput(searchInputElement.selectionStart, searchInputElement.selectionEnd);
              });
              searchInputElement.addEventListener('keyup', function () {
                updateSearchResult();
                updateSearchInput(searchInputElement.selectionStart, searchInputElement.selectionEnd);
              });

              const searchMaterialSymbolsInputElement = documentQuerySelector('.css_folder_icon_selector_field .css_folder_icon_selector_head .css_folder_icon_selector_search_input #search_material_symbols_input') as HTMLInputElement;
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
                loadNotificationClient();
                initializeNotificationSchedules().then(function () {
                  discardExpiredNotificationSchedules();
                });
                document.addEventListener(
                  'click',
                  function () {
                    askForPositioningPermission();
                    askForCalibratingPermission();
                  },
                  { once: true }
                );
              });
            }
            if (status === 'fetchError' || status === 'unknownError') {
              showErrorMessage();
              fadeOutSplashScreen();
              // alert(status);
            }
          })
          .catch((error) => {
            showErrorMessage();
            fadeOutSplashScreen();
            // alert(error);
          });
      });
    }
  },
  secondlyInitialize: function () {
    if (!busSecondlyInitialized) {
      busSecondlyInitialized = true;
      downloadData();
      discardExpiredUpdateRateDataGroups();
      discardExpiredDataUsageStats();
      recoverBusArrivalTimeDataFromWriteAheadLog();
      discardExpiredRecentViews();
      discardExpiredUpdateRateDataGroups().then(function () {
        initializeUpdateRateDataGroups().then(function () {
          recoverUpdateRateDataFromWriteAheadLog();
        });
      });
    }
  },
  route: {
    stretchRouteItem,
    openRoute,
    closeRoute,
    switchRoute,
    switchRouteBodyTab,
    closeRouteDetails,
    shareRoutePermalink,
    showRoutePermalinkQRCode,
    switchCalendarDay
  },
  location: {
    openLocation,
    closeLocation,
    stretchLocationItem,
    switchLocationBodyTab
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
    saveStopItemOnLocation,
    saveRouteOnDetailsPage,
    saveRouteOnRoute,
    removeItemOnFolderEditor,
    moveItemOnFolderEditor
  },
  search: {
    openSearch,
    closeSearch,
    typeTextIntoInput,
    deleteCharFromInout,
    emptyInput,
    openSystemKeyboard,
    switchSearchTypeFilter
  },
  storage: {
    openStorage,
    closeStorage
  },
  dataUsage: {
    openDataUsage,
    closeDataUsage
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
    openNotificationScheduleManager,
    closeNotificationScheduleManager,
    openRegisterNotification,
    closeRegisterNotification,
    saveFormulatedRegisterNotification,
    openScheduleNotification,
    closeScheduleNotification,
    scheduleNotificationForStopItemOnRoute,
    scheduleNotificationForStopItemOnLocation,
    cancelNotificationOnNotificationScheduleManager
  },
  qrcode: {
    openQRCode,
    closeQRCode
  }
};

export default window.bus;
