const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

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
  mangle: {
    except: ['$super', '$', 'exports', 'require']
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
    config.plugins.push(new UglifyJsPlugin(uglifyOptions))

    // compile the entire app to a single html file
    config.plugins.splice(1, 1)
    config.plugins.push(new HtmlWebpackPlugin({
      inlineSource: '.(js|css)$'
    }))
    config.plugins.push(new HtmlWebpackInlineSourcePlugin())

    // config.plugins.push(new HtmlWebpackInlineSourcePlugin())
    // config.output.filename = null
    // config.output.chunkFilename = null
    // config.output.devtoolModuleFilenameTemplate = null

    // remove sourcemaps
    config.devtool = false

    // analyze
    // config.plugins.push(
    //   new BundleAnalyzerPlugin({
    //     analyzerMode: "static",
    //     reportFilename: "report.html",
    //   })
    // )
  }

  console.log(util.inspect(config.module.rules[1], {depth: null}))
  // process.exit()

  // replace default create-react-app ESLint with Standard.js
  config.module.rules[0] = {
    // set up standard-loader as a preloader
    enforce: 'pre',
    test: /\.jsx?$/,
    loader: 'standard-loader',
    exclude: /(node_modules|bower_components)/,
    options: {
      // config options to be passed through to standard e.g.
      parser: 'babel-eslint'
    }
  }

  return config
}
