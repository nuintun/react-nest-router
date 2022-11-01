/**
 * @module context
 */

import { ReactElement } from 'react';
import { createContext } from 'react';
import { Action, Location, Navigator, RouteMatch } from './interface';

// Outlet context.
export const OutletContext = createContext<unknown>(null);

/**
 * Route context.
 */
export interface RouteContext {
  readonly index: number;
  readonly outlet: ReactElement | null;
  readonly match: RouteMatch<unknown, string>;
}

// Route context.
export const RouteContext = createContext<RouteContext | null>(null);

/**
 * Locate context.
 */
export interface LocateContext {
  readonly action: Action;
  readonly location: Location<unknown>;
}

// Locate context.
export const LocateContext = createContext<LocateContext | null>(null);

/**
 * Navigation context.
 */
export interface NavigationContext {
  readonly basename: string;
  readonly navigator: Navigator;
}

// Navigation context.
export const NavigationContext = createContext<NavigationContext | null>(null);

// Set display name if development mode.
if (__DEV__) {
  RouteContext.displayName = 'RouteContext';
  OutletContext.displayName = 'OutletContext';
  LocateContext.displayName = 'LocateContext';
  NavigationContext.displayName = 'NavigationContext';
}
