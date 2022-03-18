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
 * @param context
 */
export function useOutlet<C = unknown>(props: OutletProps<C> = {}): React.ReactElement | null {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(routeContext, `The hook useOutlet can only be used in the context of a route component.`);
  }

  const { outlet } = routeContext!;

  const outletContext = useMemo(() => {
    return { context: props.context };
  }, [props.context]);

  if ('context' in props && outlet) {
    return <OutletContext.Provider value={outletContext}>{outlet}</OutletContext.Provider>;
  }

  return outlet;
}
