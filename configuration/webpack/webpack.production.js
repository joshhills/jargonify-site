var webpack = require('webpack');
var commonConfig = require('./webpack.common.js');
var copyrightInfo = require('../copyright-info');
var helpers = require('./helpers');
var webpackMerge = require('webpack-merge');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var CompressionPlugin = require('compression-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// Globally define the build type.
var environment = require('../environments/environment.production');

// Merge this configuration with 'common'.
module.exports = webpackMerge(commonConfig, {
    mode: 'production',

    // Don't include source-maps.
    devtool: 'eval',

    // Define the exit points to the pipeline.
    output: {
        // The output directory.
        path: helpers.root('distribution'),
        // Output files relative to the index.
        publicPath: '',
        // Cache-bust output files.
        filename: 'scripts/[name].[hash].js',
        chunkFilename: 'scripts/[id].[hash].chunk.js'
    },

    devServer: {
        contentBase: 'local',
        port: 8080,
        host: '0.0.0.0',
        open: true,
        historyApiFallback: true,
        compress: true
    },

    // Define plugin settings.
    plugins: [
        // Environment variables.
        new webpack.DefinePlugin(
            environment
        ),

        // Cache-bust stylesheet.
        new MiniCssExtractPlugin({
            filename: 'styles/app.[hash].css'
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
        new webpack.BannerPlugin({
            banner: copyrightInfo,
            include: /\.(js|css)$/
        }),

        // Create additional compressed files.
        new CompressionPlugin(),

        // Enable analysis of result.
        // new BundleAnalyzerPlugin()
    ]
});