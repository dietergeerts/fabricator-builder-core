const path = require('path');
const assign = require('lodash/assign');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const defaultJsDomView = require('jsdom').jsdom().defaultView;

module.exports = function fabricatorBuilderWebpackConfigCreator(options) {

    options = assign({projectPath: __dirname}, options);

    return {
        target: 'node',
        context: path.resolve(__dirname, './src'),
        entry: {'fabricator-builder': './fabricator-builder.default.js'},
        output: {
            filename: '[name].[hash].js',
            path: path.resolve(options.projectPath, './dist'),
            libraryTarget: 'umd'
        },
        devServer: {port: 3000},
        plugins: [
            new StaticSiteGeneratorPlugin({crawl: true, paths: [''], globals: defaultJsDomView})
        ]
    };
};
