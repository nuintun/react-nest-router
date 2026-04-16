/**
 * @module useOutlet
 */

import { OutletContext } from '/context';
import { OutletProps } from '/interface';
import { assert, hasOwnKey } from '/utils';
import { ReactElement, useMemo } from 'react';
import { useRouteContext } from './useRouteContext';

/**
 * @function useOutlet
 * @description [hook] Get outlet element.
 * @param props Outlet props.
 */
export function useOutlet<C = unknown>(props: OutletProps<C> = {}): ReactElement | null {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(routeContext, 'The hook useOutlet can only be used inside a route element');
  }

  const { context } = props;
  const { outlet } = routeContext!;
  const hasContext = hasOwnKey(props, 'context');

  return useMemo(() => {
    if (hasContext && outlet) {
      return <OutletContext.Provider value={context}>{outlet}</OutletContext.Provider>;
    }

    return outlet;
  }, [context, hasContext, outlet]);
}
