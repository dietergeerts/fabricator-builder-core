import head from 'lodash/fp/head';
import tail from 'lodash/fp/tail';
import './handlebars-node-loader';
import fabricatorLayout from './layouts/fabricator.hbs';
import templateLayout from './layouts/template.hbs';

export const PAGE_TYPE = {
    INDEX: 'INDEX',
    MATERIALS: 'MATERIALS',
    MATERIAL: 'MATERIAL',
    TEMPLATES: 'TEMPLATES',
    TEMPLATE: 'TEMPLATE',
};

export const LAYOUT = {
    FABRICATOR: fabricatorLayout,
    TEMPLATE: templateLayout,
};

export function getPageTypeForPath(path) {

    const dirStructure = path
        .split('/')       // Split out the folders, so we can check based on that
        .filter(Boolean); // Remove the empty pieces, because how split works...

    if (head(dirStructure) === 'templates') {
        return /.html$/g.test(tail(dirStructure)) ? PAGE_TYPE.TEMPLATE : PAGE_TYPE.TEMPLATES;
    }

    if (head(dirStructure) === 'materials') {
        return /.html$/g.test(tail(dirStructure)) ? PAGE_TYPE.MATERIAL : PAGE_TYPE.MATERIALS;
    }

    return PAGE_TYPE.INDEX;
}

export function getLayoutForPageType(pageType) {

    return pageType === PAGE_TYPE.TEMPLATE ? LAYOUT.TEMPLATE : LAYOUT.FABRICATOR;
}
