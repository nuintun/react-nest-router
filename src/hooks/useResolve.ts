/**
 * @module useResolve
 */

import { To } from 'history';
import { assert, isString } from '../utils';
import { parseURL, resolveURL } from '../url';
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
    let hash = '';
    let search = '';
    let pathname = '';

    if (isString(to)) {
      const parts = parseURL(to);

      if (__DEV__) {
        assert(parts.origin === '', `The path to be resolved cannot have a protocol.`);
      }

      ({ pathname, search, hash } = parts);
    } else {
      ({ pathname = '/', search = '', hash = '' } = to);
    }

    return resolveURL(from, { pathname, search, hash }, basename);
  });
}
