/**
 * @module router
 */

import { Tree } from './Tree';
import { assert, computeScore } from './utils';
import { isAbsolute, normalize, resolve } from './path';
import { Route, RouteBranch, RouteBranchMeta } from './types';

/**
 * @function isBranchSiblings
 * @param prev Prev route branch.
 * @param next Next route branch.
 */
function isBranchSiblings<T>(prev: RouteBranch<T>, next: RouteBranch<T>): boolean {
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
 * @function compareRouteMeta
 * @param prev Prev route branch.
 * @param next Next route branch.
 */
function compareRouteMeta<T>(prev: RouteBranch<T>, next: RouteBranch<T>): number {
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
function sortRouteBranches<T>(branches: RouteBranch<T>[]): RouteBranch<T>[] {
  // Higher score first
  return branches.sort((prev, next) => {
    return prev.score !== next.score ? next.score - prev.score : compareRouteMeta(prev, next);
  });
}

/**
 * @function flattenRoutes
 * @param routes User routes.
 */
export function flattenRoutes<T>(routes: Route<T>[], basename: string = '/'): RouteBranch<T>[] {
  const branches: RouteBranch<T>[] = [];

  // Traversal routes.
  for (const route of routes) {
    const backtrace = () => {
      paths.pop();
      metadata.pop();
    };

    const paths: (string | undefined)[] = [];
    const metadata: RouteBranchMeta<T>[] = [];
    const items = new Tree(route, route => route.children).dfs(backtrace);

    // Traversal nested routes.
    for (const [index, item] of items) {
      const { path: to, index: isIndex } = item;
      const from = paths.reduce<string>((from, to) => resolve(from, to), basename);

      assert(
        !(isIndex && 'path' in item),
        `Index routes must not have path. Please remove path property from route path "${from}".`
      );

      assert(
        !(isIndex && 'children' in item),
        `Index routes must not have child routes. Please remove all child routes from route path "${from}".`
      );

      assert(
        !(to && isAbsolute(to) && !to.startsWith(normalize(`${from}/`))),
        `Absolute route path "${to}" nested under path "${from}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      );

      // Cache paths.
      paths.push(to);

      // Cache metadata.
      metadata.push({
        index,
        route: item,
        basename: from
      });

      // Get route children.
      const { children } = item;
      const hasChildren = children && children.length > 0;

      // Routes without a path shouldn't ever match by themselves unless they are
      // index routes, so don't add them to the list of possible branches.
      if (isIndex || to != null) {
        // Routes with children is layout route,
        // so don't add them to the list of possible branches.
        if (!hasChildren) {
          const { caseSensitive, end } = item;
          const path = resolve(from, isIndex ? './' : to);

          branches.push({
            path,
            end: end !== false,
            meta: [...metadata],
            score: computeScore(path, isIndex),
            caseSensitive: caseSensitive === true
          });
        }
      }

      // If route has no children, backtracking.
      !hasChildren && backtrace();
    }
  }

  // Sort route branches.
  return sortRouteBranches(branches);
}
