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
 * Interface Route.
 */
export interface IRoute<M, K extends string> {
  meta?: M;
  index?: true;
  path?: string;
  sensitive?: boolean;
  children?: IRoute<M, K>[];
  element?: React.ReactNode;
  guard?: (match: RouteMatch<M, K>) => boolean;
}

/**
 * Index route.
 */
export interface IndexRoute<M, K extends string> {
  meta?: M;
  index: true;
  sensitive?: boolean;
  children?: undefined;
  element?: React.ReactNode;
  guard?: (match: RouteMatch<M, K>) => boolean;
}

/**
 * Page route.
 */
export interface PageRoute<M, K extends string> {
  meta?: M;
  path: string;
  index?: undefined;
  sensitive?: boolean;
  children?: undefined;
  element?: React.ReactNode;
  guard?: (match: RouteMatch<M, K>) => boolean;
}

/**
 * Layout route.
 */
export interface LayoutRoute<M, K extends string> {
  meta?: M;
  path?: string;
  index?: undefined;
  children: Route<M, K>[];
  element?: React.ReactNode;
}

/**
 * A route object represents a logical route, with (optionally) its child
 * routes organized in a tree-like structure.
 */
export type Route<M, K extends string> = LayoutRoute<M, K> | PageRoute<M, K> | IndexRoute<M, K>;

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
export interface RouteMatch<M, K extends string> {
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
  readonly meta: IRoute<M, K>[];
}

/**
 * Route branch meta.
 */
export interface BranchMeta<M, K extends string> {
  readonly index: number;
  readonly route: IRoute<M, K>;
}

/**
 * Route branch.
 */
export interface RouteBranch<M, K extends string> {
  readonly score: number;
  readonly matcher: Matcher<K>;
  readonly meta: BranchMeta<M, K>[];
  readonly guard: (match: RouteMatch<M, K>) => boolean;
}
