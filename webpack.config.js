const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.preview\.html$/,
                use: [
                    {loader: 'file-loader'},
                    {loader: 'extract-loader'},
                    {loader: 'html-loader'},
                ],
            },
            {
                test: /\.story\.html$/,
                use: [
                    {loader: 'file-loader'},
                    {loader: 'extract-loader'},
                    {
                        loader: 'html-loader',
                        options: {
                            attrs: [
                                'iframe:src',
                            ],
                        },
                    },
                ],
            },
        ],
    },
    plugins: [new HtmlWebpackPlugin()],
};
