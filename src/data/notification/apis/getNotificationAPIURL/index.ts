import { NResponse } from '../../index';

export function getNotificationAPIURL(method: NResponse['method']): string | false {
  if (provider === '') {
    return false;
  }
  const url = new URL(provider);
  if (['cancel', 'register', 'schedule', 'rotate', 'reschedule'].indexOf(method) > -1) {
    url.searchParams.set('method', method);
    return url.toString();
  } else {
    return false;
  }
}
