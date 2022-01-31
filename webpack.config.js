const webpack = require( 'webpack' ),
  terserPlugin = require( 'terser-webpack-plugin' ),
  path = require( 'path' );

const rules = {
  js: {
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: /(node_modules)/,
    options: {
      presets: [ '@babel/preset-env' ],
      plugins: [ '@babel/plugin-transform-modules-commonjs' ],
      passPerPreset: true,
    },
  },

};

module.exports = function ( env, argv ) {
  var config = {
    name: 'main',
    entry: {
      'dist/index': './bundle.js',
      'dist/errors/index': './errorsBundle.js'
    },
    output: {
      path: __dirname,
      filename: '[name].js',
      library: {
        type: 'umd'
      },
      globalObject: 'this'
    },
    externals: {
      'window': 'window'
    },
    optimization: {
      minimize: env.production,
      minimizer: [
        new terserPlugin( {
          // include: /\.min\.js$/,
          terserOptions: {
            sourceMap: env.production,
            format: {
              ascii_only: true,
              beautify: false,
              comments: /^!/
            }
          },
          extractComments: false
        } ),
        new terserPlugin( {
          exclude: /\.min\.js$/,
          terserOptions: {
            sourceMap: !env.production,
            format: {
              ascii_only: true,
              beautify: true,
              comments: /^!/
            }
          },
          extractComments: false
        } ) ]
    },
    module: {
      rules: [
        rules.js,
      ]
    },
    resolve: {
      extensions: [ '.wasm', '.mjs', '.js', '.ts', '.json' ],
    },
    devtool: env.production ? undefined : 'source-map',
    bail: true,
    mode: env.production ? 'production' : 'none',
    target: [ 'web', 'es6' ],
  };

  return [ config ];
};
