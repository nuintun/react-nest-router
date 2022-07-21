/**
 * @module useLocation
 */

import { Location } from '../types';
import { assert, readOnly } from '../utils';
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

  return readOnly(locationContext!.location as Location<S>);
}
