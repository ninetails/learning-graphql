const { resolve } = require('path')
const nodeExternals = require('webpack-node-externals')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const PnpWebpackPlugin = require('pnp-webpack-plugin')
const { StatsWriterPlugin } = require("webpack-stats-plugin")
const merge = require('webpack-merge')

const ifDev = (a, b) => process.env.NODE_ENV === 'development' ? a : b

const base = {
  devtool: ifDev('eval-cheap-module-source-map', 'source-map'),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: require.resolve('babel-loader')
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js'],
    plugins: [
      PnpWebpackPlugin,
    ]
  },
  resolveLoader: {
    plugins: [
      PnpWebpackPlugin.moduleLoader(module),
    ]
  }
}

module.exports = [
  merge(base, {
    target: 'web',
    entry: {
      main: resolve(__dirname, 'src/client.tsx')
    },
    output: {
      filename: ifDev('[name].js', '[name].[contenthash].js'),
      chunkFilename: ifDev('[name].chunk.js', '[name].[contenthash].chunk.js'),
      path: resolve(__dirname, 'build/public')
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ifDev(
            ['style-loader', { loader: 'css-loader', options: { sourceMap: true } }],
            ['file-loader', 'extract-loader', { loader: 'css-loader', options: { sourceMap: true } }]
          )
        }
      ]
    },
    plugins: [
      new StatsWriterPlugin({
        transform(data, opts) {
          const files = Array.from(opts.compiler.assetsInfo.keys())
          return JSON.stringify({
            main: files.find(entry => /\.js$/.test(entry)),
            css: files.find(entry => /\.css$/.test(entry))
          }, null, 2)
        }
      })
    ]
  }),
  merge(base, {
    target: 'node',
    entry: {
      server: resolve(__dirname, 'src/server.tsx')
    },
    output: {
      filename: '[name].js',
      path: resolve(__dirname, 'build')
    },
    externals: [nodeExternals()]
  })
]
