/**
 * @module Router
 */

import { assert } from '../utils';
import { normalize } from '../path';
import { useRouter } from '../hooks/useRouter';
import { createNavigator } from '../navigator';
import { Navigator, RouterProps } from '../types';
import { useRouteContext } from '../hooks/useRouteContext';
import { LocationContext, NavigationContext } from '../context';
import { useLocationContext } from '../hooks/useLocationContext';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { useNavigationContext } from '../hooks/useNavigationContext';

/**
 * @function Router
 * @param props
 */
export const Router = memo(function Router({ navigator: history, routes, context, basename = '/', children = '404' }) {
  const routeContext = useRouteContext();
  const locationContext = useLocationContext();
  const navigationContext = useNavigationContext();

  if (__DEV__) {
    assert(
      !navigationContext && !locationContext && !routeContext,
      `The component <Router> cannot render inside another <Router> component.`
    );
  }

  basename = useMemo(() => {
    return normalize(basename);
  }, [basename]);

  const navigator = useMemo<Navigator>(() => {
    return history ?? createNavigator(self);
  }, [history]);

  const [state, setState] = useState(() => {
    return {
      action: navigator.action,
      location: navigator.location
    };
  });

  const navigation = useMemo<NavigationContext>(() => {
    return { basename, navigator };
  }, [basename, navigator]);

  useEffect(() => navigator.listen(setState), [navigator]);

  const element = useRouter(routes, state.location.pathname, basename, context);

  return (
    <NavigationContext.Provider value={navigation}>
      <LocationContext.Provider value={state}>{element ? element : children}</LocationContext.Provider>
    </NavigationContext.Provider>
  );
}) as <M = unknown, K extends string = string, C = unknown>(props: RouterProps<M, K, C>) => React.ReactElement;
