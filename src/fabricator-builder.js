const assign = require('lodash/assign');
const Rx = require('rxjs/Rx');
const path = require('path');
const fs = require('fs');

const PACKAGE = require('project/package.json');
const MATERIALS = mapDirs(__MATERIALS_PATH__, group => getDirs(path.join(__MATERIALS_PATH__, group)));
const PAGE_TYPE = {
    INDEX: 'INDEX',
    MATERIALS: 'MATERIALS',
    TEMPLATE: 'TEMPLATE',
    for: path => ({
        materials: PAGE_TYPE.MATERIALS,
        templates: PAGE_TYPE.TEMPLATE
    }[path.split('/')[0]] || PAGE_TYPE.INDEX)
};

module.exports = function render(locals) {

    const BASE_URL = `${'../'.repeat(locals.path.split('/').length - 1)}`;

    return locals.faviconsManifestRx.first()
        .combineLatest(
            locals.assetsManifestRx.first(),
            (faviconsManifest, assetsManifest) => {

            const FAVICON_HTML = faviconsManifest && faviconsManifest.html.join('\n') || '';

            return require('./layouts/default.hbs')({
                PACKAGE: PACKAGE,
                BASE_URL: BASE_URL,
                FAVICON_HTML: FAVICON_HTML.replace(/href="/g, `href="${BASE_URL}`),
                FABRICATOR_STYLES: locals.assets.fabricator.slice(0, -2) + 'css',
                FABRICATOR_SCRIPT: locals.assets.fabricator,
                STYLES_ASSETS: getAssetsFromWithType(assetsManifest.assets, '.css'),
                SCRIPT_ASSETS: getAssetsFromWithType(assetsManifest.assets, '.js'),
                MATERIALS: MATERIALS,
                VIEW: {
                    [PAGE_TYPE.INDEX]: locals.getIndex(),
                    [PAGE_TYPE.MATERIALS]: '<h1>MATERIALS PAGE</h1>',
                    [PAGE_TYPE.TEMPLATE]: '<h1>TEMPLATE PAGE</h1>'
                }[PAGE_TYPE.for(locals.path)]
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
