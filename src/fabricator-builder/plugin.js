// TODO: Extract plugin once core is done, so core can still be used with other systems.
const Rx = require('rxjs');
const render = require('./assembler').render;
const addAsset = require('./webpack-utils').addAsset;
const getBaseDir = require('./webpack-utils').getBaseDir;

function FabricatorBuilderPlugin() {

}

FabricatorBuilderPlugin.prototype.apply = (compiler) => {

    const baseDir = getBaseDir(compiler.options.output);
    const templates = [
        {name: 'dashboard'},
        {name: 'profile'},
    ];
    const materials = [
        {
            name: 'atoms',
            items: [
                {name: 'colors'},
                {name: 'button'},
                {name: 'input'},
            ],
        },
        {
            name: 'molecules',
            items: [
                {name: 'heading'},
            ],
        },
    ];
    const paths = [
        '',
        'materials/atoms/colors',
        'materials/atoms/button',
        'materials/atoms/input',
        'materials/molecules/heading',
        'templates/dashboard',
        'templates/profile',
    ];

    var favicon;

    compiler.plugin('compilation', (compilation) => {
        compilation.plugin('favicons-webpack-plugin-after-make', (data, callback) => {

            favicon = data.html;
            callback();
        });
    });

    compiler.plugin('emit', (compilation, callback) => {

        Rx.Observable
            .from(paths)
            .flatMap(path => render({path, favicon, materials, templates})
                .map(addAsset.bind(null, compilation, `${baseDir}${path}/index.html`)))
            .subscribe(console.log, console.log, callback);
    });
};

module.exports = FabricatorBuilderPlugin;
