/**
 * @module hooks
 */

import { useMemo } from 'react';
import { Route } from './types';
import { normalize } from './path';
import { flatten, match } from './router';

export function useRoutes<T = unknown, K extends string = string>(
  routes: Route<T>[],
  pathname: string,
  basename: string = '/'
) {
  const branches = useMemo(() => {
    return flatten(routes);
  }, [routes]);

  const matched = useMemo(() => {
    return match<T, K>(branches, normalize(`/${pathname}`), normalize(`/${basename}`));
  }, [basename, pathname]);

  return matched;
}
