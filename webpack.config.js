const Path = require('path');
// const Webpack = require('webpack')
module.exports = {
    mode: "development",
    entry: './src/index.js',
    devServer: {
        proxy: { 
            '/mdata': 'http://localhost:3000'
        },
    },
    output: {
        path: Path.resolve(__dirname, 'build'),
        filename: "bundle.js",
        publicPath: "/build/"
    },
    module: {
        rules: [
            { test: /\.(js|jsx)/,use: [{loader: 'babel-loader'}] },
            { test: /\.(css|scss)$/,use:['style-loader','css-loader','sass-loader']}
        ]
    },
    plugins: [
    ],
};