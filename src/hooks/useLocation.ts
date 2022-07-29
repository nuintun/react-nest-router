/**
 * @module useLocation
 */

import { assert } from '../utils';
import { Location } from '../types';
import { useLocationContext } from './useLocationContext';

/**
 * @function useLocation
 * @description Get current location.
 */
export function useLocation<S = unknown>(): Location<S> {
  const locationContext = useLocationContext();

  if (__DEV__) {
    assert(locationContext, `The hook useLocation can only be used inside a <Router> component.`);
  }

  const { location } = locationContext!;

  if (__DEV__) {
    return Object.freeze(location) as Location<S>;
  }

  return location as Location<S>;
}
