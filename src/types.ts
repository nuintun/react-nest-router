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
export interface CRoute<T> {
  meta?: T;
  path?: string;
  index?: boolean;
  sensitive?: boolean;
  children?: CRoute<T>[];
  element?: React.ReactNode;
}

/**
 * Index route.
 */
export interface IndexRoute<T> {
  meta?: T;
  index: true;
  sensitive?: boolean;
  children?: undefined;
  element?: React.ReactNode;
}

/**
 * Page route.
 */
export interface PageRoute<T> {
  meta?: T;
  path: string;
  index?: false;
  sensitive?: boolean;
  children?: undefined;
  element?: React.ReactNode;
}

/**
 * Layout route.
 */
export interface LayoutRoute<T> {
  meta?: T;
  path?: string;
  index?: false;
  children: Route<T>[];
  element?: React.ReactNode;
}

/**
 * A route object represents a logical route, with (optionally) its child
 * routes organized in a tree-like structure.
 */
export type Route<T> = LayoutRoute<T> | PageRoute<T> | IndexRoute<T>;

/**
 * The parameters that were parsed from the URL path.
 */
export type Params<K extends string = string> = {
  readonly [P in K]: string | undefined;
};

/**
 * Patch matcher
 */
export interface Matcher {
  readonly path: string;
  readonly keys: string[];
  readonly pattern: RegExp;
  readonly match: <K extends string = string>(pathname: string) => Params<K> | null;
}

/**
 * A RouteMatch contains info about how a route matched a URL.
 */
export interface RouteMatch<T, K extends string = string> {
  /**
   * The route object that was used to match.
   */
  readonly route: Route<T>;
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
}

/**
 * Route branch meta.
 */
export interface BranchMeta<T> {
  readonly index: number;
  readonly route: Route<T>;
  readonly referrer: string;
}

/**
 * Route branch.
 */
export interface RouteBranch<T> {
  readonly score: number;
  readonly matcher: Matcher;
  readonly meta: BranchMeta<T>[];
}

/**
 * Route context.
 */
export interface RouteContext<T, K extends string = string> {
  readonly matches: RouteMatch<T, K>[];
  readonly current: RouteMatch<T, K> | null;
  readonly outlet: React.ReactElement | null;
}
