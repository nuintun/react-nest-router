/**
 * @module types
 */

import React from 'react';
import { Action, Location as ILocation, To } from 'history';

/**
 * Set object mutable
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * Interface Route.
 */
export interface IRoute<M = unknown, K extends string = string> {
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
export interface IndexRoute<M = unknown, K extends string = string> {
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
export interface PageRoute<M = unknown, K extends string = string> {
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
export interface LayoutRoute<M = unknown, K extends string = string> {
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
export type Route<M = unknown, K extends string = string> = LayoutRoute<M, K> | PageRoute<M, K> | IndexRoute<M, K>;

/**
 * The parameters that were parsed from the URL path.
 */
export type Params<K extends string = string> = {
  readonly [P in K]: string | undefined;
};

/**
 * Patch matcher
 */
export interface Matcher<K extends string = string> {
  readonly keys: K[];
  readonly path: string;
  readonly pattern: RegExp;
  readonly sensitive: boolean;
  readonly match: (pathname: string) => Params<K> | null;
}

/**
 * A RouteMatch contains info about how a route matched a URL.
 */
export interface RouteMatch<M = unknown, K extends string = string> {
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
export interface BranchMeta<M = unknown, K extends string = string> {
  readonly index: number;
  readonly route: IRoute<M, K>;
}

/**
 * Route branch.
 */
export interface RouteBranch<M = unknown, K extends string = string> {
  readonly score: number;
  readonly matcher: Matcher<K>;
  readonly meta: BranchMeta<M, K>[];
  readonly guard: (match: RouteMatch<M, K>) => boolean;
}

/**
 * Location.
 */
export interface Location<S = unknown> extends ILocation {
  state: S;
}

/**
 * Navigator update.
 */
export interface NavigatorUpdate<S = unknown> {
  action: Action;
  location: Location<S>;
}

/**
 * Navigator listener.
 */
export interface NavigatorListener {
  <S = unknown>(update: NavigatorUpdate<S>): void;
}

/**
 * Navigator.
 */
export interface Navigator {
  action: Action;
  location: Location;
  go(delta: number): void;
  push<S = unknown>(to: To, state?: S): void;
  replace<S = unknown>(to: To, state?: S): void;
  listen(listener: NavigatorListener): () => void;
}

export interface NavigateOptions<S> {
  state?: S;
  replace?: boolean;
}

export interface Navigate {
  (delta: number): void;
  <S = unknown>(to: To, options?: NavigateOptions<S>): void;
}

/**
 * Route props.
 */
export interface RouterProps<M = unknown, K extends string = string, C = unknown> {
  context?: C;
  basename?: string;
  routes: Route<M, K>[];
  navigator?: Navigator;
  children?: React.ReactNode;
}

/**
 * Outlet props.
 */
export interface OutletProps<C = unknown> {
  context?: C;
}

/**
 * Navigate props.
 */
export interface NavigateProps<S = unknown> {
  to: To;
  state?: S;
  replace?: boolean;
}
