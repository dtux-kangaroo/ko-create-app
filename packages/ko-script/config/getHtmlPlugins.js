const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./defaultPaths');

module.exports = function getHtmlPlugins(entries) {
  if (typeof entries === 'string' || Array.isArray(entries)) {
    return [
      new HtmlWebpackPlugin({
        template: paths.appHtml,
        filename: 'index.html',
        inject: 'body',
        showErrors: true,
        hash: true,
      }),
    ];
  }
  const entriesNames = Object.keys(entries);
  return entriesNames.map(entryName => {
    return new HtmlWebpackPlugin({
      excludeChunks: entriesNames.filter(n => n !== entryName),
      filename: 'index.html',
      inject: 'body',
      showErrors: true,
      hash: true,
    });
  });
};
