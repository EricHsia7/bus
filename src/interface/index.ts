var splashScreenTimer = {
  minimalTimeOut: 1024,
  openTime: new Date().getTime()
};

export function fadeOutSplashScreen() {
  function fadeOut() {
    var element: HTMLElement = document.querySelector('.splash-screen');
    element.classList.add('splash-screen-fade-out');
    element.addEventListener(
      'animationend',
      function () {
        element.style.display = 'none';
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
  element: HTMLElement,
  id:string
}
