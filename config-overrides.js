const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const DelWebpackPlugin = require('del-webpack-plugin')
const {manifest, images, settingsMessage} = require('./src/settings')

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
      filename: 'subby.html',
      subbyFavicon: images.favicon,
      subbyManifest: JSON.stringify(manifest),
      settingsMessage
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

    // analyze bundle sizes
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'report.html'
      })
    )

    // console.log(util.inspect(config, {depth: null})) // debug
    // process.kill() // debug
  } else { // eslint-disable-line
    config.plugins.push(new HtmlWebpackPlugin({
      inlineSource: '.(js|css)$',
      inject: 'body',
      template: 'public/index.html',
      filename: 'index.html',
      subbyFavicon: images.favicon,
      subbyManifest: JSON.stringify(manifest),
      settingsMessage
    }))
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

  // enable inline web workers as .worker.js files
  // this added 1.5mb to the bundle so we decided
  // not to use web workers
  // config.module.rules.push({
  //   test: /\.worker\.js$/,
  //   use: {
  //     loader: 'worker-loader',
  //     options: {inline: true}
  //   }
  // })

  return config
}
