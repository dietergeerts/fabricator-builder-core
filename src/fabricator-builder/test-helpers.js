// TODO: Extract this to a separate project, so it can be used by many!
const expect = require('chai').expect;
const size = require('lodash/fp/size');
const forEach = require('lodash/fp/forEach');

module.exports.describeEnumObject = (enumType, actual, expected) => {

    describe(enumType, () => {

        it('should have the expected defined keys with their values', () => {
            forEach.convert({cap: false})((value, key) => {
                expect(actual).to.haveOwnProperty(key, value,
                    `The ${enumType} enum should have a key ${key} with the value ${value}`);
            })(expected);
        });

        it('should not have any other keys defined', () => {
            expect(size(actual)).to.be.equal(size(expected),
                `The ${enumType} enum should have only the expected keys defined`);
        });
    });
};
