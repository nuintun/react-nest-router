/**
 * @types
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
 * A unique string associated with a location. May be used to safely store
 * and retrieve data in some other storage API, like `localStorage`.
 */
export type Key = string;

/**
 * An entry in a history stack. A location contains information about the
 * URL path, as well as possibly some arbitrary state and a key.
 */
export interface Location<S = unknown> extends Path {
  key: Key;
  state: S;
}

/**
 * A change to the current location.
 */
export interface Update<S = unknown> {
  action: Action;
  location: Location<S>;
}

/**
 * A function that receives notifications about location changes.
 */
export interface Listener<S = unknown> {
  (update: Update<S>): void;
}

/**
 * A change to the current location that was blocked. May be retried
 * after obtaining user confirmation.
 */
export interface Transition<S = unknown> extends Update<S> {
  retry(): void;
}

/**
 * A function that receives transitions when navigation is blocked.
 */
export interface Blocker {
  (transition: Transition): void;
}

/**
 * Describes a location that is the destination of some navigation, either via
 * `history.push` or `history.replace`. May be either a URL or the pieces of a
 * URL path.
 */
export type To = string | Partial<Path>;

/**
 * A history is an interface to the navigation stack. The history serves as the
 * source of truth for the current location, as well as provides a set of
 * methods that may be used to change it.
 *
 * It is similar to the DOM's `window.history` object, but with a smaller, more
 * focused API.
 */
export interface Navigator {
  readonly action: Action;
  readonly location: Location;
  /**
   * @description Navigates to the previous entry in the stack. Identical to go(-1).
   */
  back(): void;
  /**
   * @description Navigates to the next entry in the stack. Identical to go(1).
   */
  forward(): void;
  /**
   * @description Navigates `n` entries backward/forward in the history stack relative to the current index.
   * @param delta The delta in the stack index
   */
  go(delta: number): void;
  /**
   *
   * @param to
   * @param state
   */
  push(to: To, state?: any): void;
  /**
   *
   * @param to
   * @param state
   */
  replace(to: To, state?: any): void;
  /**
   *
   * @param blocker
   */
  block(blocker: Blocker): () => void;
  /**
   *
   * @param listener
   */
  listen(listener: Listener): () => void;
}
