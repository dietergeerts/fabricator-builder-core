const expect = require('chai').expect;
const forEach = require('lodash/fp/forEach');
const getRepoHosting = require('./assembler').getRepoHosting;

describe(getRepoHosting.name, () => {

    const expected = {
        bitbucket: [
            {homepage: 'https://bitbucket.org:dieterdworks/vw-dlibrary#reamde'},
        ],
        github: [
            {homepage: 'https://github.com/dietergeerts/fabricator-builder-core#reamde'},
        ],
        code: [
            {homepage: 'https://stash.somewhere.be:2457/pro/project-toolkit#reamde'},
            {},
        ],
    };

    it('should get the correct repo hosting name', () => {
        forEach.convert({cap: false})((value, key) => {
            forEach(project => {
                expect(getRepoHosting(project)).to.be.equal(key,
                    `${project.homepage} should return ${key} as repo hosting`);
            })(value);
        })(expected);
    });
});
