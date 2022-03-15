/**
 * @module context
 */

import { createContext } from 'react';
import { RouteContext } from './types';

/**
 * Route context.
 */
export const ROUTE_CONTEXT = createContext<RouteContext<unknown, string>>({ current: null, match: null, outlet: null });

if (__DEV__) {
  ROUTE_CONTEXT.displayName = 'Route';
}
