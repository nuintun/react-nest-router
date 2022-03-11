/**
 * @module types
 */

import React from 'react';

/**
 * A route object represents a logical route, with (optionally) its child
 * routes organized in a tree-like structure.
 */
export interface RouteObject<T = unknown> {
  meta?: T;
  path?: string;
  index?: boolean;
  caseSensitive?: boolean;
  element?: React.ReactNode;
  children?: RouteObject<T>[];
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
   * The portion of the URL pathname that was matched before child routes.
   */
  basename: string;
  /**
   * The portion of the URL pathname that was matched.
   */
  pathname: string;
  /**
   * The route object that was used to match.
   */
  route: RouteObject<T>;
  /**
   * The names and values of dynamic parameters in the URL.
   */
  params: Params<ParamKey>;
}

export interface RouteBranchMeta {
  route: RouteObject;
  relativePath: string;
  childrenIndex: number;
  caseSensitive: boolean;
}

export interface RouteBranch {
  path: string;
  score: number;
  meta: RouteBranchMeta[];
}
