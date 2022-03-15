/**
 * @module router
 */

import { Tree } from './Tree';
import { compile } from './pattern';
import { assert, computeScore } from './utils';
import { isAbsolute, normalize, resolve } from './path';
import { BranchMetadata, CRoute, Route, RouteBranch } from './types';

/**
 * @function isBranchSiblings
 * @param prev Prev route branch.
 * @param next Next route branch.
 */
function isBranchSiblings<T>(prev: RouteBranch<T>, next: RouteBranch<T>): boolean {
  const { metadata: prevMetadata } = prev;
  const { metadata: nextMetadata } = next;
  const { length: prevLength } = prevMetadata;
  const { length: nextLength } = nextMetadata;

  return (
    prevLength === nextLength &&
    prevMetadata.slice(0, -1).every((meta, index) => {
      return meta.index === nextMetadata[index].index;
    })
  );
}

/**
 * @function compareBranchMeta
 * @param prev Prev route branch.
 * @param next Next route branch.
 */
function compareBranchMetadata<T>(prev: RouteBranch<T>, next: RouteBranch<T>): number {
  // If two routes are siblings, we should try to match the earlier sibling
  // first. This allows people to have fine-grained control over the matching
  // behavior by simply putting routes with identical paths in the order they
  // want them tried.
  if (isBranchSiblings(prev, next)) {
    const { metadata: prevMetadata } = prev;
    const { metadata: nextMetadata } = next;
    const { length: prevLength } = prevMetadata;
    const { length: nextLength } = nextMetadata;

    return prevMetadata[prevLength - 1].index - nextMetadata[nextLength - 1].index;
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
    return prev.score !== next.score ? next.score - prev.score : compareBranchMetadata(prev, next);
  });
}

/**
 * @function flattenRoutes
 * @param routes User routes.
 */
export function flattenRoutes<T>(routes: Route<T>[]): RouteBranch<T>[] {
  const branches: RouteBranch<T>[] = [];

  // Traversal routes.
  for (const route of routes) {
    const paths: (string | undefined)[] = [];
    const metadata: BranchMetadata<T>[] = [];
    const items = new Tree<CRoute<T>>(route, route => route.children).dfs(() => {
      paths.pop();
      metadata.pop();
    });

    // Traversal nested routes.
    for (const [index, item] of items) {
      const { path: to, index: isIndex, children } = item;
      const from = paths.reduce<string>((from, to) => resolve(from, to), '/');

      if (__DEV__) {
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
          `Layout or page route must not have index. Please remove index property from route path "${resolve(from, to)}".`
        );

        const hasChildren = children && children.length > 0;

        assert(
          !(hasChildren && 'sensitive' in item),
          `Layout route must not have sensitive. Please remove sensitive property from route path "${resolve(from, to)}".`
        );

        assert(
          !(!hasChildren && !isIndex && to == null),
          `The route nested under path "${from}" is not valid. It may be index or page route, but missing "index" or "path" property.`
        );

        assert(
          !(to && isAbsolute(to) && !to.startsWith(normalize(`${from}/`))),
          `Absolute route path "${to}" nested under path "${from}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
        );
      }

      // Route has children.
      if (children && children.length > 0) {
        // Cache paths.
        paths.push(to);

        // Cache metadata.
        metadata.push({
          index,
          referrer: from,
          route: item as Route<T>
        });
      } else {
        const { sensitive } = item;
        const path = resolve(from, isIndex ? './' : to);

        // Routes with children is layout routes,
        // otherwise is page routes or index routes,
        // only page page routes or index routes will add to branches.
        branches.push({
          path,
          metadata: [...metadata],
          matcher: compile(path, sensitive),
          score: computeScore(path, isIndex)
        });
      }
    }
  }

  // Sort route branches.
  return sortRouteBranches(branches);
}
