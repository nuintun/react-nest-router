/**
 * @module useResolve
 */

import { To } from 'history';
import { assert, isString } from '../utils';
import { isAbsolute, normalize } from '../path';
import { useLocationContext } from './useLocationContext';
import { usePersistCallback } from './usePersistCallback';
import { useNavigationContext } from './useNavigationContext';

/**
 * @function parseURL
 * @description Parse url.
 * @param path URL path.
 */
function parseURL(path: string): [origin: string, pathname: string, search: string, hash: string] {
  const matched = path.match(/^((?:[a-z0-9.+-]+:)?\/\/[^/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/i);

  if (matched) {
    const [, origin = '', pathname, search = '', hash = ''] = matched;

    return [origin, pathname, search, hash];
  }

  return ['', '', '', ''];
}

/**
 * @function createURL
 * @param basename
 * @param pathname
 * @param to
 * @param search
 * @param hash
 */
function createURL(basename: string, pathname: string, to: string, search: string, hash: string): string {
  to = normalize(to);

  if (to === '') return pathname;

  if (to === '/') return basename;

  if (isAbsolute(to)) {
    return normalize(`${basename}/${to}`);
  }

  return `${normalize(`${pathname}/${to}`)}${search}${hash}`;
}

/**
 * @function useResolve
 */
export function useResolve(): (to: To) => string {
  const locationContext = useLocationContext();
  const navigationContext = useNavigationContext();

  if (__DEV__) {
    assert(
      navigationContext && locationContext,
      `The hook useResolve can only be used in the context of a <Router> component.`
    );
  }

  const { basename } = navigationContext!;
  const { pathname: from } = locationContext!.location;

  return usePersistCallback(to => {
    if (isString(to)) {
      const [origin, pathname, search, hash] = parseURL(to);

      if (__DEV__) {
        assert(origin === '', `The path to be resolved cannot have a protocol.`);
      }

      return createURL(basename, from, pathname, search, hash);
    } else {
      const { pathname = '/', search = '', hash = '' } = to;

      return createURL(basename, from, pathname, search, hash);
    }
  });
}
