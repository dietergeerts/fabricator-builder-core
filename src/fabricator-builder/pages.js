const get = require('lodash/fp/get');
const size = require('lodash/fp/size');
const flow = require('lodash/fp/flow');
const join = require('lodash/fp/join');
const last = require('lodash/fp/last');
const head = require('lodash/fp/head');
const slice = require('lodash/fp/slice');
const split = require('lodash/fp/split');
const getOr = require('lodash/fp/getOr');
const repeat = require('lodash/fp/repeat');
const replace = require('lodash/fp/replace');
const compact = require('lodash/fp/compact');
require('./handlebars-node-loader');
const indexView = require('./views/index.hbs');
const templateView = require('./views/template.hbs');
const materialView = require('./views/material.hbs');
const templateLayout = require('./layouts/template.hbs');
const materialLayout = require('./layouts/material.hbs');
const fabricatorLayout = require('./layouts/fabricator.hbs');

const PAGE_TYPE = {
    INDEX: 'INDEX',
    MATERIAL: 'MATERIAL',
    TEMPLATE: 'TEMPLATE',
};

const LAYOUT = {
    FABRICATOR: fabricatorLayout,
    MATERIAL: materialLayout,
    TEMPLATE: templateLayout,
};

const VIEW = {
    INDEX: indexView,
    MATERIAL: materialView,
    TEMPLATE: templateView,
};

function getPageTypeForPath(path) {

    const base = flow(
        split('/'), // Split out the folders, so we can check based on that
        compact,    // Remove the empty pieces, because how split works...
        head        // Take the base path, as that defines our page type
    )(path);

    return getOr(PAGE_TYPE.INDEX, base)({
        materials: PAGE_TYPE.MATERIAL,
        templates: PAGE_TYPE.TEMPLATE,
    });
}

function getLayoutForPageType(pageType) {

    return pageType === PAGE_TYPE.TEMPLATE ? LAYOUT.TEMPLATE : LAYOUT.FABRICATOR;
}

function getViewForPageType(pageType) {

    return get(pageType)({
        [PAGE_TYPE.INDEX]: VIEW.INDEX,
        [PAGE_TYPE.MATERIAL]: VIEW.MATERIAL,
        [PAGE_TYPE.TEMPLATE]: VIEW.TEMPLATE,
    });
}

function extractBaseUrl(path) {

    return `./${flow(                         // Start in own folder, relative
        replace(/[^/]+?.html$/g, ''),         // We're only interested in the folder structure, not files within
        split('/'),                           // Split out the folders, so we can check it's length
        compact,                              // Remove the empty pieces, because how split works...
        size,                                 // Get the actual folder count, for moving that count up
        repeat.convert({rearg: false})('../') // Combine to relative path
    )(path)}`;
}

function getPageHeader(path) {

    return flow(
        split('/'), // Split out the folders, so we can check based on that
        compact,    // Remove the empty pieces, because how split works...
        last        // Get the last item, which represents the page
    )(path);
}

function getPageBreadcrumb(path) {

    return flow(
        split('/'),   // Split out the folders, so we can check based on that
        compact,      // Remove the empty pieces, because how split works...
        slice(1, -1), // Get all but the last item, which represents the breadcrumb
        join('/')     // Combine to path again
    )(path);
}

module.exports = {
    PAGE_TYPE,
    LAYOUT,
    VIEW,
    getPageTypeForPath,
    getLayoutForPageType,
    getViewForPageType,
    extractBaseUrl,
    getPageHeader,
    getPageBreadcrumb,
};
