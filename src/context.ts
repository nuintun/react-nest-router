/**
 * @module context
 */

import { createContext } from 'react';
import { Action, History } from 'history';
import { IRoute, Location, Outlet, RouteMatch } from './types';

/**
 * Route context.
 */
export interface RouteContext {
  readonly Outlet: Outlet;
  readonly current: IRoute<unknown, string>;
  readonly match: RouteMatch<unknown, string>;
}

// Route context.
export const RouteContext = createContext<RouteContext | null>(null);

/**
 * Outlet context.
 */
export interface OutletContext {
  context: unknown;
}
// Outlet context.
export const OutletContext = createContext<OutletContext | null>(null);

/**
 * Location context.
 */
export interface LocationContext {
  action: Action;
  location: Location<unknown>;
}

// Location context.
export const LocationContext = createContext<LocationContext | null>(null);

/**
 * Navigation context.
 */
export interface NavigationContext {
  basename: string;
  navigator: History;
}

// Navigation context.
export const NavigationContext = createContext<NavigationContext | null>(null);

// Set display name if development mode.
if (__DEV__) {
  RouteContext.displayName = 'RouteContext';
  OutletContext.displayName = 'OutletContext';
  LocationContext.displayName = 'LocationContext';
  NavigationContext.displayName = 'NavigationContext';
}
