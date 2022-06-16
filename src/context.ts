/**
 * @module context
 */

import React from 'react';
import { createContext } from 'react';
import { Action, IRoute, Location, Navigator, RouteMatch } from './types';

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
  readonly context: unknown;
}

// Outlet context.
export const OutletContext = createContext<OutletContext | null>(null);

/**
 * Location context.
 */
export interface LocationContext {
  readonly action: Action;
  readonly location: Location<unknown>;
}

// Location context.
export const LocationContext = createContext<LocationContext | null>(null);

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
  LocationContext.displayName = 'LocationContext';
  NavigationContext.displayName = 'NavigationContext';
}
