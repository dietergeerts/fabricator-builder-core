const path = require('path');
const assign = require('lodash/assign');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const defaultJsDomView = require('jsdom').jsdom().defaultView;
const Rx = require('rxjs/Rx');

module.exports = function fabricatorBuilderWebpackConfigCreator(options) {

    options = assign({
        projectPath: __dirname,
        faviconsWebpackPlugin: null
    }, options);

    const faviconsManifestRx = new Rx.ReplaySubject(1);
    options.faviconsWebpackPlugin
        ? options.faviconsWebpackPlugin.on('done', (manifest) => faviconsManifestRx.next(manifest))
        : faviconsManifestRx.next(null);

    return {
        target: 'node',
        context: path.resolve(__dirname, './src'),
        entry: {'fabricator-builder': './fabricator-builder.js'},
        output: {
            filename: '[name].[hash].js',
            path: path.resolve(options.projectPath, './dist'),
            publicPath: '', libraryTarget: 'umd'
            // TODO: Check issues for multi-config dev-server support with multiple public paths:
            // Until this is fixed, dev server will not work, as the first public path is taken!
            // https://github.com/webpack/webpack-dev-server/issues/641
            // https://github.com/webpack/webpack-dev-middleware/pull/187
        },
        module: {
            rules: [{test: /\.hbs$/, loader: 'handlebars-loader'}]
        },
        plugins: [
            new StaticSiteGeneratorPlugin({
                crawl: true, paths: [''], 
                globals: defaultJsDomView, 
                locals: {
                    faviconsManifestRx: faviconsManifestRx
                }
            })
        ]
    };
};
