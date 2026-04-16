/**
 * @module app.config
 * @description 应用构建配置文件，定义打包规则的项目级配置
 */

import { resolve } from 'node:path';
import { defineConfig } from './tools/index.ts';

const js = resolve('app/js');
const css = resolve('app/css');
const images = resolve('app/images');
const html = resolve('wwwroot/index.html');
const fallback = resolve('wwwroot/404.html');
const favicon = resolve('app/images/favicon.ico');

const meta = {
  viewport: 'width=device-width,initial-scale=1.0'
};

// 生成配置文件
export default defineConfig({
  ports: 8000,
  lang: 'zh-CN',
  alias: {
    '/js': js,
    '/css': css,
    '/images': images
  },
  pages: [
    {
      meta,
      favicon,
      filename: html
    },
    {
      meta,
      favicon,
      filename: fallback
    }
  ],
  context: resolve('app'),
  historyApiFallback: html,
  name: 'React Nest Router',
  outputPath: resolve('wwwroot/public'),
  entry: resolve('app/js/pages/index.tsx'),
  publicPath: '/react-nest-router-examples/public/'
});
