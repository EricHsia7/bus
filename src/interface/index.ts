import { documentQuerySelector } from '../tools/elements';
import { isRunningStandalone } from '../tools/index';
import { hideBus, showBus } from './bus/index';
import { hideDataUsage, showDataUsage } from './data-usage/index';
import { hideFolderCreator, showFolderCreator } from './folder-creator/index';
import { hideFolderEditor, showFolderEditor } from './folder-editor/index';
import { hideFolderManager, showFolderManager } from './folder-manager/index';
import { hideHome, showHome } from './home/index';
import { hideIconSelector, showIconSelector } from './icon-selector/index';
import { hideLocationDetails, showLocationDetails } from './location/details/index';
import { hideLocation, showLocation } from './location/index';
import { hideNotificationScheduleManager, showNotificationScheduleManager } from './notification-schedule-manager/index';
import { hidePersonalScheduleCreator, showPersonalScheduleCreator } from './personal-schedule-creator/index';
import { hidePersonalScheduleEditor, showPersonalScheduleEditor } from './personal-schedule-editor/index';
import { hidePersonalScheduleManager, showPersonalScheduleManager } from './personal-schedule-manager/index';
import { hideQRCode, showQRCode } from './qrcode/index';
import { hideRegisterNotification, showRegisterNotification } from './register-notification/index';
import { hideRouteDetails, showRouteDetails } from './route/details/index';
import { hideRoute, showRoute } from './route/index';
import { hideSaveToFolder, showSaveToFolder } from './save-to-folder/index';
import { hideScheduleNotification, showScheduleNotification } from './schedule-notification/index';
import { hideSearch, showSearch } from './search/index';
import { hideSettings, shwoSettings } from './settings/index';
import { hideSettingsOptions, showSettingsOptions } from './settings/options';
import { hideStorage, showStorage } from './storage/index';

const SplashScreenElement = documentQuerySelector('.css_splash_screen');
const ErrorMessageElement = documentQuerySelector('.css_error_message');

const splashScreenTimer_minimalTimeOut = 100;
const splashScreenTimer_openTime = new Date().getTime();

type Page = 'Home' | 'FolderCreator' | 'FolderEditor' | 'IconSelector' | 'FolderManager' | 'LocationDetails' | 'Location' | 'RouteDetails' | 'Route' | 'SaveToFolder' | 'Search' | 'Settings' | 'SettingsOptions' | 'DataUsage' | 'PersonalScheduleManager' | 'PersonalScheduleCreator' | 'PersonalScheduleEditor' | 'Bus' | 'RegisterNotification' | 'ScheduleNotification' | 'NotificationScheduleManager' | 'QRCode' | 'Storage';

export type PageTransitionDirection = 'ltr' | 'rtl';

let pageHistory: Array<Page> = ['Home'];

export function pushPageHistory(page: Page): void {
  const pageHistoryLength = pageHistory.length;
  const lastPage = pageHistory[pageHistoryLength - 1];
  if (lastPage !== page) {
    pageHistory.push(page);
  }
}

export function revokePageHistory(page: Page): void {
  const pageHistoryLength = pageHistory.length;
  if (pageHistoryLength > 1) {
    if (pageHistory[pageHistoryLength - 1] === page) {
      pageHistory.pop();
    }
  }
}

export function hidePreviousPage(): void {
  const pageHistoryLength = pageHistory.length;
  if (pageHistoryLength > 1) {
    const previousPage = pageHistory[pageHistoryLength - 2];
    switch (previousPage) {
      case 'Home':
        hideHome('rtl');
        break;
      case 'FolderCreator':
        hideFolderCreator('rtl');
        break;
      case 'FolderEditor':
        hideFolderEditor('rtl');
        break;
      case 'IconSelector':
        hideIconSelector('rtl');
        break;
      case 'FolderManager':
        hideFolderManager('rtl');
        break;
      case 'Location':
        hideLocation('rtl');
        break;
      case 'LocationDetails':
        hideLocationDetails('rtl');
        break;
      case 'Route':
        hideRoute('rtl');
        break;
      case 'RouteDetails':
        hideRouteDetails('rtl');
        break;
      case 'SaveToFolder':
        hideSaveToFolder('rtl');
        break;
      case 'Search':
        hideSearch('rtl');
        break;
      case 'Settings':
        hideSettings('rtl');
        break;
      case 'SettingsOptions':
        hideSettingsOptions('rtl');
        break;
      case 'DataUsage':
        hideDataUsage('rtl');
        break;
      case 'PersonalScheduleManager':
        hidePersonalScheduleManager('rtl');
        break;
      case 'PersonalScheduleCreator':
        hidePersonalScheduleCreator('rtl');
        break;
      case 'PersonalScheduleEditor':
        hidePersonalScheduleEditor('rtl');
        break;
      case 'Bus':
        hideBus('rtl');
        break;
      case 'RegisterNotification':
        hideRegisterNotification('rtl');
        break;
      case 'ScheduleNotification':
        hideScheduleNotification('rtl');
        break;
      case 'NotificationScheduleManager':
        hideNotificationScheduleManager('rtl');
        break;
      case 'QRCode':
        hideQRCode('rtl');
        break;
      case 'Storage':
        hideStorage('rtl');
        break;
      default:
        break;
    }
  }
}

