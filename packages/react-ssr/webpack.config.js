const { resolve } = require('path')
const nodeExternals = require('webpack-node-externals')
const { StatsWriterPlugin } = require('webpack-stats-plugin')
const merge = require('webpack-merge')

const ifDev = (a, b) => process.env.NODE_ENV === 'development' ? a : b

const base = {
  mode: process.env.NODE_ENV || 'production',
  devtool: ifDev('eval-cheap-module-source-map', 'source-map'),
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js']
  }
}

module.exports = [
  merge(base, {
    target: 'web',
    entry: {
      main: resolve(__dirname, 'src/client')
    },
    output: {
      filename: ifDev('[name].js', '[name].[contenthash].js'),
      chunkFilename: ifDev('[name].chunk.js', '[name].[contenthash].chunk.js'),
      path: resolve(__dirname, 'build/public')
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: require.resolve('babel-loader')
        },
        {
          test: /\.css$/,
          use: ifDev(
            ['style-loader', { loader: 'css-loader', options: { sourceMap: true } }],
            ['file-loader', 'extract-loader', { loader: 'css-loader', options: { sourceMap: true } }]
          )
        }
      ]
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },
    plugins: [
      new StatsWriterPlugin({
        transform (data, opts) {
          const files = Array.from(opts.compiler.assetsInfo.keys())
          return JSON.stringify({
            scripts: files.filter(entry => /\.js$/.test(entry)),
            styles: files.filter(entry => /\.css$/.test(entry))
          }, null, 2)
        }
      })
    ]
  }),
  merge(base, {
    target: 'node',
    entry: {
      server: resolve(__dirname, 'src/server')
    },
    output: {
      filename: '[name].js',
      path: resolve(__dirname, 'build')
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [
                ['@babel/preset-env', { targets: { node: 'current' } }]
              ]
            }
          }
        }
      ]
    },
    externals: [nodeExternals()]
  })
]
