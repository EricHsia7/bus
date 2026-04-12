import { documentQuerySelector } from '../../tools/elements';

export function getHTMLVersionHash(): string {
  return documentQuerySelector('head meta[name="version-hash"]').getAttribute('content') || '';
}

export function getHTMLVersionFullHash(): string {
  return documentQuerySelector('head meta[name="version-full-hash"]').getAttribute('content') || '';
}

export function getHTMLVersionBranchName(): string {
  return documentQuerySelector('head meta[name="version-branch-name"]').getAttribute('content') || '';
}

export function getTreeURLOfCurrentVersion(): string {
  const currentFullHash = getHTMLVersionFullHash();
  return `https://github.com/EricHsia7/bus/tree/${currentFullHash}`;
}

export function getHTMLVersionTimeStamp(): string {
  return documentQuerySelector('head meta[name="version-time-stamp"]').getAttribute('content') || '';
}
