/**
 * @module useNavigate
 */

import { To } from 'history';
import { isAbsolute, normalize } from '../path';
import { assert, isNumber, isString } from '../utils';
import { usePersistCallback } from './usePersistCallback';
import { useLocationContext } from './useLocationContext';
import { useNavigationContext } from './useNavigationContext';

export interface NavigateOptions<S> {
  state?: S;
  replace?: boolean;
}

export interface Navigate {
  (delta: number): void;
  <S>(to: To, options?: NavigateOptions<S>): void;
}

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

function createURL(basename: string, from: string, to: string, search: string, hash: string): string {
  return `${normalize(`${isAbsolute(to) ? basename : from}/${to}`)}${search}${hash}`;
}

export function useNavigate(): Navigate {
  const locationContext = useLocationContext();
  const navigationContext = useNavigationContext();

  if (__DEV__) {
    assert(
      navigationContext && locationContext,
      `The hook useNavigate can only be used in the context of a <Router> component.`
    );
  }

  const { location } = locationContext!;
  const { basename, navigator } = navigationContext!;

  const navigate = usePersistCallback(<S>(to: To | number, options: NavigateOptions<S> = {}) => {
    if (isNumber(to)) {
      return navigator.go(to);
    }

    let path: string;

    if (isString(to)) {
      const [origin, pathname, search, hash] = parseURL(to);

      if (__DEV__) {
        assert(origin === '', `The hook useNavigate does not support path with protocol.`);
      }

      path = createURL(basename, location.pathname, pathname, search, hash);
    } else {
      const { pathname = '/', search = '', hash = '' } = to;

      path = createURL(basename, location.pathname, pathname, search, hash);
    }

    const { replace, state } = options;

    if (replace) {
      navigator.replace(path, state);
    } else {
      navigator.push(path, state);
    }
  });

  return navigate;
}
