import { lfSetItem, lfGetItem } from '../storage/index.ts';

function refreshPageWithTimestamp(id) {
  // Get the URLSearchParams object from the current URL
  var searchParams = new URLSearchParams(window.location.search);
  // Set the 'timestamp' query parameter to the current timestamp
  searchParams.set('v', id);
  // Construct the new URL with updated query parameters
  var newUrl = window.location.pathname + '?' + searchParams.toString();
  // Redirect to the new URL
  window.location.href = newUrl;
}

async function getAppVersion(): object {
  try {
    var response = await fetch(`./version.json?_=${new Date().getTime()}`);
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
async function saveAppVersion(): void {
  var app_version = await getAppVersion();
  if (app_version) {
    var existing_app_version = await lfGetItem(1, 'app_version');
    if (existing_app_version) {
      existing_app_version_object = JSON.parse(existing_app_version);
      if (!(existing_app_version.id === app_version.id)) {
        await lfSetItem(1, 'app_version', JSON.stringify(app_version));
        refreshPageWithTimestamp(app_version.id);
      }
      await lfSetItem(1, 'app_version', JSON.stringify(app_version));
    }
  }
}