export function showPreviousPage(): void {
  const pageHistoryLength = pageHistory.length;
  if (pageHistoryLength > 1) {
    const previousPage = pageHistory[pageHistoryLength - 2];
    switch (previousPage) {
      case 'Home':
        showHome('ltr');
        break;
      case 'FolderCreator':
        showFolderCreator('ltr');
        break;
      case 'FolderEditor':
        showFolderEditor('ltr');
        break;
      case 'IconSelector':
        showIconSelector('ltr');
        break;
      case 'FolderManager':
        showFolderManager('ltr');
        break;
      case 'Location':
        showLocation('ltr');
        break;
      case 'LocationDetails':
        showLocationDetails('ltr');
        break;
      case 'Route':
        showRoute('ltr');
        break;
      case 'RouteDetails':
        showRouteDetails('ltr');
        break;
      case 'SaveToFolder':
        showSaveToFolder('ltr');
        break;
      case 'Search':
        showSearch('ltr');
        break;
      case 'Settings':
        shwoSettings('ltr');
        break;
      case 'SettingsOptions':
        showSettingsOptions('ltr');
        break;
      case 'DataUsage':
        showDataUsage('ltr');
        break;
      case 'PersonalScheduleManager':
        showPersonalScheduleManager('ltr');
        break;
      case 'PersonalScheduleCreator':
        showPersonalScheduleCreator('ltr');
        break;
      case 'PersonalScheduleEditor':
        showPersonalScheduleEditor('ltr');
        break;
      case 'Bus':
        showBus('ltr');
        break;
      case 'RegisterNotification':
        showRegisterNotification('ltr');
        break;
      case 'ScheduleNotification':
        showScheduleNotification('ltr');
        break;
      case 'NotificationScheduleManager':
        showNotificationScheduleManager('ltr');
        break;
      case 'QRCode':
        showQRCode('ltr');
        break;
      case 'Storage':
        showStorage('ltr');
        break;
      default:
        break;
    }
  }
}

export function setSplashScreenIconOffsetY(): void {
  let offset = 0;
  if (isRunningStandalone()) {
    offset = (-1 * (window.outerHeight - window.innerHeight)) / 2;
  }
  documentQuerySelector('.css_splash_screen svg.css_splash_screen_icon').style.setProperty('--b-cssvar-splash-screen-icon-offset-y', `${offset}px`);
}

export function fadeOutSplashScreen(callback: Function): void {
  function fadeOut() {
    SplashScreenElement.classList.add('css_splash_screen_fade_out');
    SplashScreenElement.addEventListener(
      'animationend',
      function () {
        SplashScreenElement.setAttribute('displayed', 'false');
        SplashScreenElement.classList.remove('css_splash_screen_fade_out');
        if (typeof callback === 'function') {
          callback();
        }
      },
      { once: true }
    );
  }
  const cureentTime = new Date().getTime();
  if (cureentTime - splashScreenTimer_openTime < splashScreenTimer_minimalTimeOut) {
    setTimeout(fadeOut, Math.max(1, cureentTime - splashScreenTimer_openTime));
  } else {
    fadeOut();
  }
}

export function showErrorMessage(): void {
  ErrorMessageElement.setAttribute('displayed', 'true');
}

export type GroupStyles = {
  [groupKey: string]: {
    width: number;
    offset: number;
  };
};

export interface Size {
  width: number;
  height: number;
}

type SizeType = 'window' | 'head' | 'head-one-button' | 'head-two-button' | 'route-details-canvas' | 'route-bus-arrival-time-chart' | 'location-bus-arrival-time-chart';

export function querySize(type: SizeType): Size {
  let width: number = 0;
  let height: number = 0;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  switch (type) {
    case 'window':
      width = windowWidth;
      height = windowHeight;
      break;
    case 'head':
      width = windowWidth;
      height = 55;
      break;
    case 'head-one-button':
      width = windowWidth - 55;
      height = 55;
      break;
    case 'head-two-button':
      width = windowWidth - 55 * 2;
      height = 55;
      break;
    case 'route-details-canvas':
      width = windowWidth - 10 * 2 - 10 * 2;
      height = 24 * 70;
      break;
    case 'route-bus-arrival-time-chart':
      width = windowWidth - 45 - 15 - 20;
      height = 75;
      break;
    case 'location-bus-arrival-time-chart':
      width = windowWidth - 30 - 20;
      height = 75;
      break;
    default:
      width = 0;
      height = 0;
      break;
  }
  return {
    width,
    height
  };
}

export function scrollDocumentToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: 'instant'
  });
}
