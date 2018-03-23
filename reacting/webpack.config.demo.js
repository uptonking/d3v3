var path = require('path');
var webpack = require('webpack');
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = {
    entry: [
        './demo/index.js',
    ],

    output: {
        path: path.join(__dirname, 'public'),
        // path: __dirname,
        filename: 'bundle.js',
    },

    plugins:
        [
            new webpack.LoaderOptionsPlugin({
                debug: true
            }),
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            // new webpack.NoErrorsPlugin(),
            new FileManagerPlugin({
                onEnd: [
                    {
                        copy: [
                            //目录是相对于执行npm run命令的根目录，而不是webpack.config.js的位置
                            {source: "./public", destination: "./docs"}
                        ]
                    },
                ]
            }),
        ],

    // resolve: {
    //
    //     // 可以替换初始模块路径，此替换路径通过使用 resolve.alias 配置选项来创建一个别名
    //     alias: {
    //         'react': path.join(__dirname, '..', 'src/index.js'),
    //     },
    // },

    module:
        {

            rules: [{
                test: /\.(js|jsx)$/,
                include: [
                    __dirname,
                    path.join(__dirname, 'src'),
                    path.join(__dirname, 'demo'),
                ],
                use: {
                    loader: 'babel-loader',
                },
            }],


        }
    ,

    devtool: 'inline-source-map',
    devServer:
        {
            contentBase: path.join(__dirname, 'public'),
            port: 8999,
            hot: true,
            inline: true,
            publicPath: '/',
            watchContentBase: true,
        }

};
