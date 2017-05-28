const fabricatorBuilderWebpackConfigCreator = require('../index');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const path = require('path');

const faviconsWebpackPlugin = new FaviconsWebpackPlugin('./fixtures/favicon.png');

module.exports = [
    {
        context: path.resolve(__dirname, './'),
        entry: {toolkit: './fixtures/entry.js'},
        output: {
            filename: '[name].[hash].js',
            path: path.resolve(__dirname, '../dist/assets'),
            publicPath: 'assets'
        },
        devServer: {port: 3000},
        plugins: [faviconsWebpackPlugin]
    },
    fabricatorBuilderWebpackConfigCreator({
        faviconsWebpackPlugin: faviconsWebpackPlugin
    })
];
