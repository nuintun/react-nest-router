/**
 * @module url
 */

import { isAbsolute, normalize } from './path';

/**
 * @function safelyDecodeURIComponent
 * @description Safely decode URI component.
 * @param value The value to decode.
 */
export function safelyDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * @function parseURL
 * @description Parse URL.
 * @param path URL path.
 */
export function parseURL(path: string): [origin: string, pathname: string, search: string, hash: string] {
  const matched = path.match(/^((?:[a-z0-9.+-]+:)?\/\/[^/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/i);

  if (matched) {
    const [, origin = '', pathname, search = '', hash = ''] = matched;

    return [origin, pathname, search, hash];
  }

  return ['', '', '', ''];
}

/**
 * @function createURL
 * @description Create URL.
 * @param basename Location basename.
 * @param pathname Location pathname.
 * @param to Location to.
 * @param search Location search.
 * @param hash Location hash.
 */
export function createURL(basename: string, pathname: string, to: string, search: string, hash: string): string {
  to = normalize(to);

  if (to === '') return pathname;

  if (to === '/') return basename;

  if (isAbsolute(to)) {
    return normalize(`${basename}/${to}`);
  }

  return `${normalize(`${pathname}/${to}`)}${search}${hash}`;
}
