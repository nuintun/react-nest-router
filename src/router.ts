/**
 * @module router
 */

import { Tree } from './Tree';
import { compile } from './pattern';
import { isAboveRoot, join, resolve } from './path';
import { assert, endsWith, isFunction } from './utils';
import { IRoute, Route, RouteBranch, RouteMatch, RouteSortBranch, SortBranchMeta } from './interface';

/**
 * @function computeScore
 * @param path Route path.
 * @param index Is index route.
 */
function computeScore(path: string, index?: boolean): number {
  const indexRouteValue = 2;
  const splatPenaltyValue = -2;
  const staticSegmentValue = 10;
  const dynamicSegmentValue = 3;

  const paramKeyRe = /:\w+/;
  const segments = path.split('/');

  let initialScore = segments.length;

  if (index) {
    initialScore += indexRouteValue;
  }

  if (endsWith(path, '*')) {
    segments.pop();

    initialScore += splatPenaltyValue;
  }

  return segments.reduce((score, segment) => {
    if (segment !== '') {
      const segments = segment.split(paramKeyRe);

      score += (segments.length - 1) * dynamicSegmentValue;

      return segments.reduce((score, segment) => {
        return segment === '' ? score : score + staticSegmentValue;
      }, score);
    }

    return score;
  }, initialScore);
}

/**
 * @function isBranchSiblings
 * @description Is siblings branch.
 * @param prev Prev route branch.
 * @param next Next route branch.
 */
function isBranchSiblings<M, K extends string>(prev: RouteSortBranch<M, K>, next: RouteSortBranch<M, K>): boolean {
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
function compareBranchMeta<M, K extends string>(prev: RouteSortBranch<M, K>, next: RouteSortBranch<M, K>): number {
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
function sortRouteBranches<M, K extends string>(branches: RouteSortBranch<M, K>[]): RouteBranch<M, K>[] {
  // Higher score first
  return branches
    .sort((prev, next) => {
      return prev.score !== next.score ? next.score - prev.score : compareBranchMeta(prev, next);
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
  const branches: RouteSortBranch<M, K>[] = [];

  // Traversal routes.
  for (const route of routes) {
    const meta: SortBranchMeta<M, K>[] = [];
    const paths: (string | undefined)[] = [];
    const items = new Tree<IRoute<M, K>>(route, ({ children }) => children).dfs(() => {
      meta.pop();
      paths.pop();
    });

    // Traversal nested routes.
    for (const [index, item] of items) {
      const from = paths.reduce<string>((from, to) => resolve(from, to), '/');
      const { path: to, index: isIndex, available, guard, children } = item;
      const isLayout = children && children.length > 0;
      const isAvailable = !isLayout || available;

      if (__DEV__) {
        const path = resolve(from, to);
        const isUnavailable = isLayout && !available;

        assert(
          !(isIndex && 'path' in item),
          `Index route must not have path. Please remove path property from route path "${path}".`
        );

        assert(
          !(isAvailable && !('element' in item)),
          `Available route must have element. Please add element property to route path "${path}".`
        );

        assert(
          !(isIndex && 'children' in item),
          `Index route must not have child routes. Please remove all child routes from route path "${path}".`
        );

        assert(
          !(!isIndex && 'index' in item),
          `Layout or page route must not have index. Please remove index property from route path "${path}".`
        );

        assert(
          !(isUnavailable && 'guard' in item),
          `Unavailable layout route must not have guard. Please remove guard property from route path "${path}".`
        );

        assert(
          !(!isLayout && 'available' in item),
          `Page or index route must not have available. Please remove available property from route path "${path}".`
        );

        assert(
          !(isUnavailable && 'sensitive' in item),
          `Unavailable layout route must not have sensitive. Please remove sensitive property from route path "${path}".`
        );

        assert(
          !(!isLayout && !isIndex && to == null),
          `The route nested under path "${from}" is not valid. It may be index or page route, but missing index or path property.`
        );

        assert(
          !('guard' in item && !isFunction(guard)),
          `The guard of the route path "${path}" must be a function. If the route has guard, the guard property must be a function.`
        );

        assert(
          !(to && isAboveRoot(from, to, item.sensitive)),
          `Absolute route path "${to}" nested under path "${from}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
        );
      }

      const metadata: SortBranchMeta<M, K> = {
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
          score: computeScore(path, isIndex),
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
