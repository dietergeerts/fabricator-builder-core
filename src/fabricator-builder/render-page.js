const extractBaseUrl = require('./extract-base-url');

const assign = require('lodash/assign');
const get = require('lodash/get');
const Rx = require('rxjs/Rx');
const path = require('path');
const fs = require('fs');

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

module.exports = function renderPage(locals) {
    return '<h1>LOL</h1>';
};

// module.exports = function renderPage(locals) {
//     return locals.faviconsManifestRx.first()
//         .combineLatest(locals.assetsManifestRx.first())
//         .map(([faviconsManifest, assetsManifest]) =>
//             renderLayout(collectData(locals, faviconsManifest, assetsManifest), locals))
//         .toPromise();
// };

function collectData(locals, faviconsManifest, assetsManifest) {
    const BASE_URL = extractBaseUrl(locals.path);
    const FAVICONS = faviconsManifest && faviconsManifest.html.join('\n') || '';

    return {
        PACKAGE: require('project/package.json'),
        BASE_URL: BASE_URL,
        FAVICON_HTML: FAVICONS.replace(/href="/g, `href="${BASE_URL}`),
        FABRICATOR_STYLES: locals.assets.fabricator.slice(0, -2) + 'css',
        FABRICATOR_SCRIPT: locals.assets.fabricator,
        STYLES_ASSETS: getAssetsFromWithType(get(assetsManifest, 'assets', {}), '.css'),
        SCRIPT_ASSETS: getAssetsFromWithType(get(assetsManifest, 'assets', {}), '.js'),
        MATERIALS: MATERIALS,
    };
}

function renderLayout(DATA, locals) {
    return require('./layouts/fabricator.hbs')(Object.assign({}, DATA, {VIEW: renderView(DATA, locals)}));
}

function renderView(DATA, locals) {
    return {
        [PAGE_TYPE.INDEX]: renderIndexView,
        [PAGE_TYPE.MATERIALS]: renderMaterialsView,
        [PAGE_TYPE.TEMPLATE]: renderTemplateView,
    }[PAGE_TYPE.for(locals.path)](DATA, locals)
}

function renderIndexView(DATA, locals) {
    return require('../views/index.hbs')(Object.assign({}, DATA, {VIEW: locals.getIndex()}));
}

function renderMaterialsView(DATA, locals) {
    const MATERIAL_GROUP = locals.path.split('/')[1];

    return require('../views/materials.hbs')(Object.assign({}, DATA, {
        MATERIAL_GROUP: MATERIAL_GROUP,
        MATERIALS: MATERIALS[MATERIAL_GROUP].map(locals.getMaterial.bind(null, MATERIAL_GROUP)),
    }));
}

function renderTemplateView(DATA, locals) {
    return '<h1>TEMPLATE PAGE</h1>';
}

function getAssetsFromWithType(assets, type) {
    return Object.keys(assets).filter((key) => key.endsWith(type)).map((key) => assets[key]);
}

function getDirs(dir) {
    return fs.readdirSync(dir).filter(file => fs.statSync(path.join(dir, file)).isDirectory());
}

function mapDirs(path, map) {
    return getDirs(path).reduce((result, dir) => {
        result[dir] = map(dir);
        return result;
    }, {});
}
