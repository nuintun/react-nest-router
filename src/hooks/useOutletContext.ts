/**
 * @module useOutletContext
 */

import { assert } from '../utils';
import { useContext } from 'react';
import { OutletContext } from '../context';

/**
 * @function useOutletContext
 */
export function useOutletContext<C = unknown>(): C {
  const outletContext = useContext(OutletContext);

  if (__DEV__) {
    assert(outletContext, `The hook useOutletContext can only be used in the context of a route component.`);
  }

  return outletContext!.context as C;
}
