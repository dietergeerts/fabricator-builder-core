const fabricatorBuilderWebpackConfigCreator = require('../src/fabricator-builder/create-config');
const path = require('path');

module.exports = [
    {
        context: path.resolve(__dirname, './'),
        entry: {toolkit: './fixtures/entry.js'},
        output: {
            filename: '[name].[hash].js',
            path: path.resolve(__dirname, '../dist/assets'),
            publicPath: 'assets'
        },
        devServer: {port: 3000}
    },
    fabricatorBuilderWebpackConfigCreator()
];
