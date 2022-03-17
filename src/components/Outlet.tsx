/**
 * @module Outlet
 */

import { memo } from 'react';
import { assert } from '../utils';
import { OutletProps } from '../types';
import { useRouteContext } from '../hooks/useRouteContext';

/**
 * @function Outlet
 * @param props
 */
export const Outlet = memo(function Outlet(props) {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(routeContext, `The <Outlet> can only be used in the context of a route component.`);
  }

  const { Outlet } = routeContext!;

  return <Outlet {...props} />;
}) as <C>(props: OutletProps<C>) => React.ReactElement;
