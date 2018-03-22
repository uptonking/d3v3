const { resolve } = require('path');
const webpack = require('webpack');
module.exports = {
    context: __dirname,
    entry: [
        // 'react-hot-loader/patch',
        // 'webpack/hot/only-dev-server',
        './app/src/app.js'
    ],
    output: {
        path: resolve(__dirname, 'build'),//打包后的文件存放的地方
        filename: "bundle.js",//打包后输出文件的文件名
        publicPath: "/",
        // libraryTarget: 'umd'
    },
    devServer: {
        contentBase: resolve(__dirname, 'build'),
        hot: true,
        publicPath: '/',
    },
    resolve: {
        alias: {
           'react': '/Users/Floveluy/Desktop/Luy/src/Luy/index.js',
           'react-dom': '/Users/Floveluy/Desktop/Luy/src/Luy/index.js'
        }
     },
    // externals: {
    //     'react': {
    //       'commonjs': 'react',
    //       'commonjs2': 'react',
    //       'amd': 'react',
    //       // React dep should be available as window.React, not window.react
    //       'root': 'React'
    //     },
    //     'react-dom': {
    //       'commonjs': 'react-dom',
    //       'commonjs2': 'react-dom',
    //       'amd': 'react-dom',
    //       'root': 'ReactDOM'
    //     }
    //   },
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
                use: [
                    'style-loader', 'css-loader'
                ],
                exclude: /node_modules/
            },
        ],
    },
    plugins: [
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.NamedModulesPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        }),
    ],
    // devtool: "cheap-eval-source-map",
};