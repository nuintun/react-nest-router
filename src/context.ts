/**
 * @module context
 */

import { Action } from 'history';
import { createContext } from 'react';
import { History, Location } from 'history';
import { Route, RouteMatch } from './types';

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
export interface RouteContext<T, K extends string> {
  readonly current: Route<T, K> | null;
  readonly match: RouteMatch<T, K> | null;
  readonly outlet: React.ReactElement | null;
}

// Location context.
export const LocationContext = createContext<LocationContext>(null!);

// Navigation context.
export const NavigationContext = createContext<NavigationContext>(null!);

// Route context.
export const RouteContext = createContext<RouteContext<any, string>>(null!);

// Set display name if development mode.
if (__DEV__) {
  RouteContext.displayName = 'Route';
  LocationContext.displayName = 'Location';
  NavigationContext.displayName = 'Navigation';
}
