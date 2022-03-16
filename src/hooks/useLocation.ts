/**
 * @module useLocation
 */

import { assert } from '../utils';
import { Location } from 'history';
import { useLocationContext } from './useLocationContext';

/**
 * @function useLocation
 */
export function useLocation(): Location {
  const locationContext = useLocationContext();

  assert(locationContext, `The hook useLocation can only be used in the context of a <Router> component.`);

  return locationContext.location;
}
