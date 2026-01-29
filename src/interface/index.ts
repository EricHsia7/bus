import { documentQuerySelector } from '../tools/elements';
import { isRunningStandalone } from '../tools/index';
import { closeBus, openBus } from './bus/index';
import { closeFolderCreator, openFolderCreator } from './folder-creator/index';
import { closeFolderEditor, openFolderEditor } from './folder-editor/index';
import { closeFolderManager, openFolderManager } from './folder-manager/index';
import { closePersonalScheduleEditor, openPersonalScheduleEditor } from './personal-schedule-editor/index';
import { closePersonalScheduleManager, openPersonalScheduleManager } from './personal-schedule-manager/index';
import { closeRegisterNotification, openRegisterNotification } from './register-notification/index';
import { closeSearch, openSearch } from './search/index';
import { closeSettings, openSettings } from './settings/index';

const SplashScreenElement = documentQuerySelector('.css_splash_screen');
const ErrorMessageElement = documentQuerySelector('.css_error_message');

const splashScreenTimer_minimalTimeOut = 100;
const splashScreenTimer_openTime = new Date().getTime();

type Page = 'Home' | 'FolderCreator' | 'FolderEditor' | 'FolderIconSelector' | 'FolderManager' | 'LocationDetails' | 'Location' | 'RouteDetails' | 'Route' | 'SaveToFolder' | 'Search' | 'Settings' | 'SettingsOptions' | 'DataUsage' | 'PersonalScheduleManager' | 'PersonalScheduleCreator' | 'PersonalScheduleEditor' | 'Bus' | 'RegisterNotification' | 'ScheduleNotification' | 'NotificationScheduleManager' | 'QRCode';

let pageHistory: Array<Page> = ['Home'];

export function pushPageHistory(page: Page): void {
  const pageHistoryLength = pageHistory.length;
  const lastPage = pageHistory[pageHistoryLength - 1];
  if (lastPage !== page) {
    pageHistory.push(page);
  }
}

export function revokePageHistory(page: Page): void {
  if (pageHistory.indexOf(page) > -1) {
    const pageHistoryLength = pageHistory.length;
    if (pageHistory[pageHistoryLength - 1] === page) {
      pageHistory.pop();
    }
  }
}

export function closePreviousPage(): void {
  const pageHistoryLength = pageHistory.length;
  if (pageHistoryLength > 1) {
    const previousPage = pageHistory[pageHistoryLength - 2];
    switch (previousPage) {
      case 'Home':
        break;
      case 'FolderCreator':
        closeFolderCreator();
        break;
      case 'FolderEditor':
        closeFolderEditor();
        break;
      case 'FolderIconSelector':
        break;
      case 'FolderManager':
        closeFolderManager();
        break;
      case 'Location':
        break;
      case 'LocationDetails':
        break;
      case 'Route':
        break;
      case 'RouteDetails':
        break;
      case 'SaveToFolder':
        break;
      case 'Search':
        closeSearch();
        break;
      case 'Settings':
        closeSettings();
        break;
      case 'SettingsOptions':
        break;
      case 'DataUsage':
        break;
      case 'PersonalScheduleManager':
        closePersonalScheduleManager();
        break;
      case 'PersonalScheduleCreator':
        break;
      case 'PersonalScheduleEditor':
        closePersonalScheduleEditor();
        break;
      case 'Bus':
        closeBus();
        break;
      case 'RegisterNotification':
        closeRegisterNotification();
        break;
      case 'ScheduleNotification':
        break;
      case 'NotificationScheduleManager':
        break;
      case 'QRCode':
        break;
      default:
        break;
    }
  }
}

export function openPreviousPage(): void {
  const pageHistoryLength = pageHistory.length;
  if (pageHistoryLength > 1) {
    const previousPage = pageHistory[pageHistoryLength - 2];
    pageHistory.pop();
    switch (previousPage) {
      case 'Home':
        break;
      case 'FolderCreator':
        openFolderCreator();
        break;
      case 'FolderEditor':
        openFolderEditor();
        break;
      case 'FolderIconSelector':
        break;
      case 'FolderManager':
        openFolderManager();
        break;
      case 'Location':
        break;
      case 'LocationDetails':
        break;
      case 'Route':
        break;
      case 'RouteDetails':
        break;
      case 'SaveToFolder':
        break;
      case 'Search':
        openSearch();
        break;
      case 'Settings':
        openSettings();
        break;
      case 'SettingsOptions':
        break;
      case 'DataUsage':
        break;
      case 'PersonalScheduleManager':
        openPersonalScheduleManager();
        break;
      case 'PersonalScheduleCreator':
        break;
      case 'PersonalScheduleEditor':
        openPersonalScheduleEditor();
        break;
      case 'Bus':
        openBus();
        break;
      case 'RegisterNotification':
        openRegisterNotification();
        break;
      case 'ScheduleNotification':
        break;
      case 'NotificationScheduleManager':
        break;
      case 'QRCode':
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
  [key: string]: {
    width: number;
    offset: number;
  };
};

export type SizeType = 'window' | 'head' | 'head_one_button' | 'head_two_button' | 'route_details_canvas' | 'route_bus_arrival_time_chart' | 'location_bus_arrival_time_chart';

export type Size = [width: number, height: number];

export type SizesMap = {
  [sizeType: string]: Size;
};

const Sizes: SizesMap = {
  window: [0, 0],
  head: [0, 0],
  head_one_button: [0, 0],
  head_two_button: [0, 0],
  route_details_canvas: [0, 0],
  route_bus_arrival_time_chart: [0, 0],
  location_bus_arrival_time_chart: [0, 0]
};

export function updateSizes(): void {
  const w = window.innerWidth;
  const h = window.innerHeight;
  Sizes.window = [w, h];
  Sizes.head = [w, 55];
  Sizes.head_one_button = [w - 55, 55];
  Sizes.head_two_button = [w - 55 * 2, 55];
  Sizes.route_details_canvas = [w - 10 * 2 - 10 * 2, 24 * 70];
  Sizes.route_bus_arrival_time_chart = [w - 45 - 15 - 20, 75];
  Sizes.location_bus_arrival_time_chart = [w - 30 - 20, 75];
}

export function getSize(sizeType: SizeType): Size {
  return Sizes[sizeType];
}

export function scrollDocumentToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: 'instant'
  });
}
