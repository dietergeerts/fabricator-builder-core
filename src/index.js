// import buttonStory from './button.story.html';
// import button2Story from './button-2.story.html';

const rootRequire = require.context('.', true, /\.story\.html$/);

const requiredSrc = rootRequire.keys();
const required = rootRequire.keys().map(rootRequire);

console.log(rootRequire.keys());
console.log(required);

// import buttonPreview from './button.preview.html';
//
// import buttonVariantPreview from './button-variants.preview.html';

// buttonPreview = import(
//     /* webpackChunkName: "button.preview" */
//     './button.preview.html'
//     ).then(module => createIFrame(module.default));
//
// buttonVariantPreview = import(
//     /* webpackChunkName: "button-variants.preview" */
//     './button-variants.preview.html'
//     ).then(module => createIFrame(module.default));

const title = 'Our entry module';
console.log(title);

// createIFrame(buttonPreview);
// createIFrame(buttonVariantPreview);
// createIFrame(buttonStory);
// createIFrame(button2Story);

// required.forEach(createIFrame);

requiredSrc.forEach(createNav);

const iframe = createIFrame();

function createNav(file) {
    var buttonnode= document.createElement('input');
    buttonnode.setAttribute('type','button');
    buttonnode.setAttribute('name',file);
    buttonnode.setAttribute('value',file);


    buttonnode.onclick = function () {
        iframe.src = required[requiredSrc.indexOf(file)];
    };

    document.body.appendChild(buttonnode);
    const br = document.createElement('br');
    document.body.appendChild(br);
}

function createIFrame(src) {
    var iframe = document.createElement('iframe');
    // var html = '<body>Foo</body>';
    // iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html);
    // iframe.src = src;
    iframe.width = '100%';
    iframe.height = '600px';
    document.body.appendChild(iframe);
    console.log('iframe.contentWindow =', iframe.contentWindow);
    return iframe;
}
