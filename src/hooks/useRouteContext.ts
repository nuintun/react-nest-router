/**
 * @module useRouteContext
 */

import { useContext } from 'react';
import { RouteContext } from '../context';

/**
 * @function useRouteContext
 */
export function useRouteContext(): RouteContext | null {
  return useContext(RouteContext);
}
