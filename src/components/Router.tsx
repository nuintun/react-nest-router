/**
 * @module Router
 */

import { assert } from '../utils';
import { normalize } from '../path';
import { useRouter } from '../hooks/useRouter';
import { createNavigator } from '../navigator';
import { Navigator, RouterProps } from '../types';
import { useRouteContext } from '../hooks/useRouteContext';
import { useLocateContext } from '../hooks/useLocateContext';
import { LocateContext, NavigationContext } from '../context';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { useNavigationContext } from '../hooks/useNavigationContext';

/**
 * @function Router
 * @param props
 */
export const Router = memo(function Router({ navigator: history, routes, context, basename = '/', children = '404' }) {
  const routeContext = useRouteContext();
  const locateContext = useLocateContext();
  const navigationContext = useNavigationContext();

  if (__DEV__) {
    assert(
      !navigationContext && !locateContext && !routeContext,
      `The component <Router> cannot render inside another <Router> component.`
    );
  }

  basename = useMemo(() => {
    return normalize(basename);
  }, [basename]);

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

  const element = useRouter(routes, locate.location.pathname, basename, context);

  return (
    <NavigationContext.Provider value={navigation}>
      <LocateContext.Provider value={locate}>{element ? element : children}</LocateContext.Provider>
    </NavigationContext.Provider>
  );
}) as <M = unknown, K extends string = string, C = unknown>(props: RouterProps<M, K, C>) => React.ReactElement;
