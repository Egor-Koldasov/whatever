// @flow
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const process = require('process');

const config = {
  context: path.resolve(__dirname, './src'),
  entry: {
    'main': './main',
    'worker': './worker',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js'
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules',
    ],
    extensions: ['.js', '.css', '.scss'],
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([{from: './static'}]),
  ],
  watch: true,
  devtool: 'eval',
  devServer: {
    contentBase: './dist',
    port: process.env.NODE_PORT || 4000,
    host: '0.0.0.0',
  },
};

module.exports = config;
