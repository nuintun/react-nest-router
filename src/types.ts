/**
 * @module types
 */

import React from 'react';

/**
 * Combined route.
 */
export interface CRoute<T> {
  meta?: T;
  path?: string;
  index?: boolean;
  children?: CRoute<T>[];
  caseSensitive?: boolean;
  element?: React.ReactNode;
}

/**
 * Index route.
 */
export interface IndexRoute<T = unknown> {
  meta?: T;
  index: true;
  caseSensitive?: boolean;
  element?: React.ReactNode;
}

/**
 * Path route.
 */
export interface PathRoute<T = unknown> {
  meta?: T;
  path: string;
  children?: Route<T>[];
  caseSensitive?: boolean;
  element?: React.ReactNode;
}

/**
 * Layout route.
 */
export interface LayoutRoute<T = unknown> {
  meta?: T;
  children?: Route<T>[];
  element?: React.ReactNode;
}

/**
 * A route object represents a logical route, with (optionally) its child
 * routes organized in a tree-like structure.
 */
export type Route<T = unknown> = LayoutRoute<T> | PathRoute<T> | IndexRoute<T>;

/**
 * The parameters that were parsed from the URL path.
 */
export type Params<Key extends string = string> = {
  readonly [key in Key]: string | undefined;
};

/**
 * A RouteMatch contains info about how a route matched a URL.
 */
export interface RouteMatch<ParamKey extends string = string, T = unknown> {
  /**
   * The route object that was used to match.
   */
  route: Route<T>;
  /**
   * The portion of the URL pathname that was matched before child routes.
   */
  basename: string;
  /**
   * The portion of the URL pathname that was matched.
   */
  pathname: string;
  /**
   * The names and values of dynamic parameters in the URL.
   */
  params: Params<ParamKey>;
}

/**
 * Route branch metadata.
 */
export interface RouteBranchMeta<T> {
  index: number;
  route: Route<T>;
  basename: string;
}

/**
 * Route branch.
 */
export interface RouteBranch<T> {
  path: string;
  score: number;
  caseSensitive: boolean;
  meta: RouteBranchMeta<T>[];
}
