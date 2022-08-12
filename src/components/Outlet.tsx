/**
 * @module Outlet
 */

import { assert } from '../utils';
import React, { memo } from 'react';
import { OutletProps } from '../types';
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
}) as <C = unknown>(props: OutletProps<C>) => React.ReactElement | null;
