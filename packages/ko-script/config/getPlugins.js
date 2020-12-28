/*
 * @Description: 设置生成dll文件配置
 * @version: 1.0.0
 * @Company: 袋鼠云
 * @Author: Charles
 * @Date: 2018-12-24 15:51:59
 * @LastEditors: Charles
 * @LastEditTime: 2019-09-04 11:51:00
 */

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const SimpleProgressPlugin = require('webpack-simple-progress-plugin');
const getHtmlPlugins = require('./getHtmlPlugins');
const getDllPlugins = require('./getDllPlugins');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const VueLoaderPlugin = require('vue-loader/lib/plugin');
const getTopBanner = require('./getTopBanner');
const webpack = require('webpack');
const getRulesHappy = require('./getRulesHappy');
const getUserConf = require('./getUserConf');

module.exports = (entry, program) => {
  const userDefinedWebpackConf = getUserConf().webpack;
  const userDefinedPlugins = userDefinedWebpackConf.plugins || [];
  let plugins = [
    // new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:6].css',
      chunkFilename: 'css/[id].[hash:6].css',
    }),
    new FilterWarningsPlugin({
      exclude: /Conflicting order between:/,
    }),
    new webpack.BannerPlugin(getTopBanner()),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new SimpleProgressPlugin(),
    new CaseSensitivePathsPlugin(),
    new webpack.ProvidePlugin({
      _: 'lodash',
    }),
  ];
  plugins = plugins.concat(userDefinedPlugins);
  if (process.env.NODE_ENV == 'production') {
    plugins.push(
      new CleanWebpackPlugin({
        verbose: false,
        dry: false,
      })
    );
  }
  const { micro, enableDll } = program;
  // debugger;
  // if (!micro || enableDll) {
  //   //引入 dll 文件
  //   Array.prototype.push.apply(plugins, getDllPlugins());
  // }
  // 增加 html 输出，支持多页面应用
  Array.prototype.push.apply(plugins, getHtmlPlugins(entry, micro));
  //加载happypackplugin
  Array.prototype.push.apply(plugins, getRulesHappy());
  return plugins;
};
