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
import React, { useLayoutEffect, useMemo, useState } from 'react';

export interface RouterProps<M, K extends string> {
  basename?: string;
  history?: History;
  routes: Route<M, K>[];
}

export function Router<M, K extends string>({ history, routes, basename = '/' }: RouterProps<M, K>): React.ReactElement {
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

  const element = useRouter(routes, state.location.pathname, basename);

  useLayoutEffect(() => navigator.listen(setState), [navigator]);

  return (
    <NavigationContext.Provider value={navigation}>
      <LocationContext.Provider value={state}>{element}</LocationContext.Provider>
    </NavigationContext.Provider>
  );
}
