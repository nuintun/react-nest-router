/**
 * @module router
 */

import { Tree } from './Tree';
import { isAbsolute, resolve } from './path';
import { assert, computeScore } from './utils';
import { Route, RouteBranch, RouteBranchMeta } from './types';

/**
 * @function isRouteSiblings
 * @param prev Prev route branch.
 * @param next Next route branch.
 */
function isRouteSiblings<T>(prev: RouteBranch<T>, next: RouteBranch<T>): boolean {
  const { meta: prevMeta } = prev;
  const { meta: nextMeta } = next;
  const { length: prevLength } = prevMeta;
  const { length: nextLength } = nextMeta;

  return (
    prevLength > 0 &&
    nextLength > 0 &&
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
  // Otherwise, it doesn't really make sense to rank non-siblings by index,
  // so they sort equally.
  if (isRouteSiblings(prev, next)) {
    const { meta: prevMeta } = prev;
    const { meta: nextMeta } = next;
    const { length: prevLength } = prevMeta;
    const { length: nextLength } = nextMeta;

    return prevMeta[prevLength - 1].index - nextMeta[nextLength - 1].index;
  }

  return 0;
}

/**
 * @function sortRoutes
 * @param branches Route branches.
 */
function sortRoutes<T>(branches: RouteBranch<T>[]): RouteBranch<T>[] {
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

  for (const route of routes) {
    const backtrace = () => {
      paths.pop();
      metadata.pop();
    };

    const paths: string[] = [];
    const metadata: RouteBranchMeta<T>[] = [];
    const items = new Tree(route, route => route.children).dfs(backtrace);

    for (const [index, item] of items) {
      const { path: to, index: isIndex } = item;
      const from = paths.reduce((from, to) => resolve(from, to), basename);

      assert(
        isIndex && 'path' in item,
        `Index routes must not have path. Please remove path property from route path "${from}".`
      );

      assert(
        isIndex && 'children' in item,
        `Index routes must not have child routes. Please remove all child routes from route path "${from}".`
      );

      assert(
        to != null && isAbsolute(to) && !to.startsWith(from),
        `Absolute route path "${to}" nested under path "${from}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      );

      paths.push(to);
      metadata.push({ index, route: item });

      if (isIndex || to != null) {
        const path = resolve(from, to);
        const { caseSensitive, end } = item;

        branches.push({
          path,
          end: end !== false,
          meta: [...metadata],
          score: computeScore(path, isIndex),
          caseSensitive: caseSensitive === true
        });
      }

      const { children } = item;

      if (!children || children.length <= 0) {
        backtrace();
      }
    }
  }

  return sortRoutes(branches);
}
