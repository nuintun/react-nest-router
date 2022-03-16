/**
 * @module Outlet
 */

import { useOutlet } from '../hooks/useOutlet';

export interface OutletProps<C> {
  context?: C;
}

export function Outlet<C>({ context }: OutletProps<C>): React.ReactElement | null {
  return useOutlet(context);
}
