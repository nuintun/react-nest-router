/**
 * @module Router
 */

import { Route } from '../types';
import { assert } from '../utils';
import { normalize } from '../path';
import { useRouter } from '../hooks/useRouter';
import { createBrowserHistory, History } from 'history';
import { useRouteContext } from '../hooks/useRouteContext';
import { LocationContext, NavigationContext } from '../context';
import React, { memo, useLayoutEffect, useMemo, useState } from 'react';

export interface RouterProps<M, K extends string, C> {
  context?: C;
  basename?: string;
  history?: History;
  routes: Route<M, K>[];
  fallback?: React.ReactNode;
}

export const Router = memo(function Router({ history, routes, context, basename = '/', fallback = '404' }) {
  const routeContext = useRouteContext();

  if (__DEV__) {
    assert(!routeContext, `You cannot render <Router> inside another <Router>.`);
  }

  basename = useMemo(() => {
    return normalize(basename);
  }, [basename]);

  if (__DEV__) {
    assert(basename.startsWith('/'), 'Router basename must start with /.');
  }

  const navigator = useMemo<History>(() => {
    return history ?? createBrowserHistory();
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

  useLayoutEffect(() => navigator.listen(setState), [navigator]);

  const MainOutlet = useRouter(routes, state.location.pathname, basename);

  return (
    <NavigationContext.Provider value={navigation}>
      <LocationContext.Provider value={state}>
        {MainOutlet ? <MainOutlet context={context} /> : fallback}
      </LocationContext.Provider>
    </NavigationContext.Provider>
  );
}) as <M, K extends string, C>(props: RouterProps<M, K, C>) => React.ReactElement;
