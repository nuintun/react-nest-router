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
  children?: React.ReactNode;
}

/**
 * @function Router
 * @param props
 */
export const Router = memo(function Router({ history, routes, context, basename = '/', children = '404' }) {
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

  const element = useRouter(routes, state.location.pathname, basename, context);

  return (
    <NavigationContext.Provider value={navigation}>
      <LocationContext.Provider value={state}>{element ? element : children}</LocationContext.Provider>
    </NavigationContext.Provider>
  );
}) as <M, K extends string, C>(props: RouterProps<M, K, C>) => React.ReactElement;
