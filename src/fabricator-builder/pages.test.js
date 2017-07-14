import {expect} from 'chai';
import {PAGE_TYPE, LAYOUT, getPageTypeForPath, getLayoutForPageType} from './pages';
import fabricatorLayout from './layouts/fabricator.hbs';
import templateLayout from './layouts/template.hbs';

describe('PAGE_TYPE', () => {

    const pageTypes = [
        'INDEX',
        'MATERIALS',
        'MATERIAL',
        'TEMPLATES',
        'TEMPLATE',
    ];

    it('should have the defined values', () => {
        pageTypes.forEach(value => {
            expect(PAGE_TYPE).to.haveOwnProperty(value, value,
                `The PAGE_TYPE enum should have value ${value}`);
        });
    });

    it('should not have other values', () => {
        expect(Object.keys(PAGE_TYPE).length).to.be.equal(5,
            'The PAGE_TYPE enum should have only the defined values');
    });
});

describe('LAYOUT', () => {

    const layouts = {
        FABRICATOR: fabricatorLayout,
        TEMPLATE: templateLayout,
    };

    it('should have the defined values', () => {
        Object.keys(layouts).forEach(key => {
            expect(LAYOUT).to.haveOwnProperty(key, layouts[key],
                `The LAYOUT enum should have value ${key}`);
        });
    });

    it('should not have other values', () => {
        expect(Object.keys(LAYOUT).length).to.be.equal(2,
            'The LAYOUT enum should have only the defined values');
    });
});

describe(getPageTypeForPath.name, () => {

    const paths = {
        '': PAGE_TYPE.INDEX,
        'index.html': PAGE_TYPE.INDEX,
        'materials': PAGE_TYPE.MATERIALS,
        'materials/': PAGE_TYPE.MATERIALS,
        'materials/group': PAGE_TYPE.MATERIALS,
        'materials/material-B.html': PAGE_TYPE.MATERIAL,
        'materials/group/material-B.html': PAGE_TYPE.MATERIAL,
        'templates': PAGE_TYPE.TEMPLATES,
        'templates/': PAGE_TYPE.TEMPLATES,
        'templates/group': PAGE_TYPE.TEMPLATES,
        'templates/template-A.html': PAGE_TYPE.TEMPLATE,
        'templates/group/template-A.html': PAGE_TYPE.TEMPLATE,
        '/': PAGE_TYPE.INDEX,
        '/index.html': PAGE_TYPE.INDEX,
        '/materials': PAGE_TYPE.MATERIALS,
        '/materials/': PAGE_TYPE.MATERIALS,
        '/materials/group': PAGE_TYPE.MATERIALS,
        '/materials/material-B.html': PAGE_TYPE.MATERIAL,
        '/materials/group/material-B.html': PAGE_TYPE.MATERIAL,
        '/templates': PAGE_TYPE.TEMPLATES,
        '/templates/': PAGE_TYPE.TEMPLATES,
        '/templates/group': PAGE_TYPE.TEMPLATES,
        '/templates/template-A.html': PAGE_TYPE.TEMPLATE,
        '/templates/group/template-A.html': PAGE_TYPE.TEMPLATE,
    };

    it('should correctly give us the PAGE_TYPE for the path', () => {
        Object.keys(paths).forEach(key => {
            expect(getPageTypeForPath(key)).to.equal(paths[key],
                `'${key}' should give us PAGE_TYPE '${paths[key]}'`);
        });
    });
});

describe(getLayoutForPageType.name, () => {

    const pageTypeLayouts = {
        [PAGE_TYPE.INDEX]: LAYOUT.FABRICATOR,
        [PAGE_TYPE.MATERIALS]: LAYOUT.FABRICATOR,
        [PAGE_TYPE.MATERIAL]: LAYOUT.FABRICATOR,
        [PAGE_TYPE.TEMPLATES]: LAYOUT.FABRICATOR,
        [PAGE_TYPE.TEMPLATE]: LAYOUT.TEMPLATE,
    };

    it('should correctly give us the layout for the PAGE_TYPE', () => {
        Object.keys(pageTypeLayouts).forEach(key => {
            expect(getLayoutForPageType(key)).to.equal(pageTypeLayouts[key],
                `PAGE_TYPE '${key}' should give us layout '${pageTypeLayouts[key]}'`);
        });
    });
});
