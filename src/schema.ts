/**
 * @module schema
 */

import { IRoute } from './interface';
import { assert, hasOwnKey, isFunction, isString } from './utils';

/**
 * @function properties
 * @param target Object target.
 * @param whitelist Keys whitelist.
 * @param message Unknow key message.
 */
function properties<T extends Record<any, any>>(
  target: T,
  whitelist: (keyof T)[],
  message: (key: keyof T) => string
): never | void {
  const keys = Object.keys(target);

  for (const key of keys) {
    assert(whitelist.indexOf(key) >= 0, message(key));
  }
}

/**
 * @function assertPath
 * @param route Route target.
 * @param path Route path.
 * @param type Route type.
 */
function assertPath(route: IRoute, path: string, type: string): never | void {
  if (hasOwnKey(route, 'path')) {
    const cond = route.path && isString(route.path);

    assert(cond, `Property "path" in ${type} route "${path}" must be a non empty string`);
  }
}

/**
 * @function assertGuard
 * @param route Route target.
 * @param path Route path.
 * @param type Route type.
 */
function assertGuard(route: IRoute, path: string, type: string): never | void {
  if (hasOwnKey(route, 'guard')) {
    assert(isFunction(route.guard), `Property "guard" in ${type} route "${path}" must be a function`);
  }
}

/**
 * @function assertChildren
 * @param route Route target.
 * @param path Route path.
 * @param type Route type.
 */
function assertChildren(route: IRoute, path: string, type: string): never | void {
  assertRequired(route, 'children', path, type);

  const cond = Array.isArray(route.children) && route.children.length > 0;

  assert(cond, `Property "children" in ${type} route "${path}" must be a non empty array`);
}

/**
 * @function assertRequired
 * @param route Route target.
 * @param key Required key.
 * @param path Route path.
 * @param type Route type.
 */
function assertRequired(route: IRoute, key: keyof IRoute, path: string, type: string): never | void {
  assert(hasOwnKey(route, key), `Property "${key}" in ${type} route "${path}" is required`);
}

/**
 * @function assertUnknow
 * @param route Route target.
 * @param path Route path.
 * @param type Route type.
 * @param whitelist Keys whitelist.
 */
function assertUnknow(route: IRoute, path: string, type: string, whitelist: (keyof IRoute)[]): never | void {
  properties(route, whitelist, key => {
    return `Unknow property "${key}" in ${type} route "${path}".`;
  });
}

/**
 * @function assertIndexRoute
 * @param route Route target.
 * @param path Route path.
 */
export function assertIndexRoute(route: IRoute, path: string): never | void {
  const type = 'index';

  assertGuard(route, path, type);

  assertRequired(route, 'element', path, type);

  assertUnknow(route, path, type, ['meta', 'guard', 'index', 'element', 'sensitive']);
}

/**
 * @function assertPageRoute
 * @param route Route target.
 * @param path Route path.
 */
export function assertPageRoute(route: IRoute, path: string): never | void {
  const type = 'page';

  assertPath(route, path, type);

  assertGuard(route, path, type);

  assertRequired(route, 'path', path, type);

  assertRequired(route, 'element', path, type);

  assertUnknow(route, path, type, ['meta', 'path', 'guard', 'element', 'sensitive']);
}

/**
 * @function assertLayoutRoute
 * @param route Route target.
 * @param path Route path.
 */
export function assertLayoutRoute(route: IRoute, path: string): never | void {
  const type = 'layout';

  assertPath(route, path, type);

  assertChildren(route, path, type);

  assertUnknow(route, path, type, ['meta', 'path', 'element', 'children']);
}

/**
 * @function assertReachableLayoutRoute
 * @param route Route target.
 * @param path Route path.
 */
export function assertReachableLayoutRoute(route: IRoute, path: string): never | void {
  const type = 'reachable layout';

  assertPath(route, path, type);

  assertGuard(route, path, type);

  assertChildren(route, path, type);

  assertRequired(route, 'element', path, type);

  assertUnknow(route, path, type, ['meta', 'path', 'guard', 'element', 'children', 'reachable', 'sensitive']);
}
