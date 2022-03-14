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
export interface IndexRoute<T = unknown> {
  meta?: T;
  index: true;
  sensitive?: boolean;
  children?: undefined;
  element?: React.ReactNode;
}

/**
 * Page route.
 */
export interface PageRoute<T = unknown> {
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
export interface LayoutRoute<T = unknown> {
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
export type Route<T = unknown> = LayoutRoute<T> | PageRoute<T> | IndexRoute<T>;

/**
 * The parameters that were parsed from the URL path.
 */
export type Params<K extends string = string> = {
  readonly [P in K]: string | undefined;
};

/**
 * A RouteMatch contains info about how a route matched a URL.
 */
export interface RouteMatch<K extends string = string, T = unknown> {
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
  params: Params<K>;
}

/**
 * Route branch metadata.
 */
export interface BranchMetadata<T> {
  index: number;
  route: Route<T>;
  referrer: string;
}

/**
 * Route branch.
 */
export interface RouteBranch<T> {
  path: string;
  score: number;
  sensitive: boolean;
  metadata: BranchMetadata<T>[];
}
