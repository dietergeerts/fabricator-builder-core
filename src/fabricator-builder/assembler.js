const Rx = require('rxjs');
const path = require('path');
const findKey = require('lodash/fp/findKey');
const getPageBreadcrumb = require('./pages').getPageBreadcrumb;
const getPageHeader = require('./pages').getPageHeader;
const extractBaseUrl = require('./pages').extractBaseUrl;
const getParentPackage = Rx.Observable.bindNodeCallback(require('parent-package'), (a, b) => b);
const getPageTypeForPath = require('./pages').getPageTypeForPath;
const getLayoutForPageType = require('./pages').getLayoutForPageType;
const getViewForPageType = require('./pages').getViewForPageType;

/**
 * Render one page of the toolkit.
 * @param {{path: string, favicon: string, materials: {}, templates: Array.<string>}} locals - Data used for rendering the page
 * @returns {Rx.Observable.<string>} Observable with the page content
 */
function render(locals) {

    const pageType = getPageTypeForPath(locals.path);
    const layout = getLayoutForPageType(pageType);
    const view = getViewForPageType(pageType);

    return getPackage()
        .map(project => layout({
            PACKAGE: project,
            FAVICON: locals.favicon,
            REPO_HOSTING: getRepoHosting(project),
            BASE_URL: extractBaseUrl(locals.path),
            HEADER: getPageHeader(locals.path) || project.name,
            SUB_HEADER: getPageBreadcrumb(locals.path) || `v${project.version}`,
            MATERIALS: locals.materials,
            TEMPLATES: locals.templates,
            THEME: {
                COLOR: 'black',
                INVERTED: true,
            },
            VIEW: view({}),
        }));
}

/**
 * Returns the package of the executing npm package.
 * @returns {Rx.Observable.<{}>} Observable with the package
 */
function getPackage() {

    return getParentPackage(path.resolve(__dirname, '../../'))
        .map(require)
        .catch(() => Rx.Observable
            .of(require('../../package.json')));
}

/**
 * Returns the repo hosting service used for the project.
 * @param {{[homepage]: string}} project - The project package.json file content
 * @returns {string} The hosting service or 'code' if not possible to detect
 */
function getRepoHosting(project) {

    return findKey(value => value.test(project.homepage))({
        bitbucket: /bitbucket.org/g,
        github: /github.com/g,
    }) || 'code';
}

module.exports = {
    render,
    getPackage,
    getRepoHosting,
};
