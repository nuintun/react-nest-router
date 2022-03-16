/**
 * @module rollup.base
 */

import replace from '@rollup/plugin-replace';
import treeShake from './plugins/tree-shake';
import typescript from '@rollup/plugin-typescript';

/**
 * @function env
 * @param development
 */
function env(development) {
  return replace({
    values: {
      __DEV__: development
    },
    preventAssignment: true
  });
}

/**
 * @function rollup
 * @param esnext
 * @param development
 */
export default function rollup(esnext, development) {
  const format = esnext ? 'esm' : 'cjs';
  const dir = development ? 'development' : 'production';

  return {
    input: 'src/index.ts',
    preserveModules: true,
    output: {
      format,
      interop: false,
      esModule: false,
      dir: `${format}/${dir}`
    },
    onwarn(error, warn) {
      if (error.code !== 'CIRCULAR_DEPENDENCY') {
        warn(error);
      }
    },
    plugins: [env(development), typescript(), treeShake()],
    external: ['tslib', 'react/jsx-runtime', 'react/jsx-dev-runtime']
  };
}
