const expect = require('chai').expect;
const pageType = require('./page-type');

describe('pageType', () => {

    const pageTypes = [
        'INDEX',
        'MATERIALS',
        'MATERIAL',
        'TEMPLATES',
        'TEMPLATE',
    ];

    it('should have the defined values', () => {
        pageTypes.forEach(value => {
            expect(pageType).to.haveOwnProperty(value, value, `The pageType enum should have value ${value}`);
        });
    });

    it('should not have other values', () => {
        expect(Object.keys(pageType).length)
            .to.be.equal(5, 'The pageType enum should have only the ${} defined values');
    });
});
