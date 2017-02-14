var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
    entry: {
        main: APP_DIR + '/index.jsx'
    },
    output: {
        path: BUILD_DIR,
        filename: '[name].bundle.js'
    },
    module : {
        loaders: [
            {
                test: /\.jsx?/,
                include: APP_DIR,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
};

module.exports = config;