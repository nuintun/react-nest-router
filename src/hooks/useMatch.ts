/**
 * @module useMatch
 */

import { IRoute } from '../types';
import { assert } from '../utils';
import { useRouteContext } from './useRouteContext';

/**
 * @function useMatch
 * @description Get current match route.
 */
export function useMatch<M = unknown, K extends string = string>(): IRoute<M, K> {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(routeContext, 'The hook useMatch can only be used inside a route element.');
  }

  const match = routeContext!.match.matches[routeContext!.index];

  if (__DEV__) {
    return Object.freeze(match) as IRoute<M, K>;
  }

  return match as IRoute<M, K>;
}
