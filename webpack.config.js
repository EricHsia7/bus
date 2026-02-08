const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const AdvancedPreset = require('cssnano-preset-advanced');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MangleCssClassPlugin = require('mangle-css-class-webpack-plugin');
const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');
const ESLintPlugin = require('eslint-webpack-plugin');
const postcssColorMixFunction = require('@csstools/postcss-color-mix-function');
const { Hasher } = require('./hasher');
const { ErrorCodePlugin } = require('./plugins/error-code-plugin');
const { PostCssOptimizationPlugin } = require('./plugins/postcss-optimization-plugin');
const splashScreenHTML = require('./dist/splash-screen/html.json');
const thisVersion = require('./dist/version.json');

module.exports = (env, argv) => {
  return {
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[contenthash].css',
        runtime: false
      }),
      new MangleCssClassPlugin({
        classNameRegExp: '(css_|b-cssvar-)[a-z0-9_-]*',
        mangleCssVariables: true,
        /*ignorePrefix: [''],*/
        log: false
      }),
      new webpack.DefinePlugin({
        'process.env': {
          HASH: JSON.stringify(thisVersion.hash),
          FULL_HASH: JSON.stringify(thisVersion.full_hash),
          BRANCH_NAME: JSON.stringify(thisVersion.branch_name),
          TIME_STAMP: JSON.stringify(thisVersion.timestamp),
          SPLASH_SCREEN_HTML: JSON.stringify(splashScreenHTML.html)
        }
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html', // Path to your custom HTML template file
        inject: 'head',
        minify: {
          collapseWhitespace: true,
          keepClosingSlash: true,
          removeComments: true,
          removeRedundantAttributes: false,
          removeScriptTypeAttributes: false,
          removeStyleLinkTypeAttributes: false,
          useShortDoctype: false,
          minifyJS: true // This option minifies inline JavaScript
        }
      }),
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        exclude: [/\.map$/, /\.erm$/, /LICENSE\.txt$/],
        include: [/\.js|css|png$/, /index\.html$/],
        cacheId: `bus-${thisVersion.hash}`,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets'
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-sources'
            }
          }
        ]
      }),
      new SubresourceIntegrityPlugin({
        hashFuncNames: ['sha512'], // Hash algorithms
        enabled: true
      }),
      new ESLintPlugin({
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        failOnError: false
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static', // Generate static HTML report
        reportFilename: 'bundle-analysis-report/index.html' // Output file path and name
      })
    ],
    target: ['web', 'es6'], // Target the browser environment (es6 is the default for browsers)
    mode: 'production', // Set the mode to 'production' or 'development'
    entry: './src/index.ts', // Entry point of your application
    output: {
      filename: '[contenthash].js', // Output bundle filename
      hashFunction: Hasher,
      path: path.resolve(__dirname, 'dist'), // Output directory for bundled files
      publicPath: './',
      crossOriginLoading: 'anonymous', // Required for SRI
      library: {
        name: 'bus',
        type: 'umd',
        umdNamedDefine: true,
        export: 'default'
      }
    },
    module: {
      rules: [
        {
          test: /\.js|ts|jsx|tsx$/, // Use babel-loader for TypeScript files
          exclude: [/node_modules/, /index\.html/],
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { exclude: ['@babel/plugin-transform-regenerator', '@babel/plugin-transform-template-literals', '@babel/plugin-transform-for-of'] }], 'babel-preset-modules', '@babel/preset-typescript'],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'], // File extensions to resolve
      mainFields: ['browser', 'module', 'main']
    },
    optimization: {
      minimize: true,
      minimizer: [
        new ErrorCodePlugin(),
        new TerserPlugin({
          extractComments: true,
          terserOptions: {
            compress: {
              drop_console: [/*'log',*/ 'assert', 'clear', 'count', 'countReset', 'debug', 'dir', 'dirxml', 'error', 'group', 'groupCollapsed', 'groupEnd', 'info', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeLog', 'timeStamp', 'trace', 'warn']
            }
          }
        }),
        new CssMinimizerPlugin({
          parallel: 4,
          minimizerOptions: {
            preset: [
              'default',
              AdvancedPreset,
              {
                discardComments: { removeAll: true }
              }
            ]
          }
        }),
        new PostCssOptimizationPlugin({
          plugins: [postcssColorMixFunction({ preserve: false })]
        })
      ],
      splitChunks: {
        chunks: 'all',
        minSize: 25000,
        maxSize: 51200,
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      },
      concatenateModules: true,
      chunkIds: 'deterministic',
      mangleExports: 'size',
      avoidEntryIife: true
    },
    devtool: 'source-map',
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      hot: false
    }
  };
};
