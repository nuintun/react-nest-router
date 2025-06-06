/**
 * @module normalize
 */

import assert from 'node:assert';
import path from 'node:path/posix';
import { normalize } from '../esm/path.js';

// 测试用例列表
const testCases = [
  '',
  'foo/.',
  '../../a',
  'foo/bar',
  '/../../a',
  '/var/lib',
  'foo//bar',
  'foo/bar/',
  'foo/./bar',
  'a/b//../c/./d/',
  'foo/bar/../baz',
  '/var/lib/../file'
];

/**
 * @function runTests
 */
export function runTests() {
  testCases.forEach(input => {
    const codeResult = normalize(input);
    const nodeResult = path.normalize(input);

    console.log(`Path: '${input}'`);
    console.log(`Code: '${codeResult}'`);
    console.log(`Node: '${nodeResult}'`);

    // 已知差异处理
    try {
      assert.strictEqual(codeResult, nodeResult);

      console.log(`✅ Matched\n`);
    } catch (error) {
      console.error(error.stack);
      console.log(`\n`);
    }
  });
}

// 执行测试
runTests();
