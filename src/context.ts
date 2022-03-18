/**
 * @module context
 */

import React from 'react';
import { Action } from 'history';
import { createContext } from 'react';
import { IRoute, Location, Navigator, RouteMatch } from './types';

/**
 * Route context.
 */
export interface RouteContext {
  readonly current: IRoute<unknown, string>;
  readonly outlet: React.ReactElement | null;
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
  navigator: Navigator;
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
