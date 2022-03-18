/**
 * @module url
 */

import { isAbsolute, normalize } from './path';

export interface URLSchema {
  readonly hash: string;
  readonly origin: string;
  readonly search: string;
  readonly pathname: string;
}

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
export function parseURL(path: string): URLSchema {
  const matched = path.match(/^((?:[a-z0-9.+-]+:)?\/\/[^/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/i);

  if (matched) {
    const [, origin = '', pathname, search = '', hash = ''] = matched;

    return { origin, pathname, search, hash };
  }

  return { origin: '', pathname: '', search: '', hash: '' };
}

/**
 * @function resolveURL
 * @description Resolve URL.
 * @param from URL from.
 * @param to URL to.
 * @param basename URL basename.
 */
export function resolveURL(
  from: string,
  { pathname, search, hash }: Omit<URLSchema, 'origin'>,
  basename: string = '/'
): string {
  const to = normalize(pathname);

  if (to === '') return `${from}${to}`;

  if (to === '/') return `${basename}${to}`;

  if (isAbsolute(to)) {
    return normalize(`${basename}/${to}${search}${hash}`);
  }

  return `${normalize(`${from}/${to}`)}${search}${hash}`;
}
