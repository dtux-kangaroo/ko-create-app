/*
 * @Description: @description: 设置htmlPlugins 针对单个文件及多个文件
 * @version: 1.0.0
 * @Company: 袋鼠云
 * @Author: Charles
 * @Date: 2018-12-11 15:56:30
 * @LastEditors: Charles
 * @LastEditTime: 2019-01-28 17:17:55
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./defaultPaths');
const { getConfJsPath, getDllJsPath } = require('./getScriptPaths');
const verifyHtml = require('../util/verifyHtml');

module.exports = function getHtmlPlugins(entries, enableMicro) {
  //验证模板文件
  if (!enableMicro) {
    verifyHtml(paths.appHtml);
  }
  const config = getConfJsPath();
  let scripts = {};
  if (!enableMicro) {
    scripts = getDllJsPath();
  }
  return [
    new HtmlWebpackPlugin({
      template: paths.appHtml,
      filename: 'index.html',
      minify: true,
      title: '',
      assets: {
        // scripts,
        config,
      },
      chunksSortMode: 'none',
    }),
  ];
  //TODO: support multi HTML files in the future;
  if (typeof entries === 'string' || Array.isArray(entries)) {
    return [
      new HtmlWebpackPlugin({
        template: paths.appHtml,
        filename: 'index.html',
        minify: true,
        title: '',
        assets: {
          scripts,
          config,
        },
        chunksSortMode: 'none',
      }),
    ];
  }

  const entriesNames = Object.keys(entries);
  return entriesNames.map(entryName => {
    return new HtmlWebpackPlugin({
      excludeChunks: entriesNames.filter(n => n !== entryName),
      filename: `${entryName}.html`,
      template: paths.appHtml,
      minify: true,
      title: '',
      assets: {
        scripts,
        config,
      },
      //chunksSortMode:"none",
      chunksSortMode: 'none',
    });
  });
};
