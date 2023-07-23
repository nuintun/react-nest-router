/**
 * @module useRouter
 */

import { useRoutes } from './useRoutes';
import { createNavigator } from '/navigator';
import { Navigator, RouterProps } from '/interface';
import { LocateContext, NavigationContext } from '/context';
import { ReactElement, useEffect, useMemo, useState } from 'react';

/**
 * @function useRouter
 * @description Get router element.
 * @param props Router props.
 */
export function useRouter<M = unknown, K extends string = string, C = unknown>({
  routes,
  context,
  basename = '/',
  children = '404',
  navigator: history
}: RouterProps<M, K, C>): ReactElement {
  const navigator = useMemo<Navigator>(() => {
    return history ?? createNavigator(self);
  }, [history]);

  const navigation = useMemo<NavigationContext>(() => {
    return { basename, navigator };
  }, [basename, navigator]);

  const [locate, setLocate] = useState<LocateContext>(() => {
    return {
      action: navigator.action,
      location: navigator.location
    };
  });

  useEffect(() => {
    return navigator.listen(({ action, location }) => {
      setLocate({ action, location });
    });
  }, [navigator]);

  const element = useRoutes(routes, locate.location.pathname, basename, context);

  return (
    <NavigationContext.Provider value={navigation}>
      <LocateContext.Provider value={locate}>{element ? element : children}</LocateContext.Provider>
    </NavigationContext.Provider>
  );
}
