/**
 * @module router
 */

import { Tree } from './Tree';
import { compile } from './pattern';
import { assert, computeScore } from './utils';
import { isAbsolute, isOutBounds, resolve, suffix } from './path';
import { BranchMeta, CRoute, Route, RouteBranch, RouteMatch } from './types';

/**
 * @function isBranchSiblings
 * @param prev Prev route branch.
 * @param next Next route branch.
 */
function isBranchSiblings<T>(prev: RouteBranch<T, string>, next: RouteBranch<T, string>): boolean {
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
 * @param prev Prev route branch.
 * @param next Next route branch.
 */
function compareBranchMeta<T>(prev: RouteBranch<T, string>, next: RouteBranch<T, string>): number {
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
 * @param branches Route branches.
 */
function sortRouteBranches<T>(branches: RouteBranch<T, string>[]): RouteBranch<T, string>[] {
  // Higher score first
  return branches.sort((prev, next) => {
    return prev.score !== next.score ? next.score - prev.score : compareBranchMeta(prev, next);
  });
}

/**
 * @function flatten
 * @param routes User routes.
 */
export function flatten<T>(routes: Route<T>[]): RouteBranch<T, string>[] {
  const branches: RouteBranch<T, string>[] = [];

  // Traversal routes.
  for (const route of routes) {
    const meta: BranchMeta<T>[] = [];
    const paths: (string | undefined)[] = [];
    const items = new Tree<CRoute<T>>(route, route => route.children).dfs(() => {
      meta.pop();
      paths.pop();
    });

    // Traversal nested routes.
    for (const [index, item] of items) {
      const { path: to, index: isIndex, children } = item;
      const from = paths.reduce<string>((from, to) => resolve(from, to), '/');

      if (__DEV__) {
        const path = resolve(from, to);
        const hasChildren = children && children.length > 0;

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
          !(hasChildren && 'sensitive' in item),
          `Layout route must not have sensitive. Please remove sensitive property from route path "${path}".`
        );

        assert(
          !(!hasChildren && !isIndex && to == null),
          `The route nested under path "${from}" is not valid. It may be index or page route, but missing "index" or "path" property.`
        );

        assert(
          !(to && isAbsolute(to) && isOutBounds(from, to, hasChildren ? false : item.sensitive)),
          `Absolute route path "${to}" nested under path "${from}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
        );
      }

      const metadata: BranchMeta<T> = {
        index,
        route: item as Route<T>
      };

      // Route has children.
      if (children && children.length > 0) {
        // Cache meta.
        meta.push(metadata);
        // Cache paths.
        paths.push(to);
      } else {
        const { sensitive } = item;
        const path = resolve(from, isIndex ? './' : to);

        // Routes with children is layout routes,
        // otherwise is page routes or index routes,
        // only page page routes or index routes will add to branches.
        branches.push({
          meta: [...meta, metadata],
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
 * @param routes
 * @param pathname
 * @param basename
 */
export function match<T>(
  routes: RouteBranch<T, string>[],
  pathname: string,
  basename: string = '/'
): RouteMatch<T, string> | null {
  if (pathname === basename) {
    pathname = '/';
  } else {
    const base = suffix(basename, '/');

    if (!pathname.toLowerCase().startsWith(base.toLowerCase())) {
      return null;
    }

    pathname = pathname.slice(base.length - 1);
  }

  for (const { meta: metadata, matcher } of routes) {
    const { path, match } = matcher;
    const params = match(pathname);

    if (params !== null) {
      const meta = metadata.map(({ route }) => route);

      return { path, meta, params, basename, pathname };
    }
  }

  return null;
}
