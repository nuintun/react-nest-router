/**
 * @module useLocation
 */

import { assert } from '/utils';
import { Location } from '/interface';
import { useLocateContext } from './useLocateContext';

/**
 * @function useLocation
 * @description [hook] Get current location.
 */
export function useLocation<S = unknown>(): Location<S> {
  const locateContext = useLocateContext();

  if (__DEV__) {
    assert(locateContext, 'The hook useLocation can only be used inside a route element');
  }

  const { location } = locateContext!;

  return location as Location<S>;
}
