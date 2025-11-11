/**
 * @module useMatchIndex
 */

import { assert } from '/utils';
import { useRouteContext } from './useRouteContext';

/**
 * @function useMatchIndex
 * @description [hook] Get current match route index.
 */
export function useMatchIndex(): number {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(routeContext, 'The hook useMatchIndex can only be used inside a route element');
  }

  return routeContext!.index;
}
