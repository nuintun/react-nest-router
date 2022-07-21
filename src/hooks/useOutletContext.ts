/**
 * @module useOutletContext
 */

import { assert } from '../utils';
import { useContext } from 'react';
import { OutletContext } from '../context';

/**
 * @function useOutletContext
 * @description Get outlet context.
 */
export function useOutletContext<C = unknown>(): C {
  const outletContext = useContext(OutletContext);

  if (__DEV__) {
    assert(outletContext, `The hook useOutletContext can only be used inside a route element.`);
  }

  return outletContext!.context as C;
}
