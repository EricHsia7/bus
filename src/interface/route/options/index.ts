var routeOptionsBox: HTMLElement = document.querySelector('.route_options_box');

export function initializeRouteOptions(): void {
  routeOptionsBox.addEventListener('scroll', function () {
    if (routeOptionsBox.scrollTop < Math.pow(10, -3)) {
      routeOptionsBox.setAttribute('displayed', false);
    }
  });
}

export function openRouteOptions(): void {
  routeOptionsBox.setAttribute('displayed', true);
  routeOptionsBox.scrollTo({
    top: window.innerHeight * 0.4,
    left: 0,
    behavior: 'instant'
  });
}
