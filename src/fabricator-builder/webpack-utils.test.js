const expect = require('chai').expect;
const size = require('lodash/fp/size');
const forEach = require('lodash/fp/forEach');
const addAsset = require('./webpack-utils').addAsset;
const getBaseDir = require('./webpack-utils').getBaseDir;

describe(getBaseDir.name, () => {

    const expected = {
        '': '',
        'assets': '../',
        'assets/': '../',
        'sub/assets': '../../',
        '/': '',
        '/assets': '../',
        '/assets/': '../',
        '/sub/assets': '../../',
    };

    it('should return the correct relative path', () => {
        forEach.convert({cap: false})((value, key) => {
            expect(getBaseDir({publicPath: key})).to.equal(value,
                `${key} should give us relative path ${value}`);
        })(expected);
    });
});

describe(addAsset.name, () => {

    it('should successfully add the given asset', () => {
        const compilation = {assets: {}};
        const filename = '../index.html';
        const content = 'The file lines';
        addAsset(compilation, filename, content);
        expect(compilation.assets).to.haveOwnProperty(filename);
        expect(compilation.assets[filename]).to.haveOwnProperty('source');
        expect(compilation.assets[filename]).to.haveOwnProperty('size');
        expect(compilation.assets[filename].source()).to.be.equal(content);
        expect(compilation.assets[filename].size()).to.be.equal(size(content));
    });
});
