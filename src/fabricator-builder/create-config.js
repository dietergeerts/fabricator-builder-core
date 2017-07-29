const createOptions = require('./create-options');

const path = require('path');
const assign = require('lodash/assign');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const defaultJsDomView = require('jsdom').jsdom().defaultView;
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
const Rx = require('rxjs/Rx');

module.exports = function createConfig(options) {

    const settings = createOptions({
        outputDir: 'dist',

        outputPublicPath: '',
        materialsDir: './test/fixtures/materials',
        faviconsWebpackPlugin: null,
        webpackAssetsManifest: null,
        getIndex: () => '<div>INDEX FROM LOCALS</div>',
        getMaterial: (materialGroup, materialName) => ({
            NAME: materialName,
            header: materialName,
            notes: '<p>Material notes</p>',
            preview: '<div>Material preview</div>',
            sources: [
                {filename: 'html', contents: '<div><span><a>material template</a></span></div>'},
                {filename: 'js', contents: 'export const materialComponent = {templateUrl: \'./.html\'};'},
            ],
        }),
    }, options);

    const projectPath = process.cwd();
    const outputPath = path.resolve(projectPath, settings.outputDir);

    const faviconsManifestRx = new Rx.ReplaySubject(1);
    settings.faviconsWebpackPlugin
        ? settings.faviconsWebpackPlugin.on('done', (manifest) => faviconsManifestRx.next(manifest))
        : faviconsManifestRx.next(null);

    const assetsManifestRx = new Rx.ReplaySubject(1);
    settings.webpackAssetsManifest
        ? settings.webpackAssetsManifest.on('done', (manifest) => assetsManifestRx.next(manifest))
        : assetsManifestRx.next(null);

    return {
        target: 'node',
        context: path.resolve(__dirname, './../'),
        entry: {
            'fabricator-builder': './fabricator-builder/render-page.js',
            'fabricator': './fabricator.js'
        },
        output: {
            filename: '[name].[hash].js',
            path: outputPath,
            publicPath: settings.outputPublicPath,
            libraryTarget: 'umd'
            // TODO: Check issues for multi-config dev-server support with multiple public paths:
            // Until this is fixed, dev server will not work, as the first public path is taken!
            // https://github.com/webpack/webpack-dev-server/issues/641
            // https://github.com/webpack/webpack-dev-middleware/pull/187
        },
        resolve: {alias: {project: projectPath}},
        module: {
            rules: [
                {test: /\.js$/, loader: 'babel-loader'},
                {test: /\.hbs$/, loader: 'handlebars-loader'},
                {test: /\.scss$/, use: ExtractTextPlugin.extract({use: ['css-loader', 'sass-loader']})}
            ]
        },
        plugins: [
            new ExtractTextPlugin('[name].[hash].css'),
            new webpack.DefinePlugin({
                __MATERIALS_PATH__: JSON.stringify(path.resolve(projectPath, settings.materialsDir))
            }),
            new StaticSiteGeneratorPlugin({
                entry: 'fabricator-builder',
                crawl: true, paths: [''],
                globals: defaultJsDomView,
                locals: {
                    faviconsManifestRx: faviconsManifestRx,
                    assetsManifestRx: assetsManifestRx,
                    getIndex: settings.getIndex,
                    getMaterial: settings.getMaterial,
                }
            })
        ]
    };
};
