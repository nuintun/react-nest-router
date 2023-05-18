/**
 * @module rollup.base
 */

import { createRequire } from 'module';
import replace from '@rollup/plugin-replace';
import treeShake from './plugins/tree-shake.js';
import typescript from '@rollup/plugin-typescript';

const pkg = createRequire(import.meta.url)('../package.json');

const banner = `/**
 * @package ${pkg.name}
 * @license ${pkg.license}
 * @version ${pkg.version}
 * @author ${pkg.author.name} <${pkg.author.email}>
 * @description ${pkg.description}
 * @see ${pkg.homepage}
 */
`;

/**
 * @function env
 * @return {import('rollup').Plugin}
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
 * @param {boolean} [esnext]
 * @return {import('rollup').RollupOptions}
 */
export default function rollup(esnext) {
  return {
    input: 'src/index.ts',
    output: {
      banner,
      interop: 'auto',
      exports: 'auto',
      esModule: false,
      preserveModules: true,
      dir: esnext ? 'esm' : 'cjs',
      format: esnext ? 'esm' : 'cjs',
      entryFileNames: `[name].${esnext ? 'js' : 'cjs'}`,
      chunkFileNames: `[name].${esnext ? 'js' : 'cjs'}`
    },
    plugins: [env(), typescript(), treeShake()],
    onwarn(error, warn) {
      if (error.code !== 'CIRCULAR_DEPENDENCY') {
        warn(error);
      }
    },
    external: ['tslib', 'react', 'react/jsx-runtime', 'react/jsx-dev-runtime']
  };
}
