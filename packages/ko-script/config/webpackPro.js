/*
 * @Description: 文件
 * @version: 1.0.0
 * @Company: 袋鼠云
 * @Author: Charles
 * @Date: 2018-12-11 11:19:46
 * @LastEditors: Charles
 * @LastEditTime: 2019-09-04 11:52:43
 */
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpackMerge = require('webpack-merge');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const paths=require('./defaultPaths')
const webpack=require('webpack');
const getWebpackBase = require('./webpackBase');
const TerserPlugin = require('terser-webpack-plugin');

/**
 * @description: webpack生产环境配置
 * @param1: param
 * @param2: param
 * @return: ret
 * @Author: Charles
 * @Date: 2018-12-26 11:26:26
 */
module.exports = function getWebpackPro(program) {
  const baseConfig = getWebpackBase(program);
  baseConfig.optimization={
    moduleIds: 'hashed',
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        //extractComments: true,
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
     new OptimizeCSSAssetsPlugin({}),
    ]
  };
  baseConfig.plugins.push(
    // new CopyWebpackPlugin([
    //   { from: paths.appDll,to:paths.appDist+'/dll'},
    // ]),
    new webpack.optimize.SplitChunksPlugin({
      // chunks: "initial"，"async"和"all"分别是：初始块，按需块或所有块；
      chunks: 'async',
      // （默认值：30000s）块的最小大小
      minSize: 30000,
      maxSize:600000,
      // （默认值：1）分割前共享模块的最小块数
      minChunks: 1,
      // （缺省值5）按需加载时的最大并行请求数
      maxAsyncRequests: 5,
      // （默认值3）入口点上的最大并行请求数
      maxInitialRequests: 3,
      // webpack 将使用块的起源和名称来生成名称: `vendors~main.js`,如项目与"~"冲突，则可通过此值修改，Eg: '-'
      automaticNameDelimiter: '_',
      //automaticNameMaxLength: 30,
      // cacheGroups is an object where keys are the cache group names.
      //name: true,
      cacheGroups: {
        antd: {
          name: 'antd',
          test: /[\\/]node_modules[\\/]antd[\\/]/,
          chunks: 'initial',
        },
        lodash: {
          name: 'lodash',
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          chunks: 'initial',
          // 默认组的优先级为负数，以允许任何自定义缓存组具有更高的优先级（默认值为0）
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
      }
    }),
  )
  return webpackMerge(baseConfig, {});
};
