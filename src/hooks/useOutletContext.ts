/**
 * @module useOutletContext
 */

import { assert } from '/utils';
import { useContext } from 'react';
import { OutletContext } from '/context';
import { useRouteContext } from './useRouteContext';

/**
 * @function useOutletContext
 * @description Get outlet context.
 */
export function useOutletContext<C = unknown>(): C {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(routeContext, 'The hook useOutletContext can only be used inside a route element');
  }

  return useContext(OutletContext) as C;
}
