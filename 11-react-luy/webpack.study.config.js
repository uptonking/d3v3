const {resolve} = require('path');
const webpack = require('webpack');

module.exports = {

    context: __dirname,

    entry: [
        'react-hot-loader/patch',
        'webpack/hot/only-dev-server',
        './study/study.js'
    ],

    output: {
        //打包后的文件存放的地方
        path: resolve(__dirname, 'build'),
        //打包后输出文件的文件名
        filename: "bundle.js",
        publicPath: "/"
    },

    devServer: {
        contentBase: resolve(__dirname, 'build'),
        hot: true,
        publicPath: '/',
    },
    resolve: {
        alias: {
            'react': 'anujs',
            'react-dom': 'anujs'
        }
    },
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

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
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
    devtool: "cheap-eval-source-map",
};
