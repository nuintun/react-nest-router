/**
 * @module utils
 */

import { RouteBranch, RouteObject } from './types';

type Resolve<T> = (node: T, index: number) => T[] | void;

type IteratorValue<T> = [index: number, node: T, parent: T | undefined];

type Waiting<T> = [iterator: Iterator<[index: number, value: T], undefined>, parent?: T];

/**
 * @class NestedList
 * @description An iterable nested list.
 */
export class NestedList<T> {
  private items: T[];

  /**
   * @constructor
   * @description An iterable nested list.
   * @param items Nested list items.
   * @param resolve Items resolve function.
   */
  constructor(items: T[], private resolve: Resolve<T>) {
    this.items = items;
  }

  /**
   * @method dfs
   * @description The dfs traversal iterator.
   */
  *dfs(): Iterable<IteratorValue<T>> {
    const { items, resolve } = this;
    const waiting: Waiting<T>[] = [];

    let current: Waiting<T> | undefined = [items.entries()];

    while (current) {
      const [iterator] = current;
      const item = iterator.next();

      if (item.done) {
        current = waiting.pop();
      } else {
        const [, parent] = current;
        const [index, node] = item.value;
        const children = resolve(node, index);

        if (children && children.length > 0) {
          waiting.push(current);

          current = [children.entries(), node];
        }

        yield [index, node, parent];
      }
    }
  }
}

export function flattenRoutes<T>(routes: RouteObject<T>[]): RouteBranch[] {
  const items = new NestedList(routes, route => route.children).dfs();

  for (const [index, item, parent] of items) {
    let meta: RouteMeta = {
      relativePath: route.path || '',
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
  }

  return [];
}
