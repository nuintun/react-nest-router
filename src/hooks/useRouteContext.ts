/**
 * @module useRouteContext
 */

import { useContext } from 'react';
import { RouteContext } from '/context';

/**
 * @function useRouteContext
 * @description Get route context.
 */
export function useRouteContext(): RouteContext | null {
  return useContext(RouteContext);
}
