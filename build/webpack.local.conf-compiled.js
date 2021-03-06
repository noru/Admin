'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = require('../config');
var webpack = require('webpack');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// add hot-reload related code to entry chunks
(0, _keys2.default)(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name]);
});

module.exports = merge(baseWebpackConfig, {
  /*module: {
    loaders: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },*/
  // eval-source-map is faster for development
  devtool: '#eval-source-map',
  output: {
    path: config.local.assetsRoot,
    publicPath: config.local.assetsPublicPath,
    filename: '[name].bundle.js'
  },
  plugins: [new webpack.DefinePlugin({
    'process.env': config.local.env
  }),
  // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
  new webpack.optimize.OccurenceOrderPlugin(), new webpack.HotModuleReplacementPlugin(), new webpack.NoErrorsPlugin(),
  // https://github.com/ampedandwired/html-webpack-plugin
  new HtmlWebpackPlugin({
    filename: config.local.index, //output index in '/' directory
    template: 'index.html',
    inject: true
  })],
  eslint: {
    emitWarning: true,
    emitError: false
  }
});

//# sourceMappingURL=webpack.local.conf-compiled.js.map