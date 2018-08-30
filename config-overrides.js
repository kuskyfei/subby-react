const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const DelWebpackPlugin = require('del-webpack-plugin')

// debug
const util = require('util') // eslint-disable-line
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin // eslint-disable-line

const uglifyOptions = {
  sourceMap: false,
  compress: {
    sequences: true,
    dead_code: true,
    conditionals: true,
    booleans: true,
    unused: true,
    if_return: true,
    join_vars: true,
    drop_console: true
  },
  output: {
    comments: false
  }
}

module.exports = function override (config, env) {
  if (env === 'production') {
    
    // replace UglifyJsPlugin because it causes problems
    // with node modules not transpiled to ES5
    config.plugins.splice(3, 1)
    config.plugins.push(new UglifyJsPlugin({uglifyOptions}))

    // compile the entire app to a single html file
    config.plugins.splice(1, 1)
    config.plugins.push(new HtmlWebpackPlugin({
      inlineSource: '.(js|css)$',
      inject: 'body',
      template: 'public/index.html',
      filename: 'subby.html'
    }))
    config.plugins.push(new HtmlWebpackInlineSourcePlugin())
    // delete the extra files created and only keep index.html
    config.plugins.push(new DelWebpackPlugin({
      include: ['**'],
      exclude: ['subby.html'],
      info: false,
      keepGeneratedAssets: false
    }))

    // remove sourcemaps
    config.devtool = false

    /* debugging */

    /* analyze bundle sizes
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        reportFilename: "report.html",
      })
    ) */

    // console.log(util.inspect(config, {depth: null}))
    // process.kill()

    /* end debugging */
  }

  

  // replace default create-react-app ESLint with Standard.js
  config.module.rules[0] = {
    enforce: 'pre',
    test: /\.jsx?$/,
    loader: 'standard-loader',
    exclude: /(node_modules|bower_components)/,
    options: {
      parser: 'babel-eslint'
    }
  }

  return config
}
