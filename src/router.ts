/**
 * @module router
 */

import { Tree } from './Tree';
import { compile } from './pattern';
import { assert, hasOwnKey } from './utils';
import { isOutsideRoot, isWildcard, join, resolve } from './path';
import { IRoute, RankRouteBranch, RankRouteMeta, Route, RouteBranch, RouteMatch } from './interface';
import { assertAvailableLayoutRoute, assertIndexRoute, assertLayoutRoute, assertPageRoute } from './schema';

/**
 * @function computeWeight
 * @param path Route path.
 * @param index Is index route.
 * @link https://github.com/remix-run/react-router
 */
function computeWeight(path: string, index?: boolean): number {
  const indexRouteWeight = 2;
  const emptySegmentWeight = 1;
  const splatPenaltyWeight = -2;
  const dynamicSegmentWeight = 3;
  const staticSegmentWeight = 10;

  const paramRegExp = /^:\w+$/;
  const segments = path.split('/');

  // Initial weight.
  let weight = segments.length;

  if (index) {
    weight += indexRouteWeight;
  }

  // If wildcard path.
  if (isWildcard(path)) {
    segments.pop();

    weight += splatPenaltyWeight;
  }

  return segments.reduce((weight, segment) => {
    if (segment === '') {
      return weight + emptySegmentWeight;
    }

    if (paramRegExp.test(segment)) {
      return weight + dynamicSegmentWeight;
    }

    return weight + staticSegmentWeight;
  }, weight);
}

/**
 * @function isSiblingBranch
 * @description Is sibling branch.
 * @param prev Prev route branch.
 * @param next Next route branch.
 */
function isSiblingBranch<M, K extends string>(prev: RankRouteBranch<M, K>, next: RankRouteBranch<M, K>): boolean {
  const { meta: prevMeta } = prev;
  const { meta: nextMeta } = next;
  const { length: prevLength } = prevMeta;
  const { length: nextLength } = nextMeta;

  if (prevLength === nextLength) {
    // Ignore last meta.
    for (let index = prevLength - 2; index >= 0; index--) {
      if (prevMeta[index].index !== nextMeta[index].index) {
        // Not sibling.
        return false;
      }
    }

    // Is sibling.
    return true;
  }

  // Not sibling.
  return false;
}

/**
 * @function compareBranchMeta
 * @description Compare branch meta.
 * @param prev Prev route branch.
 * @param next Next route branch.
 */
function compareBranchMeta<M, K extends string>(prev: RankRouteBranch<M, K>, next: RankRouteBranch<M, K>): number {
  // If two routes are siblings, we should try to match the earlier sibling
  // first. This allows people to have fine-grained control over the matching
  // behavior by simply putting routes with identical paths in the order they
  // want them tried.
  if (isSiblingBranch(prev, next)) {
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
function sortRouteBranches<M, K extends string>(branches: RankRouteBranch<M, K>[]): RouteBranch<M, K>[] {
  // Higher score first
  return branches
    .sort((prev, next) => {
      return prev.weight !== next.weight ? next.weight - prev.weight : compareBranchMeta(prev, next);
    })
    .map(({ basename, meta: metadata, matcher, guard }) => {
      const meta = metadata.map(({ route }) => route);

      return { basename, meta: __DEV__ ? Object.freeze(meta) : meta, matcher, guard };
    });
}

/**
 * @function flatten
 * @description Flatten user routes.
 * @param routes User routes.
 * @param basename The basename.
 */
export function flatten<M, K extends string>(routes: Route<M, K>[], basename: string): RouteBranch<M, K>[] {
  const defaultGuard = () => true;
  const branches: RankRouteBranch<M, K>[] = [];

  // Traversal routes.
  for (const route of routes) {
    const meta: RankRouteMeta<M, K>[] = [];
    const paths: (string | undefined)[] = [];

    // Traversal route use dfs.
    const items = new Tree<IRoute<M, K>>(route, ({ children }) => children).dfs(() => {
      meta.pop();
      paths.pop();
    });

    // Traversal nested routes.
    for (const [index, item] of items) {
      const from = paths.reduce<string>((from, to) => resolve(from, to), '/');
      const { available, children, guard, index: isIndex, path: to } = item;
      const isLayout = children && children.length > 0;
      const isAvailable = !isLayout || available;

      if (__DEV__) {
        const path = resolve(from, to);

        if (isIndex) {
          assertIndexRoute(item, path);
        } else if (available) {
          assertAvailableLayoutRoute(item, path);
        } else if (hasOwnKey(item, 'children')) {
          assertLayoutRoute(item, path);
        } else {
          assertPageRoute(item, path);
        }

        if (to) {
          const cond = !isOutsideRoot(from, to, item.sensitive);

          assert(cond, `Route "${path}" is outside parent route "${from}"`);
        }
      }

      const metadata: RankRouteMeta<M, K> = {
        index,
        route: item
      };

      if (isAvailable) {
        const path = join(basename, resolve(from, to));

        // Routes with children is layout routes,
        // otherwise is page routes or index routes,
        // only page, index and available layout routes will add to branches.
        branches.push({
          basename,
          meta: [...meta, metadata],
          guard: guard || defaultGuard,
          weight: computeWeight(path, isIndex),
          matcher: compile(path, item.sensitive)
        });
      }

      // Route is layout route.
      if (isLayout) {
        // Cache meta.
        meta.push(metadata);
        // Cache paths.
        paths.push(to);
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
 */
export function match<M, K extends string>(routes: RouteBranch<M, K>[], pathname: string): RouteMatch<M, K> | null {
  // Match route branches.
  for (const { basename, meta: matches, matcher, guard } of routes) {
    const params = matcher.match(pathname);

    if (params) {
      const match = { path: matcher.path, basename, pathname, params, matches };

      if (guard(__DEV__ ? Object.freeze(match) : match)) {
        return match;
      }
    }
  }

  return null;
}
