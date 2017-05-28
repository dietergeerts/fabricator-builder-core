const assign = require('lodash/assign');
const Rx = require('rxjs/Rx');
const path = require('path');
const fs = require('fs');

const MATERIALS = mapDirs(__MATERIALS_PATH__, group => getDirs(path.join(__MATERIALS_PATH__, group)));

module.exports = function render(locals) {

    const BASE_URL = `${'../'.repeat(locals.path.split('/').length - 1)}`;

    return locals.faviconsManifestRx.first()
        .combineLatest(
            locals.assetsManifestRx.first(),
            (faviconsManifest, assetsManifest) => {

            const FAVICON_HTML = faviconsManifest && faviconsManifest.html.join('\n') || '';

            return require('./layouts/default.hbs')({
                BASE_URL: BASE_URL,
                FAVICON_HTML: FAVICON_HTML.replace(/href="/g, `href="${BASE_URL}`),
                FABRICATOR_STYLES: locals.assets.fabricator.slice(0, -2) + 'css',
                FABRICATOR_SCRIPT: locals.assets.fabricator,
                STYLES_ASSETS: getAssetsFromWithType(assetsManifest.assets, '.css'),
                SCRIPT_ASSETS: getAssetsFromWithType(assetsManifest.assets, '.js'),
                MATERIALS: MATERIALS,
                VIEW: '<h1>TOOLKIT PAGE</h1>'
            });
        })
        .toPromise();
};

function getAssetsFromWithType(assets, type) {
    return Object.keys(assets).filter((key) => key.endsWith(type)).map((key) => assets[key]);
}

function mapDirs(path, map) {
    return getDirs(path).reduce((result, dir) => { result[dir] = map(dir); return result; }, {});
}

function getDirs(dir) {
    return fs.readdirSync(dir).filter(file => fs.statSync(path.join(dir, file)).isDirectory());
}
