var routeOptionsBox: HTMLElement = document.querySelector('.route_options_box');

export function initializeRouteOptions(): void {
  document.documentElement.addEventListener('click', function () {
    routeOptionsBox.setAttribute('displayed', true);
    routeOptionsBox.scrollTo({
      top: window.innerHeight * 0.4,
      left: 0,
      behavior: 'instant'
    });
  });
  routeOptionsBox.addEventListener('scroll', function () {
    if (routeOptionsBox.scrollTop < Math.pow(10, -3)) {
      routeOptionsBox.setAttribute('displayed', false);
    }
  });
}
