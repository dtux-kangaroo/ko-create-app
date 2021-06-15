/*
 * @Description: 文件
 * @version: 1.0.0
 * @Company: 袋鼠云
 * @Author: Charles
 * @Date: 2020-03-03 18:11:12
 * @LastEditors: Charles
 * @LastEditTime: 2020-03-03 18:11:12
 */

const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'es'),
    filename: 'index.js',
    libraryExport: "default",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /js$|jsx$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              "plugins": [
                [
                  "@babel/plugin-proposal-decorators",
                  {
                      "legacy": true
                  }
                ],
                "@babel/plugin-proposal-class-properties",
              ]
            }
          }
        ]
      },
      {
        test: /css$/,
        use: ['css-loader']
      }
    ]
  }
}
