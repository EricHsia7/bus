import { documentQuerySelector } from '../../tools/elements';

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

interface AppVersion {
  build: number;
  hash: string;
  full_hash: string;
  branch_name: string; // branch name of the code base
  timestamp: string; // timestamp in ISO fromat
}

async function getAppVersion(): Promise<AppVersion | false> {
  try {
    const response = await fetch(`./version.json?_=${new Date().getTime()}`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return false;
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

type AppVersionStatus = 'fetchError' | 'unknownError' | 'refreshing' | 'ok';

export async function checkAppVersion(): Promise<AppVersionStatus> {
  const appVersion = await getAppVersion();
  if (typeof appVersion === 'boolean') {
    if (appVersion === false) {
      return 'fetchError';
    } else {
      return 'unknownError';
    }
  } else {
    if (getHTMLVersionHash() !== appVersion.hash) {
      refreshPageWithTimeStamp(appVersion.hash, true);
      return 'refreshing';
    } else {
      refreshPageWithTimeStamp(appVersion.hash, false);
      return 'ok';
    }
  }
}
