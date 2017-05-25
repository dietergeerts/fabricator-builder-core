const assign = require('lodash/assign');

module.exports = function fabricatorBuilderRendererCreator(options) {

    options = assign({}, options);

    return function render(locals) {
        return '<h1>TOOLKIT PAGE</h1>'
    };
};