/**
 * @module rollup.base
 */

import replace from '@rollup/plugin-replace';
import treeShake from './plugins/tree-shake';
import typescript from '@rollup/plugin-typescript';

function env() {
  return replace({
    values: {
      __DEV__: true
    },
    preventAssignment: true
  });
}

export default function rollup(esnext) {
  return {
    input: 'src/index.ts',
    output: {
      interop: false,
      esModule: false,
      dir: esnext ? 'esm' : 'cjs',
      format: esnext ? 'esm' : 'cjs'
    },
    preserveModules: true,
    plugins: [env(), typescript(), treeShake()],
    onwarn(error, warn) {
      if (error.code !== 'CIRCULAR_DEPENDENCY') {
        warn(error);
      }
    },
    external: ['tslib', 'react/jsx-runtime', 'react/jsx-dev-runtime']
  };
}
