var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var DashboardPlugin = require('webpack-dashboard/plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

// Globally define the build type.
var environment = require('../environments/environment.development');

module.exports = webpackMerge(commonConfig, {
  devtool: 'inline-source-map',

  output: {
    path: helpers.root('build'),
    publicPath: '',
    filename: 'scripts/[name].js',
    chunkFilename: 'scripts/[id].chunk.js'
  },

  devServer: {
    contentBase: 'local',
    port: 8080,
    host: '0.0.0.0',
    open: true,
    historyApiFallback: true
  },

  // Define plugin settings.
  plugins: [
    // Environment variables.
    new webpack.DefinePlugin(
        environment
    ),

    // Load mocks.
    new CopyWebpackPlugin([
      {
        from: helpers.root('source/mocks'),
        to: 'mocks'
      }
    ]),

    // Split styles into separate file.
    new ExtractTextPlugin({
      allChunks: true,
      filename: 'styles/app.css'
    }),
        
    new DashboardPlugin({
      port: 8081
    })
  ]
});