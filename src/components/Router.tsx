/**
 * @module Router
 */

import { assert } from '../utils';
import { normalize } from '../path';
import { Navigator, Route } from '../types';
import { useRouter } from '../hooks/useRouter';
import { createBrowserHistory } from 'history';
import { useRouteContext } from '../hooks/useRouteContext';
import { LocationContext, NavigationContext } from '../context';
import React, { memo, useLayoutEffect, useMemo, useState } from 'react';

export interface RouterProps<M = unknown, K extends string = string, C = unknown> {
  context?: C;
  basename?: string;
  routes: Route<M, K>[];
  navigator?: Navigator;
  children?: React.ReactNode;
}

/**
 * @function Router
 * @param props
 */
export const Router = memo(function Router({ navigator: history, routes, context, basename = '/', children = '404' }) {
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

  const navigator = useMemo<Navigator>(() => {
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
