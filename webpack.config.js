const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const {getIfUtils, removeEmpty} = require('webpack-config-utils')

const {testGlob} = require('./package.json');
const testFiles = glob.sync(testGlob);

// variables
const {ifProduction, ifDev} = getIfUtils(process.env.NODE_ENV);

const sourcePath = path.join(__dirname, 'src');
const outPath = path.join(__dirname, 'dist');
const assetsPath = path.join(__dirname, 'assets');
const modulesPath = path.join(__dirname, 'node_modules');

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isDev = ifDev(true, false);
const htmlTemplate = path.join(assetsPath, 'index.html');

module.exports = {
    devtool: 'eval',
    entry: removeEmpty({
        main: path.join(sourcePath, 'index.tsx'),
        tests: ifDev(testFiles.map(fileName => `mocha-loader!${fileName}`))
    }),
    output: {
        path: outPath,
        filename: '[name].js',
        pathinfo: isDev,
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: removeEmpty([
                    ifDev('react-hot-loader')
                    , {
                        loader: 'ts-loader',
                        options: {
                            compilerOptions: {
                                "noEmit": false
                            }
                        }
                    }])
            }, {
                test: /\.css$/,
                exclude: modulesPath,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        query: {
                            modules: true,
                            sourceMap: isDev,
                            importLoaders: 1,
                            localIdentName: '[local]__[hash:base64:5]'
                        }
                    }, {
                        loader: 'postcss-loader'
                    }]
                })
            },
            // static assets
            {test: /\.html$/, use: 'html-loader'},
            {test: /\.png$/, use: 'url-loader?limit=10000'},
            {test: /\.jpg$/, use: 'file-loader'},
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        // Fix webpack's default behavior to not load packages with jsnext:main module
        // (jsnext:main directs not usually distributable es6 format, but es6 sources)
        mainFields: ['module', 'browser', 'main']
    },
    target: 'web',
    plugins: removeEmpty([
        //     plugins: (loader) => [
        //    ...
        //          require('postcss-import')({ root: loader.resourcePath }),
        new webpack.LoaderOptionsPlugin({
            options: {
                context: sourcePath,
                postcss: removeEmpty([
                    require('postcss-import')({addDependencyTo: webpack}),
                    require('postcss-url')(),
                    require('autoprefixer'),
                    require('postcss-reporter')(),
                    ifProduction(require('postcss-browser-reporter')()),
                ])
            }
        }),
        new ExtractTextPlugin({
            filename: 'styles.css',
            disable: isDev
        }),
        new HtmlWebpackPlugin({
            excludeChunks: ['tests'],
            template: htmlTemplate,
        }),
        ifDev(new HtmlWebpackPlugin({
            chunks: ['tests'],
            template: htmlTemplate,
            filename: 'tests.html'
        }))
    ])
};
