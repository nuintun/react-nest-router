/**
 * @module useOutlet
 */

import { OutletContext } from '../context';
import { useRouteContext } from './useRouteContext';

/**
 * @function useOutlet
 * @param context
 */
export function useOutlet<C>(context?: C): React.ReactElement | null {
  const routeContext = useRouteContext();

  if (routeContext) {
    const { outlet } = routeContext;

    if (outlet) {
      return <OutletContext.Provider value={context}>{outlet}</OutletContext.Provider>;
    }
  }

  return null;
}
