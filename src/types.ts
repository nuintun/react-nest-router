/**
 * @module types
 */

import React from 'react';

/**
 * A route object represents a logical route, with (optionally) its child
 * routes organized in a tree-like structure.
 */
export interface Route<T = unknown> {
  meta?: T;
  path?: string;
  end?: boolean;
  index?: boolean;
  children?: Route<T>[];
  caseSensitive?: boolean;
  element?: React.ReactNode;
}

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

export interface RouteBranchMeta<T> {
  index: number;
  route: Route<T>;
}

export interface RouteBranch<T> {
  path: string;
  end: boolean;
  score: number;
  caseSensitive: boolean;
  meta: RouteBranchMeta<T>[];
}
