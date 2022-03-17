/**
 * @module Outlet
 */

import { memo } from 'react';
import { OutletProps } from '../types';
import { useOutlet } from '../hooks/useOutlet';

export const Outlet = memo(function Outlet({ context }) {
  return useOutlet(context);
}) as <C>(props: OutletProps<C>) => React.ReactElement;
