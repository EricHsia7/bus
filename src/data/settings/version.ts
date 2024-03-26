import { lfSetItem, lfGetItem } from '../storage/index.ts';

function refreshPageWithTimeStamp(id: string, enforce: boolean = false): void {
  // Get the URLSearchParams object from the current URL
  var searchParams = new URLSearchParams(window.location.search);
  // Set the 'timestamp' query parameter to the current timestamp
  searchParams.set('v', id);
  // Construct the new URL with updated query parameters
  var newUrl = window.location.pathname + '?' + searchParams.toString();
  if(enforce) {
// Redirect to the new URL
  window.location.href = newUrl;
}
else {
history.replaceState(null, "", newUrl);
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

export async function checkAppVersion(): void | string {
  var app_version = await getAppVersion();
  if (app_version) {
    var existing_app_version = await lfGetItem(1, 'app_version');
    if (existing_app_version) {
      var existing_app_version_object = JSON.parse(existing_app_version);
      if (!(existing_app_version_object.id === app_version.id)) {
        await lfSetItem(1, 'app_version', JSON.stringify(app_version));
        refreshPageWithTimeStamp(app_version.id, true);
        return '';
      }
      else {
        refreshPageWithTimeStamp(app_version.id, false);
}
    }
    await lfSetItem(1, 'app_version', JSON.stringify(app_version));
    return '';
  }
  return '';
}
