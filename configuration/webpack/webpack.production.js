var webpack = require('webpack');
var commonConfig = require('./webpack.common.js');
var copyRightInfo = require('../copyright.info');
var helpers = require('./helpers');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// Set the environment.
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

// Merge this configuration with 'common'.
module.exports = webpackMerge(commonConfig, {
    // Don't include source-maps.
    devtool: 'eval',

    // Define the exit points to the pipeline.
    output: {
        // The output directory.
        path: helpers.root('distribution'),
        // Output files relative to the index.
        publicPath: '',
        // Cache-bust output files.
        filename: '[name].[hash].js',
        chunkFilename: '[id].[hash].chunk.js'
    },

    // Define plugin settings.
    plugins: [
        // Fail if there were any errors.
        new webpack.NoEmitOnErrorsPlugin(),
        
        // Minimise scripts.
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                keep_fnames: true
            }
        }),

        // Cache-bust stylesheet.
        new ExtractTextPlugin('app.[hash].css'),
        
        // Set the build environment for use in-application.
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV)
            }
        }),
        
        // Override some loader options to suit production.
        new webpack.LoaderOptionsPlugin({
            'html-loader': {
                minimize: false
            },
            'css-loader': {
                sourceMap: false
            }
        }),

        // Optimise extra files.
        new OptimizeCssAssetsPlugin(),

        // Add a banner to each file.
        new webpack.BannerPlugin(copyRightInfo),

        // Create additional compressed files.
        new CompressionPlugin(),

        // Enable analysis of result.
        new BundleAnalyzerPlugin()
    ]
});