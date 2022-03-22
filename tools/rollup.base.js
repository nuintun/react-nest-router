/**
 * @module rollup.base
 */

import pkg from '../package.json';
import replace from '@rollup/plugin-replace';
import treeShake from './plugins/tree-shake';
import typescript from '@rollup/plugin-typescript';

const banner = `/**
 * @module ${pkg.name}
 * @license ${pkg.license}
 * @version ${pkg.version}
 * @author ${pkg.author.name} <${pkg.author.email}>
 * @description ${pkg.description}
 * @see ${pkg.homepage}
 */
`;

/**
 * @function env
 * @param development
 */
function env() {
  return replace({
    preventAssignment: true,
    values: {
      __DEV__: `process.env.NODE_ENV !== 'production'`
    }
  });
}

/**
 * @function rollup
 * @param esnext
 * @param development
 */
export default function rollup(esnext) {
  return {
    input: 'src/index.ts',
    preserveModules: true,
    output: {
      banner,
      interop: false,
      exports: 'auto',
      esModule: false,
      dir: esnext ? 'esm' : 'cjs',
      format: esnext ? 'esm' : 'cjs'
    },
    plugins: [env(), typescript(), treeShake()],
    onwarn(error, warn) {
      if (error.code !== 'CIRCULAR_DEPENDENCY') {
        warn(error);
      }
    },
    external: ['tslib', 'react', 'history', 'react/jsx-runtime', 'react/jsx-dev-runtime']
  };
}
