import { documentQuerySelector } from '../../tools/query-selector';

function refreshPageWithTimeStamp(id: string, enforce: boolean = false): void {
  // Get the URLSearchParams object from the current URL
  const searchParams = new URLSearchParams(window.location.search);
  // Set the 'timestamp' query parameter to the current timestamp
  searchParams.set('v', id);
  // Construct the new URL with updated query parameters
  const newUrl = window.location.pathname + '?' + searchParams.toString();
  if (enforce) {
    // Redirect to the new URL
    window.location.replace(newUrl);
  } else {
    history.replaceState(null, '', newUrl);
  }
}

async function getAppVersion(): Promise<object> {
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
      hash: null,
      fullHash: null,
      branchName: null
    };
  }
}

export function getHTMLVersionHash(): string {
  return documentQuerySelector('head meta[name="version-hash"]').getAttribute('content');
}

export function getHTMLVersionFullHash(): string {
  return documentQuerySelector('head meta[name="version-full-hash"]').getAttribute('content');
}

export function getHTMLVersionBranchName(): string {
  return documentQuerySelector('head meta[name="version-branch-name"]').getAttribute('content');
}

export function getCommitURLOfCurrentVersion(): string {
  const currentFullHash = getHTMLVersionFullHash();
  return `https://github.com/EricHsia7/bus/commit/${currentFullHash}`;
}

export function getHTMLVersionTimeStamp(): string {
  return documentQuerySelector('head meta[name="version-time-stamp"]').getAttribute('content');
}

export async function checkAppVersion(): Promise<object> {
  var app_version = await getAppVersion();
  if (app_version) {
    if (!(app_version.hash === null)) {
      if (!(getHTMLVersionHash() === app_version.hash)) {
        refreshPageWithTimeStamp(app_version.hash, true);
        return { status: 'refreshing' };
      } else {
        refreshPageWithTimeStamp(app_version.hash, false);
        return { status: 'ok' };
      }
    } else {
      return { status: 'fetchError' };
    }
  } else {
    return { status: 'unknownError' };
  }
}
