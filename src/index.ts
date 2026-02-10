import { recoverBusArrivalTimeDataFromWriteAheadLog } from './data/analytics/bus-arrival-time/index';
import { discardExpiredDataUsageStats } from './data/analytics/data-usage/index';
import { discardUpdateRateDataGroups, initializeUpdateRateDataGroups, recoverUpdateRateDataFromWriteAheadLog } from './data/analytics/update-rate/index';
import { initializeFolderList } from './data/folder/index';
import { discardExpiredNotificationSchedules, initializeNotificationSchedules, loadNotificationClient } from './data/notification/index';
import { discardExpiredRecentViews } from './data/recent-views/index';
import { initializeSettings } from './data/settings/index';
import { checkAppVersion } from './data/settings/version';
import { askForCalibratingPermission } from './data/user-orientation/index';
import { askForPositioningPermission } from './data/user-position/index';
import { closeBus } from './interface/bus/index';
import { closeDataUsage } from './interface/data-usage/index';
import { closeFolderCreator } from './interface/folder-creator/index';
import { closeIconSelector, initializeIconSelectorSearchInput } from './interface/icon-selector/index';
import { closeFolderManager } from './interface/folder-manager/index';
import { initializeFolders, setupFolderFieldSkeletonScreen } from './interface/home/folders/index';
import { downloadData } from './interface/home/index';
import { initializeRecentViews, setupRecentViewsFieldSkeletonScreen } from './interface/home/recent-views/index';
import { fadeOutSplashScreen, setSplashScreenIconOffsetY, showErrorMessage } from './interface/index';
import { closeLocationDetails } from './interface/location/details/index';
import { closeLocation, initializeLocationSliding } from './interface/location/index';
import { closeNotificationScheduleManager } from './interface/notification-schedule-manager/index';
import { closePersonalScheduleCreator, createFormulatedPersonalSchedule, openPersonalScheduleCreator, switchPersonalScheduleCreatorDay } from './interface/personal-schedule-creator/index';
import { closePersonalScheduleEditor, openPersonalScheduleEditor, saveEditedPersonalSchedule, switchPersonalScheduleEditorDay } from './interface/personal-schedule-editor/index';
import { closePersonalScheduleManager } from './interface/personal-schedule-manager/index';
import { closeQRCode } from './interface/qrcode/index';
import { openRegisterNotification } from './interface/register-notification/index';
import { closeRouteDetails } from './interface/route/details/index';
import { closeRoute, initializeRouteSliding } from './interface/route/index';
import { closeSaveToFolder } from './interface/save-to-folder/index';
import { closeScheduleNotification } from './interface/schedule-notification/index';
import { closeSearch, initializeSearchInput, openSearch, resizeSearchInputSVG, switchSearchTypeFilter } from './interface/search/index';
import { closeSettings, openSettings } from './interface/settings/index';
import { closeSettingsOptions } from './interface/settings/options';
import { closeStorage } from './interface/storage/index';
import { openPermalink } from './tools/permalink';

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

import './interface/location/details/field.css';
import './interface/location/details/head.css';
import './interface/location/details/body.css';
import './interface/location/details/actions.css';
import './interface/location/details/index.css';

import './interface/bus/field.css';
import './interface/bus/head.css';
import './interface/bus/body.css';
import './interface/bus/groups.css';
import './interface/bus/properties.css';

import './interface/settings/field.css';
import './interface/settings/head.css';
import './interface/settings/body.css';
import './interface/settings/items.css';
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

import './interface/icon-selector/field.css';
import './interface/icon-selector/head.css';
import './interface/icon-selector/body.css';
import './interface/icon-selector/symbols.css';
import './interface/icon-selector/index.css';

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
import './interface/storage/index.css';

import './interface/qrcode/field.css';
import './interface/qrcode/head.css';
import './interface/qrcode/body.css';
import './interface/qrcode/qrcode.css';

import './interface/prompt/index.css';

let busInitialized = false;
let busSecondlyInitialized = false;

window.bus = {
  initialize: async function () {
    if (busInitialized) return;
    busInitialized = true;

    setSplashScreenIconOffsetY();

    // initialize settings
    await initializeSettings();

    // initalize folder list
    await initializeFolderList();

    // setup skeleton screen
    setupRecentViewsFieldSkeletonScreen();
    setupFolderFieldSkeletonScreen();

    // check app version
    const status = await checkAppVersion();
    if (status === 'ok') {
      // handle permanent link
      openPermalink();

      // initialize recent views
      initializeRecentViews();

      // initialize folders
      initializeFolders();

      // initialize sliding
      initializeRouteSliding();
      initializeLocationSliding();

      // initialize search inputs
      initializeSearchInput();
      initializeIconSelectorSearchInput();

      // handle window resize
      resizeSearchInputSVG();

      window.addEventListener('resize', () => {
        resizeSearchInputSVG();
      });

      if (screen in self) {
        if (screen.orientation) {
          screen.orientation.addEventListener('change', () => {
            resizeSearchInputSVG();
          });
        }
      }

      fadeOutSplashScreen(function () {
        document.addEventListener(
          'click',
          function () {
            askForPositioningPermission();
            askForCalibratingPermission();
          },
          { once: true }
        );
      });
    } else if (status === 'fetchError' || status === 'unknownError') {
      showErrorMessage();
      fadeOutSplashScreen();
    }
  },
  secondlyInitialize: async function () {
    if (busSecondlyInitialized) return;
    busSecondlyInitialized = true;

    await loadNotificationClient();
    await initializeNotificationSchedules();
    await discardExpiredNotificationSchedules();

    await downloadData();

    await recoverBusArrivalTimeDataFromWriteAheadLog();

    await discardUpdateRateDataGroups();
    await discardExpiredRecentViews();
    await discardExpiredDataUsageStats();

    await initializeUpdateRateDataGroups();
    await recoverUpdateRateDataFromWriteAheadLog();
  },
  route: {
    closeRoute,
    closeRouteDetails
  },
  location: {
    closeLocation,
    closeLocationDetails
  },
  folder: {
    closeSaveToFolder,
    closeFolderManager,
    closeIconSelector,
    closeFolderCreator
  },
  search: {
    openSearch,
    closeSearch,
    switchSearchTypeFilter
  },
  storage: {
    closeStorage
  },
  dataUsage: {
    closeDataUsage
  },
  personalSchedule: {
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
    closeSettingsOptions
  },
  bus: {
    closeBus
  },
  notification: {
    closeNotificationScheduleManager,
    openRegisterNotification,
    closeScheduleNotification
  },
  qrcode: {
    closeQRCode
  }
};

export default window.bus;
