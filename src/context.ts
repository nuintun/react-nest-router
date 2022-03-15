/**
 * @module context
 */

import { createContext } from 'react';
import { RouteContext } from './types';

/**
 * Init route context.
 */
export const ROUTE_CONTEXT = createContext<RouteContext>({ current: null, matches: [], outlet: null });

if (__DEV__) {
  ROUTE_CONTEXT.displayName = 'Route';
}
