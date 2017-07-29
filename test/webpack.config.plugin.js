const path = require('path');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const FabricatorBuilderPlugin = require('./../src/fabricator-builder/plugin');

module.exports = {
    context: path.resolve(__dirname, './'),
    entry: {toolkit: './fixtures/entry.js'},
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, '../dist/assets'),
        publicPath: 'assets',
    },
    devServer: {port: 3000},
    plugins: [
        new FaviconsWebpackPlugin('./fixtures/favicon.png'),
        new FabricatorBuilderPlugin(),
    ],
};
