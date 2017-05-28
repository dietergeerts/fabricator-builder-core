const fabricatorBuilderWebpackConfigCreator = require('../index');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');

const webpackAssetsManifest = new WebpackAssetsManifest({publicPath: 'assets/'});

module.exports = [
    {
        context: path.resolve(__dirname, './'),
        entry: {toolkit: './fixtures/entry.assets.js'},
        output: {
            filename: '[name].[hash].js',
            path: path.resolve(__dirname, '../dist/assets'),
            publicPath: 'assets'
        },
        devServer: {port: 3000},
        module: {rules: [{test: /\.css$/, use: ExtractTextPlugin.extract({use: [{loader: 'css-loader'}]})}]},
        plugins: [new ExtractTextPlugin('[name].[hash].css'), webpackAssetsManifest]
    },
    fabricatorBuilderWebpackConfigCreator({
        webpackAssetsManifest: webpackAssetsManifest
    })
];
