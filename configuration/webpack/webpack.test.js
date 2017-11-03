var webpack = require('webpack');
var helpers = require('./helpers');

module.exports = {
  devtool: 'inline-source-map',
  
  // Define how to find files and plugins.
  resolve: {
    // If files lack extensions, attempt to resolve them as one of the below.
    extensions: ['.ts', '.js', '.json', '.scss', '.css', '*'],
    // Point webpack to external vendor modules.
    modules: ['.', helpers.root('configuration/node_modules')],
    // Create short-form aliases for imports during development.
    alias: {},
    // Allow omission of '-loader' suffix for ease-of-use.
    moduleExtensions: ['-loader']
  },

  // Define how files are processed.
  module: {
    rules: [
      // Functional code.
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: helpers.root('configuration/typescript/tsconfig.json')
            }
          } , 'angular2-template-loader'
        ]
      },
      // Templates.
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      // Ignore other assets that are useless to tests.
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico|s?css)$/,
        use: 'null-loader'
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
    )
  ]
};