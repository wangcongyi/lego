const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const path = require('path')

function resolve(dir) {
  return path.resolve(__dirname, dir)
}

const config = merge(base, {
  entry: {
    app: resolve('../src/entry-client.js')
  },
  plugins: [
    new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VUE_ENV': 'client',
    'process.env.BUILD_ARGVS': JSON.stringify(process.env.BUILD_ARGVS)
    }),
    new VueSSRClientPlugin()
  ],
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
  }
})

module.exports = config