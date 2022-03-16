/**
 * @module types
 */

import React from 'react';

/**
 * Set object mutable
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * Combined route.
 */
export interface CRoute<T, K extends string> {
  meta?: T;
  path?: string;
  index?: boolean;
  sensitive?: boolean;
  children?: CRoute<T, K>[];
  element?: React.ReactNode;
  guard?: (match: RouteMatch<T, K>) => boolean;
}

/**
 * Index route.
 */
export interface IndexRoute<T, K extends string> {
  meta?: T;
  index: true;
  sensitive?: boolean;
  children?: undefined;
  element?: React.ReactNode;
  guard?: (match: RouteMatch<T, K>) => boolean;
}

/**
 * Page route.
 */
export interface PageRoute<T, K extends string> {
  meta?: T;
  path: string;
  index?: false;
  sensitive?: boolean;
  children?: undefined;
  element?: React.ReactNode;
  guard?: (match: RouteMatch<T, K>) => boolean;
}

/**
 * Layout route.
 */
export interface LayoutRoute<T, K extends string> {
  meta?: T;
  path?: string;
  index?: false;
  children: Route<T, K>[];
  element?: React.ReactNode;
}

/**
 * A route object represents a logical route, with (optionally) its child
 * routes organized in a tree-like structure.
 */
export type Route<T, K extends string> = LayoutRoute<T, K> | PageRoute<T, K> | IndexRoute<T, K>;

/**
 * The parameters that were parsed from the URL path.
 */
export type Params<K extends string> = {
  readonly [P in K]: string | undefined;
};

/**
 * Patch matcher
 */
export interface Matcher<K extends string> {
  readonly keys: K[];
  readonly path: string;
  readonly pattern: RegExp;
  readonly sensitive: boolean;
  readonly match: (pathname: string) => Params<K> | null;
}

/**
 * A RouteMatch contains info about how a route matched a URL.
 */
export interface RouteMatch<T, K extends string> {
  /**
   * The route path that was used to match.
   */
  readonly path: string;
  /**
   * The portion of the URL pathname that was matched before child routes.
   */
  readonly basename: string;
  /**
   * The portion of the URL pathname that was matched.
   */
  readonly pathname: string;
  /**
   * The names and values of dynamic parameters in the URL.
   */
  readonly params: Params<K>;
  /**
   * The route branch meta that was used to match.
   */
  readonly meta: Route<T, K>[];
}

/**
 * Route branch meta.
 */
export interface BranchMeta<T, K extends string> {
  readonly index: number;
  readonly route: Route<T, K>;
}

/**
 * Route branch.
 */
export interface RouteBranch<T, K extends string> {
  readonly score: number;
  readonly matcher: Matcher<K>;
  readonly meta: BranchMeta<T, K>[];
  readonly guard: (match: RouteMatch<T, K>) => boolean;
}

/**
 * Route context.
 */
export interface RouteContext<T, K extends string> {
  readonly current: Route<T, K> | null;
  readonly match: RouteMatch<T, K> | null;
  readonly outlet: React.ReactElement | null;
}
