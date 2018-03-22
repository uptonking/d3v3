// Karma configuration
// Generated on Thu Mar 30 2017 18:03:26 GMT+0800 (CST)
var path = require("path");
var webpack = require("webpack");
var coverage = String(process.env.COVERAGE) !== "false";
const { resolve } = require('path');

module.exports = function (config) {
    var options = {

        // base path that will be used to resolve all patterns (eg. files, exclude)
        //  basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["mocha", "chai"],


        // list of files / patterns to load in the browser
        files: [
            "./__test__/matchers.js",
            process.env.TRAVIS ? "./test/spec2.js" : "./test/spec.js",
            '__test__/**/*.spec.js',
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["spec", "coverage"],
        preprocessors: {
            "src/Luy/index.js": ["coverage"],
            //'src/**/*.js': ['coverage'],
            "test/**/*.js": ["webpack"],
            "__test__/**/*.js": ["webpack"]
        },
        mochaReporter: {
            showDiff: true
        },
        browserLogOptions: {
            terminal: true
        },
        browserConsoleLogOptions: {
            terminal: true
        },
        coverageReporter: {
            type: "html",
            dir: "coverage/"
        },
        webpack: {

            module: {
                rules: [
                    {
                        test: /\.jsx?$/,
                        use: [
                            'babel-loader',
                        ],
                        exclude: /node_modules/
                    },
                    {
                        test: /\.css$/,
                        loader: 'style-loader!css-loader'//在webpack-dev中不能使用--hot
                    },

                ]
            },
            resolve: {
                alias: {
                    'react': resolve('src/Luy/index.js'),
                    'react-dom': resolve('src/Luy/index.js')
                }
            },
            plugins: [
                new webpack.DefinePlugin({
                    coverage: coverage,
                    'process.env': {
                        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                    },
                }),
            ],
        },
        webpackMiddleware: {
            noInfo: true //去掉编译文件的LOG
        },
        //hostname: '127.0.0.1',
        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        //    logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        // browsers: ['Chrome', 'Firefox', 'PhantomJS'],
        customLaunchers: {
            "Chrome": {
                base: "WebDriverio",
                browserName: "chrome",
                name: "Karma"

            }

        },
        browsers: ["Chrome"],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    };
    if (process.env.TRAVIS) {

        options.browsers = ["Firefox"];
    }

    config.set(options);
};