/**
 * @module useMatch
 */

import { IRoute } from '../types';
import { assert } from '../utils';
import { useRouteContext } from './useRouteContext';

/**
 * @function useMatch
 */
export function useMatch<M = unknown, K extends string = string>(): IRoute<M, K> {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(routeContext, `The hook useMatch can only be used in the context of a route component.`);
  }

  return routeContext!.current as IRoute<M, K>;
}
