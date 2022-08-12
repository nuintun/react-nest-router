/**
 * @module useOutlet
 */

import { assert } from '../utils';
import React, { useMemo } from 'react';
import { OutletProps } from '../types';
import { OutletContext } from '../context';
import { useRouteContext } from './useRouteContext';

/**
 * @function useOutlet
 * @description Get outlet element.
 * @param props Outlet props.
 */
export function useOutlet<C = unknown>(props: OutletProps<C> = {}): React.ReactElement | null {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(routeContext, 'The hook useOutlet can only be used inside a route element.');
  }

  const { context } = props;
  const { outlet } = routeContext!;
  const hasContext = 'context' in props;

  return useMemo(() => {
    if (hasContext && outlet) {
      return <OutletContext.Provider value={context}>{outlet}</OutletContext.Provider>;
    }

    return outlet;
  }, [context, hasContext, outlet]);
}
