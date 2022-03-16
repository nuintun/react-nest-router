/**
 * @module rollup.cjs
 */

import rollup from './rollup.base';

export default [rollup(false, true), rollup(false, false)];
