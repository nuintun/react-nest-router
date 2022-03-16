/**
 * @module router
 */

import { Tree } from './Tree';
import { compile } from './pattern';
import { assert, computeScore } from './utils';
import { isAbsolute, isOutBounds, prefix, resolve, suffix } from './path';
import { BranchMeta, CRoute, Route, RouteBranch, RouteMatch } from './types';

/**
 * @function isBranchSiblings
 * @description Is siblings branch.
 * @param prev Prev route branch.
 * @param next Next route branch.
 */
function isBranchSiblings<T, K extends string>(prev: RouteBranch<T, K>, next: RouteBranch<T, K>): boolean {
  const { meta: prevMeta } = prev;
  const { meta: nextMeta } = next;
  const { length: prevLength } = prevMeta;
  const { length: nextLength } = nextMeta;

  return (
    prevLength === nextLength &&
    prevMeta.slice(0, -1).every((meta, index) => {
      return meta.index === nextMeta[index].index;
    })
  );
}

/**
 * @function compareBranchMeta
 * @description Compare branch meta.
 * @param prev Prev route branch.
 * @param next Next route branch.
 */
function compareBranchMeta<T, K extends string>(prev: RouteBranch<T, K>, next: RouteBranch<T, K>): number {
  // If two routes are siblings, we should try to match the earlier sibling
  // first. This allows people to have fine-grained control over the matching
  // behavior by simply putting routes with identical paths in the order they
  // want them tried.
  if (isBranchSiblings(prev, next)) {
    const { meta: prevMeta } = prev;
    const { meta: nextMeta } = next;
    const { length: prevLength } = prevMeta;
    const { length: nextLength } = nextMeta;

    return prevMeta[prevLength - 1].index - nextMeta[nextLength - 1].index;
  }

  // Otherwise, it doesn't really make sense to rank non-siblings by index,
  // so they sort equally.
  return 0;
}

/**
 * @function sortRouteBranches
 * @description Sort route branches.
 * @param branches Route branches.
 */
function sortRouteBranches<T, K extends string>(branches: RouteBranch<T, K>[]): RouteBranch<T, K>[] {
  // Higher score first
  return branches.sort((prev, next) => {
    return prev.score !== next.score ? next.score - prev.score : compareBranchMeta(prev, next);
  });
}

/**
 * @function flatten
 * @description Flatten user routes.
 * @param routes User routes.
 */
export function flatten<T, K extends string>(routes: Route<T, K>[]): RouteBranch<T, K>[] {
  const defaultGuard = () => true;
  const branches: RouteBranch<T, K>[] = [];

  // Traversal routes.
  for (const route of routes) {
    const meta: BranchMeta<T, K>[] = [];
    const paths: (string | undefined)[] = [];
    const items = new Tree<CRoute<T, K>>(route, route => route.children).dfs(() => {
      meta.pop();
      paths.pop();
    });

    // Traversal nested routes.
    for (const [index, item] of items) {
      const { path: to, index: isIndex, children, guard } = item;
      const from = paths.reduce<string>((from, to) => resolve(from, to), '/');

      if (__DEV__) {
        const path = resolve(from, to);
        const isLayout = children && children.length > 0;

        assert(
          !(isIndex && 'path' in item),
          `Index route must not have path. Please remove path property from route path "${from}".`
        );

        assert(
          !(isIndex && 'children' in item),
          `Index route must not have child routes. Please remove all child routes from route path "${from}".`
        );

        assert(
          !(!isIndex && 'index' in item),
          `Layout or page route must not have index. Please remove index property from route path "${path}".`
        );

        assert(
          !(isLayout && 'guard' in item),
          `Layout route must not have guard. Please remove guard property from route path "${path}".`
        );

        assert(
          !(isLayout && 'sensitive' in item),
          `Layout route must not have sensitive. Please remove sensitive property from route path "${path}".`
        );

        assert(
          !(!isLayout && !isIndex && to == null),
          `The route nested under path "${from}" is not valid. It may be index or page route, but missing index or path property.`
        );

        assert(
          !('guard' in item && typeof guard !== 'function'),
          `The guard of the route path "${path}" must be a function. If the route has guard, the guard property must be a function.`
        );

        assert(
          !(to && isAbsolute(to) && isOutBounds(from, to, isLayout ? false : item.sensitive)),
          `Absolute route path "${to}" nested under path "${from}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
        );
      }

      const metadata: BranchMeta<T, K> = {
        index,
        route: item as Route<T, K>
      };

      // Route is layout route.
      if (children && children.length > 0) {
        // Cache meta.
        meta.push(metadata);
        // Cache paths.
        paths.push(to);
      } else {
        const { guard, sensitive } = item;
        const path = resolve(from, isIndex ? './' : to);

        // Routes with children is layout routes,
        // otherwise is page routes or index routes,
        // only page page routes or index routes will add to branches.
        branches.push({
          meta: [...meta, metadata],
          guard: guard || defaultGuard,
          matcher: compile(path, sensitive),
          score: computeScore(path, isIndex)
        });
      }
    }
  }

  // Sort route branches.
  return sortRouteBranches(branches);
}

/**
 * @function match
 * @description Match route branch.
 * @param routes The flatten routes.
 * @param pathname The pathname to match.
 * @param basename The basename to match.
 */
export function match<T, K extends string>(
  routes: RouteBranch<T, K>[],
  pathname: string,
  basename: string = '/'
): RouteMatch<T, K> | null {
  if (pathname === basename) {
    pathname = '/';
  } else if (isAbsolute(pathname)) {
    const base = suffix(basename, '/');

    if (!pathname.toLowerCase().startsWith(base.toLowerCase())) {
      return null;
    }

    pathname = pathname.slice(base.length - 1);
  } else {
    pathname = prefix(pathname, '/');
  }

  for (const { meta: metadata, matcher, guard } of routes) {
    const { path, match } = matcher;
    const params = match(pathname);

    if (params) {
      const meta = metadata.map(({ route }) => route);
      const match = { path, meta, params, basename, pathname };

      if (guard(match)) {
        return match;
      }
    }
  }

  return null;
}
