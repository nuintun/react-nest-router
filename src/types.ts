/**
 * @module types
 */

import React from 'react';
import { Navigator, To } from './navigator';

/**
 * Reexport history types.
 */
export type { Action, Location, Navigator, NavigatorEvent, To } from './navigator';

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
  readonly meta?: M;
  readonly index?: true;
  readonly path?: string;
  readonly sensitive?: boolean;
  readonly element?: React.ReactNode;
  readonly children?: IRoute<M, K>[];
  readonly guard?: (match: RouteMatch<M, K>) => boolean;
}

/**
 * Index route.
 */
export interface IndexRoute<M = unknown, K extends string = string> {
  readonly meta?: M;
  readonly index: true;
  readonly sensitive?: boolean;
  readonly children?: undefined;
  readonly element?: React.ReactNode;
  readonly guard?: (match: RouteMatch<M, K>) => boolean;
}

/**
 * Page route.
 */
export interface PageRoute<M = unknown, K extends string = string> {
  readonly meta?: M;
  readonly path: string;
  readonly index?: undefined;
  readonly sensitive?: boolean;
  readonly children?: undefined;
  readonly element?: React.ReactNode;
  readonly guard?: (match: RouteMatch<M, K>) => boolean;
}

/**
 * Layout route.
 */
export interface LayoutRoute<M = unknown, K extends string = string> {
  readonly meta?: M;
  readonly path?: string;
  readonly index?: undefined;
  readonly children: Route<M, K>[];
  readonly element?: React.ReactNode;
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
  readonly match: (path: string) => Params<K> | null;
}

/**
 * A RouteMatch contains info about how a route matched a URL.
 */
export interface RouteMatch<M = unknown, K extends string = string> {
  readonly path: string;
  readonly basename: string;
  readonly pathname: string;
  readonly params: Params<K>;
  readonly matches: IRoute<M, K>[];
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
  readonly basename: string;
  readonly matcher: Matcher<K>;
  readonly meta: BranchMeta<M, K>[];
  readonly guard: (match: RouteMatch<M, K>) => boolean;
}

export interface NavigateOptions<S> {
  readonly state?: S;
  readonly replace?: boolean;
}

export interface Navigate {
  (delta: number): void;
  <S = unknown>(to: To, options?: NavigateOptions<S>): void;
}

/**
 * Outlet props.
 */
export interface OutletProps<C = unknown> {
  readonly context?: C;
}

/**
 * Navigate props.
 */
export interface NavigateProps<S = unknown> extends NavigateOptions<S> {
  readonly to: To;
}

/**
 * Route props.
 */
export interface RouterProps<M = unknown, K extends string = string, C = unknown> {
  readonly context?: C;
  readonly basename?: string;
  readonly routes: Route<M, K>[];
  readonly navigator?: Navigator;
  readonly children?: React.ReactNode;
}
