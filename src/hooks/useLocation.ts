/**
 * @module useLocation
 */

import { assert } from '../utils';
import { Location } from '../types';
import { useLocationContext } from './useLocationContext';

/**
 * @function useLocation
 */
export function useLocation<S = unknown>(): Location<S> {
  const locationContext = useLocationContext();

  if (__DEV__) {
    assert(locationContext, `The hook useLocation can only be used in the context of a <Router> component.`);
  }

  return locationContext!.location as Location<S>;
}
