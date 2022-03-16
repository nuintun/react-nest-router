/**
 * @module useRender
 */

import { useMemo } from 'react';
import { RouteMatch } from '../types';
import { RouteContext } from '../context';

export function useRender<T, K extends string>(match: RouteMatch<T, K> | null): React.ReactElement | null {
  return useMemo(() => {
    if (match) {
      return match.meta.reduceRight<React.ReactElement | null>((outlet, route, index, meta) => {
        return (
          <RouteContext.Provider value={{ match, outlet, current: meta[index] }}>
            {'element' in route ? route.element : outlet}
          </RouteContext.Provider>
        );
      }, null);
    }

    return match;
  }, [match]);
}
