const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const env = process.env.NODE_ENV;

const config = {

  entry: './src/index.js',

  output: {
    //output.library 的值的作用，取决于output.libraryTarget 选项的值
    library: 'Recharts',
    //将你的 library 暴露为所有的模块定义下都可运行的方式
    libraryTarget: 'umd',
  },

  module: {

    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      include: [
        path.resolve(__dirname, 'src'),
      ],
      loader: 'babel-loader',
      query: {
        plugins: ['lodash'],
      },
    }],
  },

  plugins: [
    new LodashModuleReplacementPlugin({
      collections: true,
      shorthands: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
  ],

  devtool: 'source-map',

  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'prop-types': {
      root: 'PropTypes',
      commonjs2: 'prop-types',
      commonjs: 'prop-types',
      amd: 'prop-types',
    },
  },


};

if (env === 'analyse') {
  config.plugins.push(
    new BundleAnalyzerPlugin()
  );
}

if (env === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
      output: {
        comments: false,
      },
      sourceMap: false,
    })
  );
}

module.exports = config;
