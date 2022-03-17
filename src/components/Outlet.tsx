/**
 * @module Outlet
 */

import { memo } from 'react';
import { OutletProps } from '../types';
import { useOutlet } from '../hooks/useOutlet';
import { useRouteContext } from '../hooks/useRouteContext';
import { assert } from '../utils';

export const Outlet = memo(function Outlet(props) {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(routeContext, `The <Outlet> can only be used in the context of a route component.`);
  }

  const { Outlet } = routeContext!;

  return 'context' in props ? useOutlet(props.context) : <Outlet />;
}) as <C>(props: OutletProps<C>) => React.ReactElement;
