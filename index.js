const path = require('path');
const assign = require('lodash/assign');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const defaultJsDomView = require('jsdom').jsdom().defaultView;
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
const Rx = require('rxjs/Rx');

module.exports = function fabricatorBuilderWebpackConfigCreator(options) {

    options = assign({
        projectPath: path.resolve(__dirname),
        outputPath: path.resolve(__dirname, './dist'),
        outputPublicPath: '',
        materialsDir: './test/fixtures/materials',
        faviconsWebpackPlugin: null,
        webpackAssetsManifest: null,
        getIndex: () => '<h1>INDEX FROM LOCALS</h1>'
    }, options);

    const faviconsManifestRx = new Rx.ReplaySubject(1);
    options.faviconsWebpackPlugin
        ? options.faviconsWebpackPlugin.on('done', (manifest) => faviconsManifestRx.next(manifest))
        : faviconsManifestRx.next(null);

    const assetsManifestRx = new Rx.ReplaySubject(1);
    options.webpackAssetsManifest
        ? options.webpackAssetsManifest.on('done', (manifest) => assetsManifestRx.next(manifest))
        : assetsManifestRx.next(null);

    return {
        target: 'node',
        context: path.resolve(__dirname, './src'),
        entry: {
            'fabricator-builder': './fabricator-builder.js',
            'fabricator': './fabricator.js'
        },
        output: {
            filename: '[name].[hash].js',
            path: options.outputPath,
            publicPath: options.outputPublicPath,
            libraryTarget: 'umd'
            // TODO: Check issues for multi-config dev-server support with multiple public paths:
            // Until this is fixed, dev server will not work, as the first public path is taken!
            // https://github.com/webpack/webpack-dev-server/issues/641
            // https://github.com/webpack/webpack-dev-middleware/pull/187
        },
        resolve: {alias: {project: options.projectPath}},
        module: {
            rules: [
                {test: /\.hbs$/, loader: 'handlebars-loader'},
                {test: /\.scss$/, use: ExtractTextPlugin.extract({use: ['css-loader', 'sass-loader']})}
            ]
        },
        plugins: [
            new ExtractTextPlugin('[name].[hash].css'),
            new webpack.DefinePlugin({
                __MATERIALS_PATH__: JSON.stringify(path.resolve(options.projectPath, options.materialsDir))
            }),
            new StaticSiteGeneratorPlugin({
                entry: 'fabricator-builder',
                crawl: true, paths: [''],
                globals: defaultJsDomView,
                locals: {
                    faviconsManifestRx: faviconsManifestRx,
                    assetsManifestRx: assetsManifestRx,
                    getIndex: options.getIndex
                }
            })
        ]
    };
};
