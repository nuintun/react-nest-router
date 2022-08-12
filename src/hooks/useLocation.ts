/**
 * @module useLocation
 */

import { assert } from '../utils';
import { Location } from '../types';
import { useLocateContext } from './useLocateContext';

/**
 * @function useLocation
 * @description Get current location.
 */
export function useLocation<S = unknown>(): Location<S> {
  const locateContext = useLocateContext();

  if (__DEV__) {
    assert(locateContext, 'The hook useLocation can only be used inside a <Router> component.');
  }

  const { location } = locateContext!;

  if (__DEV__) {
    return Object.freeze(location) as Location<S>;
  }

  return location as Location<S>;
}
