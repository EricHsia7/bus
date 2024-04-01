import { lfSetItem, lfGetItem } from '../storage/index.ts';

function refreshPageWithTimeStamp(id: string, enforce: boolean = false): void {
  // Get the URLSearchParams object from the current URL
  var searchParams = new URLSearchParams(window.location.search);
  // Set the 'timestamp' query parameter to the current timestamp
  searchParams.set('v', id);
  // Construct the new URL with updated query parameters
  var newUrl = window.location.pathname + '?' + searchParams.toString();
  if (enforce) {
    // Redirect to the new URL
    window.location.replace(newUrl);
  } else {
    history.replaceState(null, '', newUrl);
  }
}

async function getAppVersion(): object {
  try {
    var response = await fetch(`./version.json?_=${new Date().getTime()}`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return {
      build: null,
      id: null
    };
  }
}

export async function checkAppVersion(): object {
  var app_version = await getAppVersion();
  if (app_version) {
    if (!(app_version.id === null)) {
      if (!(document.querySelector('head meta[name="version"]').getAttribute('content') === app_version.id)) {
        refreshPageWithTimeStamp(app_version.id, true);
        return { status: 'refreshing' };
      } else {
        refreshPageWithTimeStamp(app_version.id, false);
        return { status: 'ok' };
      }
    } else {
      return { status: 'fetchError' };
    }
  } else {
    return { status: 'unknownError' };
  }
}
