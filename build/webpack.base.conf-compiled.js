'use strict';

var path = require('path');
var webpack = require('webpack');
var config = require('../config');
var utils = require('./utils');
var projectRoot = path.resolve(__dirname, '../');

var conf = {
    entry: {
        app: ['./src/entry', 'bootstrap-loader']
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        fallback: [path.join(__dirname, '../node_modules')],
        alias: {
            'src': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../assets'),
            'components': path.resolve(__dirname, '../src/components'),
            'vuetable': 'vuetable/src/components/'
        }
    },
    plugins: [new webpack.ProvidePlugin({
        Vue: 'vue',
        $: "jquery",
        Store: path.resolve(__dirname, '../src/helpers/storage'),
        jQuery: "jquery",
        "window.jQuery": "jquery",
        Tether: "tether",
        "window.Tether": "tether",
        Tooltip: "exports?Tooltip!bootstrap/js/dist/tooltip",
        Alert: "exports?Alert!bootstrap/js/dist/alert",
        Button: "exports?Button!bootstrap/js/dist/button",
        Carousel: "exports?Carousel!bootstrap/js/dist/carousel",
        Collapse: "exports?Collapse!bootstrap/js/dist/collapse",
        Dropdown: "exports?Dropdown!bootstrap/js/dist/dropdown",
        Modal: "exports?Modal!bootstrap/js/dist/modal",
        Popover: "exports?Popover!bootstrap/js/dist/popover",
        Scrollspy: "exports?Scrollspy!bootstrap/js/dist/scrollspy",
        Tab: "exports?Tab!bootstrap/js/dist/tab",
        Util: "exports?Util!bootstrap/js/dist/util"
    })],
    resolveLoaders: {
        fallback: [path.join(__dirname, '../node_modules')]
    },
    module: {
        preLoaders: [{
            test: /\.vue$/,
            loader: 'eslint',
            include: projectRoot,
            exclude: /node_modules/
        }, {
            test: /\.js$/,
            loader: 'eslint',
            include: projectRoot,
            exclude: /node_modules/
        }],
        loaders: [{
            test: /\.vue$/,
            loader: 'vue'
        }, {
            test: /\.js$/,
            loader: 'babel',
            include: projectRoot,
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.json$/,
            loader: 'json'
        }, {
            test: /\.html$/,
            loader: 'vue-html'
        }, {
            test: /\.(png|jpe?g|gif)(\/..*)?$/,
            loader: 'url-loader?limit=10000'
        }, { test: /\.(woff2?|svg)$/, loader: 'url?limit=10000' }, { test: /\.(ttf|eot)$/, loader: 'file' }, { test: /bootstrap[\/\\]dist[\/\\]js[\/\\]umd[\/\\]/, loader: 'imports?jQuery=jquery' }]
    },
    eslint: {
        //formatter: require('eslint-friendly-formatter'),
        //emitError: true,
        //emitWarning: true,
        failOnError: true,
        failOnWarning: false
    },
    vue: {
        loaders: utils.cssLoaders()
    }
};

module.exports = conf;

//# sourceMappingURL=webpack.base.conf-compiled.js.map