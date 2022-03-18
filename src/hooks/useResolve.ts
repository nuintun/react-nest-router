/**
 * @module useResolve
 */

import { To } from 'history';
import { assert, isString } from '../utils';
import { createURL, parseURL } from '../url';
import { useLocationContext } from './useLocationContext';
import { usePersistCallback } from './usePersistCallback';
import { useNavigationContext } from './useNavigationContext';

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
