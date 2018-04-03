// Imports.
var helpers = require('./helpers');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var ngToolsWebpack = require('@ngtools/webpack');

module.exports = {
  // Define entry points to pipeline.
  entry: {
    // Group external module references.
    'vendor': helpers.root('source/scripts/vendor.ts'),
    // Group redundancies.
    'polyfills': helpers.root('source/scripts/polyfills.ts'),
    // Group repository code.
    'app': helpers.root('/source/scripts/main.ts')
  },

  // Define how to find files and plugins.
  resolve: {
    // If files lack extensions, attempt to resolve them as one of the below.
    extensions: ['.ts', '.js', '.json', '.scss', '.css', '*'],
    // Point webpack to external vendor modules.
    modules: ['.', helpers.root('configuration/node_modules')],
    // Create short-form aliases for imports during development.
    alias: {
      styles: helpers.root('source/styles'),
      scripts: helpers.root('source/scripts')
    },
    // Allow omission of '-loader' suffix for ease-of-use.
    moduleExtensions: ['-loader']
  },

  // Define how files are processed.
  module: {
    rules: [
      // Functional code.
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          configFile: helpers.root('configuration/typescript/tslint.json')
        }
      },
      {
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        loader: '@ngtools/webpack'
      },
      // {
      //   test: /\.ts$/,
      //   use: [
      //     {
      //       loader: 'awesome-typescript-loader',
      //       options: {
      //         configFileName: helpers.root('configuration/typescript/tsconfig.json')
      //       }
      //     } , 'angular2-template-loader'
      //   ]
      // },
      // Styles.
      {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                config: {
                  path: helpers.root('configuration/postcss/postcss.config.js')
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                includePaths: [
                  helpers.root('source/styles')
                ]
              }
            }
          ]
        })
      },
      // Templates.
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      // Other assets.
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        use: 'file-loader?name=assets/[name].[hash].[ext]'
      }
    ]
  },

  // Define plugin settings.
  plugins: [
    // Needed for latest Angular features.
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      helpers.root('source'),
      {} // Routes.
    ),

    // Reduce redundancy in imports.
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

    // Load static assets.
    new CopyWebpackPlugin([
      {
        from: helpers.root('source/images'),
        to: 'images'
      },
      {
        from: helpers.root('source/fonts'),
        to: 'fonts'
      },
      {
        from: helpers.root('source/email'),
        to: 'email'
      },
      {
        from: helpers.root('source/files'),
        to: 'files'
      }
    ]),

    // Load the single-page-application.
    new HtmlWebpackPlugin({
      template: helpers.root('source/templates/index.html')
    }),

    // Create ahead-of-time compilation.
    new ngToolsWebpack.AngularCompilerPlugin({
      tsConfigPath: helpers.root('configuration/typescript/tsconfig.json'),
      entryModule: helpers.root('source/scripts/app/app.module#AppModule')
    })
  ]
};