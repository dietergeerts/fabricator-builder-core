const expect = require('chai').expect;
const forEach = require('lodash/fp/forEach');
const describeEnumObject = require('./test-helpers').describeEnumObject;
const PAGE_TYPE = require('./pages').PAGE_TYPE;
const LAYOUT = require('./pages').LAYOUT;
const VIEW = require('./pages').VIEW;
const getPageTypeForPath = require('./pages').getPageTypeForPath;
const getLayoutForPageType = require('./pages').getLayoutForPageType;
const getViewForPageType = require('./pages').getViewForPageType;
const extractBaseUrl = require('./pages').extractBaseUrl;
const fabricatorLayout = require('./layouts/fabricator.hbs');
const materialLayout = require('./layouts/material.hbs');
const templateLayout = require('./layouts/template.hbs');
const materialView = require('./views/material.hbs');
const templateView = require('./views/template.hbs');
const indexView = require('./views/index.hbs');

describeEnumObject('PAGE_TYPE', PAGE_TYPE, {
    'INDEX': 'INDEX',
    'MATERIAL': 'MATERIAL',
    'TEMPLATE': 'TEMPLATE',
});

describeEnumObject('LAYOUT', LAYOUT, {
    FABRICATOR: fabricatorLayout,
    MATERIAL: materialLayout,
    TEMPLATE: templateLayout,
});

describeEnumObject('VIEW', VIEW, {
    INDEX: indexView,
    MATERIAL: materialView,
    TEMPLATE: templateView,
});

describe(getPageTypeForPath.name, () => {

    const paths = {
        '': PAGE_TYPE.INDEX,
        'materials/material': PAGE_TYPE.MATERIAL,
        'materials/group/material': PAGE_TYPE.MATERIAL,
        'templates/template': PAGE_TYPE.TEMPLATE,
        'templates/group/template': PAGE_TYPE.TEMPLATE,
        '/': PAGE_TYPE.INDEX,
        '/materials/material': PAGE_TYPE.MATERIAL,
        '/materials/group/material': PAGE_TYPE.MATERIAL,
        '/templates/template': PAGE_TYPE.TEMPLATE,
        '/templates/group/template': PAGE_TYPE.TEMPLATE,
    };

    it('should correctly give us the PAGE_TYPE for the path', () => {
        forEach.convert({cap: false})((value, key) => {
            expect(getPageTypeForPath(key)).to.equal(value,
                `'${key}' should give us PAGE_TYPE '${value}'`);
        })(paths);
    });
});

describe(getLayoutForPageType.name, () => {

    const pageTypeLayouts = {
        [PAGE_TYPE.INDEX]: LAYOUT.FABRICATOR,
        [PAGE_TYPE.MATERIAL]: LAYOUT.FABRICATOR,
        [PAGE_TYPE.TEMPLATE]: LAYOUT.TEMPLATE,
    };

    it('should correctly give us the LAYOUT for the PAGE_TYPE', () => {
        forEach.convert({cap: false})((value, key) => {
            expect(getLayoutForPageType(key)).to.equal(value,
                `PAGE_TYPE '${key}' should give us LAYOUT '${value}'`);
        })(pageTypeLayouts);
    });
});

describe(getViewForPageType.name, () => {

    const pageTypeViews = {
        [PAGE_TYPE.INDEX]: VIEW.INDEX,
        [PAGE_TYPE.MATERIAL]: VIEW.MATERIAL,
        [PAGE_TYPE.TEMPLATE]: VIEW.TEMPLATE,
    };

    it('should correctly give us the VIEW for the PAGE_TYPE', () => {
        forEach.convert({cap: false})((value, key) => {
            expect(getViewForPageType(key)).to.equal(value,
                `PAGE_TYPE '${key}' should give us VIEW '${value}'`);
        })(pageTypeViews);
    });
});

describe(extractBaseUrl.name, () => {

    const paths = {
        '': './',
        'materials': './../',
        'materials/': './../',
        'index.html': './',
        'materials/index.html': './../',
        '/': './',
        '/materials': './../',
        '/materials/': './../',
        '/index.html': './',
        '/materials/index.html': './../',
    };

    it('should return a relative url prefix', () => {
        expect(Object.keys(paths).map(extractBaseUrl)).to.all.match(/^.\//);
    });

    it('should correctly go up the levels that the path is deep', () => {
        Object.keys(paths).forEach(key => {
            expect(extractBaseUrl(key)).to.equal(paths[key], `'${key}' should extract to '${paths[key]}'`);
        });
    });
});
