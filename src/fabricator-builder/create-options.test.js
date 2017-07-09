const expect = require('chai').expect;
const createOptions = require('./create-options');

describe(createOptions.name, () => {

    const defaults = {option: 0};
    const options = {setting: 3, option: 1};

    it('should work without required options', () => {
        expect(() => createOptions(defaults, options)).to.not.throw();
    });

    it('should throw an error on missing required options', () => {
        expect(() => createOptions(defaults, options, ['projectPath']))
            .to.throw(Error, new RegExp('projectPath', 'g'),
            'Missing required option \'projectPath\' should throw an error');
    });

    it('should not mutate the given defaults and options', () => {
        expect(createOptions(defaults, options)).to.not.equal(options).and.not.equal(defaults);
    });

    it('should merge the given defaults and options into the result, with options overriding defaults', () => {
        expect(createOptions(defaults, options)).to.be.eql({setting: 3, option: 1});
    })
});
