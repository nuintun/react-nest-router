/**
 * @module Router
 */

import { normalize } from '../path';
import { Route, RouteMatch } from '../types';
import { useRouter } from '../hooks/useRoutes';
import { useRender } from '../hooks/useRender';
import { createBrowserHistory, History } from 'history';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import { LocationContext, NavigationContext, RouteContext } from '../context';

export interface RouterProps<T, K extends string> {
  basename?: string;
  history?: History;
  router: Route<T, K>[];
}

export function render<T, K extends string>(match: RouteMatch<T, K>): React.ReactElement | null {
  return match.meta.reduceRight<React.ReactElement | null>((outlet, route, index, meta) => {
    return (
      <RouteContext.Provider value={{ match, outlet, current: meta[index] }}>
        {'element' in route ? route.element : outlet}
      </RouteContext.Provider>
    );
  }, null);
}

export function Router<T, K extends string>({ basename = '/', history, router }: RouterProps<T, K>): React.ReactElement {
  basename = useMemo(() => {
    return normalize(`/${basename}`);
  }, [basename]);

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

  const element = useRender(useRouter(router, state.location.pathname, basename));

  useLayoutEffect(() => navigator.listen(setState), [navigator]);

  return (
    <NavigationContext.Provider value={navigation}>
      <LocationContext.Provider value={state}>{element}</LocationContext.Provider>
    </NavigationContext.Provider>
  );
}
