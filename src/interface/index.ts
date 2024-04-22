import { documentQuerySelector } from '../tools/query-selector.ts';

var splashScreenTimer = {
  minimalTimeOut: 1024,
  openTime: new Date().getTime()
};

export function fadeOutSplashScreen(callback: Function): void {
  function fadeOut() {
    var element: HTMLElement = documentQuerySelector('.splash-screen');
    element.classList.add('splash-screen-fade-out');
    element.addEventListener(
      'animationend',
      function () {
        element.style.display = 'none';
        if (typeof callback === 'function') {
          callback();
        }
      },
      { once: true }
    );
  }
  const cureentTime = new Date().getTime();
  if (cureentTime - splashScreenTimer.openTime < splashScreenTimer.minimalTimeOut) {
    setTimeout(fadeOut, Math.max(1, cureentTime - splashScreenTimer.openTime));
  } else {
    fadeOut();
  }
}

export interface GeneratedElement {
  element: HTMLElement;
  id: string;
}

export interface FieldSize {
  width: number;
  height: number;
}
