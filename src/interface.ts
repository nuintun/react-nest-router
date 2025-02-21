/**
 * @module interface
 */

import { ReactNode } from 'react';
import { Navigator, To } from './navigator';

/**
 * Reexport navigator types.
 */
export type { Action, Location, Navigator, NavigatorEvent, To } from './navigator';

/**
 * Set object mutable.
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * Non empty array.
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Guard function.
 */
export interface Guard<M = unknown, K extends string = string> {
  (match: RouteMatch<M, K>): boolean;
}

/**
 * Interface Route.
 */
export interface IRoute<M = unknown, K extends string = string> {
  readonly meta?: M;
  readonly index?: true;
  readonly path?: string;
  readonly element?: ReactNode;
  readonly guard?: Guard<M, K>;
  readonly reachable?: boolean;
  readonly sensitive?: boolean;
  readonly children?: NonEmptyArray<IRoute<M, K>>;
}

/**
 * Page route.
 */
export interface PageRoute<M = unknown, K extends string = string> {
  readonly meta?: M;
  readonly path: string;
  readonly index?: never;
  readonly children?: never;
  readonly reachable?: never;
  readonly element: ReactNode;
  readonly guard?: Guard<M, K>;
  readonly sensitive?: boolean;
}

/**
 * Index route.
 */
export interface IndexRoute<M = unknown, K extends string = string> {
  readonly meta?: M;
  readonly index: true;
  readonly path?: never;
  readonly children?: never;
  readonly reachable?: never;
  readonly element: ReactNode;
  readonly guard?: Guard<M, K>;
  readonly sensitive?: boolean;
}

/**
 * Layout route.
 */
export interface LayoutRoute<M = unknown, K extends string = string> {
  readonly meta?: M;
  readonly guard?: never;
  readonly index?: never;
  readonly path?: string;
  readonly reachable?: never;
  readonly sensitive?: never;
  readonly element?: ReactNode;
  readonly children: NonEmptyArray<Route<M, K>>;
}

/**
 * Reachable layout route.
 */
export interface ReachableLayoutRoute<M = unknown, K extends string = string> {
  readonly meta?: M;
  readonly index?: never;
  readonly path?: string;
  readonly reachable: true;
  readonly element: ReactNode;
  readonly guard?: Guard<M, K>;
  readonly sensitive?: boolean;
  readonly children: NonEmptyArray<Route<M, K>>;
}

/**
 * A route object represents a logical route, with (optionally) its child
 * routes organized in a tree-like structure.
 */
export type Route<M = unknown, K extends string = string> =
  | ReachableLayoutRoute<M, K>
  | LayoutRoute<M, K>
  | IndexRoute<M, K>
  | PageRoute<M, K>;

/**
 * The parameters that were parsed from the URL path.
 */
export type Params<K extends string = string> = {
  readonly [P in K]: string | undefined;
};

/**
 * Patch matcher.
 */
export interface Matcher<K extends string = string> {
  readonly path: string;
  readonly pattern: RegExp;
  readonly sensitive: boolean;
  readonly keys: Readonly<K[]>;
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
  readonly matches: Readonly<IRoute<M, K>[]>;
}

/**
 * Route branch.
 */
export interface RouteBranch<M = unknown, K extends string = string> {
  readonly basename: string;
  readonly guard: Guard<M, K>;
  readonly matcher: Matcher<K>;
  readonly meta: Readonly<IRoute<M, K>[]>;
}

/**
 * Rank route meta.
 */
export interface RankRouteMeta<M = unknown, K extends string = string> {
  readonly index: number;
  readonly route: IRoute<M, K>;
}

/**
 * Rank route branch.
 */
export interface RankRouteBranch<M = unknown, K extends string = string> {
  readonly weight: number;
  readonly basename: string;
  readonly guard: Guard<M, K>;
  readonly matcher: Matcher<K>;
  readonly meta: Readonly<RankRouteMeta<M, K>[]>;
}

/**
 * Navigate options.
 */
export interface NavigateOptions<S> {
  readonly state?: S;
  readonly replace?: boolean;
}

/**
 * Navigate.
 */
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
  readonly children?: ReactNode;
  readonly navigator?: Navigator;
  readonly routes: Route<M, K>[];
}
