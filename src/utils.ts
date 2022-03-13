/**
 * @module utils
 */

import { Tree } from './Tree';
import { isAbsolute, resolve } from './path';
import { Route, RouteBranch, RouteBranchMeta } from './types';

function isSplat(char: string): boolean {
  return char === '*';
}

function computeScore(path: string, index?: boolean): number {
  const splatPenalty = -2;
  const indexRouteValue = 2;
  const emptySegmentValue = 1;
  const dynamicSegmentValue = 3;
  const staticSegmentValue = 10;

  const segments = path.split('/');

  let initialScore = segments.length;

  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }

  if (index) {
    initialScore += indexRouteValue;
  }

  return segments.reduce((score, segment) => {
    if (isSplat(segment)) {
      return score;
    }

    if (segment === '') {
      return score + emptySegmentValue;
    }

    const paramRegexp = /^:\w+$/;

    if (paramRegexp.test(segment)) {
      return score + dynamicSegmentValue;
    }

    return score + staticSegmentValue;
  }, initialScore);
}

function invariant(cond: any, message: string): asserts cond {
  if (cond) throw new Error(message);
}

export function flattenRoutes<T>(routes: Route<T>[]): RouteBranch<T>[] {
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
      const from = paths.reduce((from, to) => resolve(from, to), '');

      invariant(
        isIndex && 'path' in item,
        `Index routes must not have path. Please remove path property from route path "${from}".`
      );

      invariant(
        isIndex && 'children' in item,
        `Index routes must not have child routes. Please remove all child routes from route path "${from}".`
      );

      invariant(
        to != null && isAbsolute(to) && !to.startsWith(from),
        `Absolute route path "${to}" nested under path "${from}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      );

      paths.push(to);
      metadata.push({ index, route: item });

      if (isIndex || to != null) {
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

      const { children } = item;

      if (!children || children.length <= 0) {
        backtrace();
      }
    }
  }

  return branches;
}
