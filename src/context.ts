/**
 * @module context
 */

import React from 'react';
import { createContext } from 'react';
import { Action, Location, Navigator, RouteMatch } from './types';

/**
 * Route context.
 */
export interface RouteContext {
  readonly index: number;
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
