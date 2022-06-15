/**
 * @module useOutletContext
 */

import { useContext } from 'react';
import { OutletContext } from '../context';
import { assert, readOnly } from '../utils';

/**
 * @function useOutletContext
 * @description Get outlet context.
 */
export function useOutletContext<C = unknown>(): Readonly<C> {
  const outletContext = useContext(OutletContext);

  if (__DEV__) {
    assert(outletContext, `The hook useOutletContext can only be used inside a route element.`);
  }

  return readOnly(outletContext!.context as Readonly<C>);
}
