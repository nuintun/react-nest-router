/**
 * @module types
 * @see https://github.com/remix-run/history
 */

import { Action } from './utils';

/**
 * A URL pathname, beginning with a /.
 */
export type Pathname = string;

/**
 * A URL search string, beginning with a ?.
 */
export type Search = string;

/**
 * A URL fragment identifier, beginning with a #.
 */
export type Hash = string;

/**
 * The pathname, search, and hash values of a URL.
 */
export interface Path {
  pathname: Pathname;
  search: Search;
  hash: Hash;
}

/**
 * An entry in a history stack. A location contains information about the
 * URL path, as well as possibly some arbitrary state and a key.
 */
export interface Location<S = unknown> extends Path {
  state: S;
}

/**
 * A change to the current location.
 */
export interface Update<S = unknown> {
  action: Action;
  location: Location<S>;
}

export interface HistoryState<S = unknown> {
  usr: S;
  idx: number;
}

/**
 * A function that receives notifications about location changes.
 */
export interface Listener<S = unknown> {
  (update: Update<S>): void;
}

/**
 * A function that receives transitions when navigation is blocked.
 */
export interface Resolver<S = unknown> {
  (update: Update<S>): Promise<void> | void;
}

/**
 * Describes a location that is the destination of some navigation, either via
 * `history.push` or `history.replace`. May be either a URL or the pieces of a
 * URL path.
 */
export type To = string | Partial<Path>;

/**
 * A history is an interface to the navigation stack. The navigator serves as the
 * source of truth for the current location, as well as provides a set of
 * methods that may be used to change it.
 *
 * It is similar to the DOM's `window.history` object, but with a smaller, more
 * focused API.
 */
export interface History {
  readonly action: Action;
  readonly location: Location;
  /**
   * @description Goes back one entry in the history stack. Alias for history.go(-1).
   */
  back(): void;
  /**
   * @description Goes forward one entry in the history stack. Alias for history.go(1).
   */
  forward(): void;
  /**
   * @description Navigates back/forward by delta entries in the stack.
   * @param delta The delta in the stack index.
   */
  go(delta: number): void;
  /**
   * @description Pushes a new entry onto the stack.
   * @param to The new URL.
   * @param state Data to associate with the new location.
   */
  push<S = unknown>(to: To, state?: S): void;
  /**
   * @description Replaces the current entry in the stack with a new one.
   * @param to The new URL.
   * @param state Data to associate with the new location.
   */
  replace<S = unknown>(to: To, state?: S): void;
  /**
   * @description Prevents changes to the history stack from happening and return unlisten function.
   * @param blocker A function that will be called when a transition is blocked.
   */
  block<S = unknown>(resolver: Resolver<S>): () => void;
  /**
   * @description Sets up a listener that will be called whenever the current location changes and return unlisten function.
   * @param listener A function that will be called when the location changes.
   */
  listen<S = unknown>(listener: Listener<S>): () => void;
}
