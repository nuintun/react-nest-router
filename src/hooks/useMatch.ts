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

  const { index, match } = routeContext!;

  return readOnly(match.matches[index] as IRoute<M, K>);
}
