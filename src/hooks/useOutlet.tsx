/**
 * @module useOutlet
 */

import { assert } from '../utils';
import { useRouteContext } from './useRouteContext';

/**
 * @function useOutlet
 * @param context
 */
export function useOutlet<C>(context?: C): React.ReactElement {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(routeContext, `The hook useOutlet can only be used in the context of a route component.`);
  }

  const { Outlet } = routeContext!;
  const props = arguments.length > 0 ? { context } : {};

  return <Outlet {...props} />;
}
