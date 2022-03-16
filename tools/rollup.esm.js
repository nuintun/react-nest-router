/**
 * @module rollup.esm
 */

import rollup from './rollup.base';

export default [rollup(true, true), rollup(true, false)];
