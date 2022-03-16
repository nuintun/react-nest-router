/**
 * @module context
 */

import { Action } from 'history';
import { createContext } from 'react';
import { Route, RouteMatch } from './types';
import { History, Location } from 'history';

/**
 * Navigation context.
 */
export interface NavigationContext {
  basename: string;
  navigator: History;
}

/**
 * Location context.
 */
export interface LocationContext {
  action: Action;
  location: Location;
}

/**
 * Route context.
 */
export interface RouteContext {
  readonly outlet: React.ReactElement | null;
  readonly current: Route<any, string> | null;
  readonly match: RouteMatch<any, string> | null;
}

// Outlet context.
export const OutletContext = createContext<unknown>(null);

// Route context.
export const RouteContext = createContext<RouteContext | null>(null);

// Location context.
export const LocationContext = createContext<LocationContext | null>(null);

// Navigation context.
export const NavigationContext = createContext<NavigationContext | null>(null);

// Set display name if development mode.
if (__DEV__) {
  RouteContext.displayName = 'Route';
  OutletContext.displayName = 'Outlet';
  LocationContext.displayName = 'Location';
  NavigationContext.displayName = 'Navigation';
}
