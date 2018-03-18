var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: __dirname,
  devtool: '#inline-source-map',

  entry: [
    './index.js',
  ],

  output: {
    path: __dirname + '/build',
    filename: 'bundle.js',
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoErrorsPlugin()
  ],

  resolve: {

    // 可以替换初始模块路径，此替换路径通过使用 resolve.alias 配置选项来创建一个别名
    alias: {
      'recharts': path.join(__dirname, '..', 'src/index.js'),
    },
  },

  module: {

    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      include: [
        __dirname,
        path.join(__dirname, '..', 'src'),
      ],
    }],

  },
};
