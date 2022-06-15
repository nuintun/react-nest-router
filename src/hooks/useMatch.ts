/**
 * @module useMatch
 */

import { IRoute } from '../types';
import { assert, readOnly } from '../utils';
import { useRouteContext } from './useRouteContext';

/**
 * @function useMatch
 * @description Get current match route.
 */
export function useMatch<M = unknown, K extends string = string>(): Readonly<IRoute<M, K>> {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(routeContext, `The hook useMatch can only be used inside a route element.`);
  }

  return readOnly(routeContext!.current as IRoute<M, K>);
}
