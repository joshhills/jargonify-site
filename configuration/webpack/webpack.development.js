var webpackMerge = require('webpack-merge');
var DashboardPlugin = require('webpack-dashboard/plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
  devtool: 'inline-source-map',

  output: {
    path: helpers.root('build'),
    publicPath: '',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  devServer: {
    contentBase: 'dist',
    port: 8080,
    host: "0.0.0.0",
    open: true
  },

  // Define plugin settings.
  plugins: [
    // Split styles into separate file.
    new ExtractTextPlugin({
      allChunks: true,
      filename: 'app.css'
    }),
        
    new DashboardPlugin({
      port: 8081
    })
  ]
});