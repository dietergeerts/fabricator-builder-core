const expect = require('chai').expect;
const extractBaseUrl = require('./extract-base-url');

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
