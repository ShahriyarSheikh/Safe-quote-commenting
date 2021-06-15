const fs = require('fs');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: './src/app.ts',
    output: {
        path: __dirname + '/build',
        filename: 'app.js',
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    plugins: [
        new Dotenv({
            path: 'production.env'
          }),
        new CopyWebpackPlugin([
            {
                from: 'views/',
                to: 'views/[folder]/[name].[ext]',
                toType: 'template',
                flatten:true
            },
            {
                from: 'templates/',
                to: 'templates/[name].[ext]',
                toType: 'template'
            }
        ])
    ],
   target: 'node'
};