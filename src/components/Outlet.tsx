/**
 * @module Outlet
 */

import { assert } from '../utils';
import { OutletProps } from '../types';
import { memo, ReactElement } from 'react';
import { useOutlet } from '../hooks/useOutlet';
import { useRouteContext } from '../hooks/useRouteContext';

/**
 * @function Outlet
 * @param props Outlet props.
 */
export const Outlet = memo(function Outlet(props) {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(routeContext, 'The component <Outlet> can only be used inside a route element.');
  }

  return useOutlet(props);
}) as <C = unknown>(props: OutletProps<C>) => ReactElement | null;
