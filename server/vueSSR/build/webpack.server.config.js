const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const path = require('path')

function resolve(dir) {
  return path.resolve(__dirname, dir)
}

module.exports = merge(base, {
  target: 'node',
  devtool: '#source-map',
  entry: resolve('../src/entry-server.js'),
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': 'server',
      'process.env.BUILD_ARGVS': JSON.stringify(process.env.BUILD_ARGVS)
    }),
    new VueSSRServerPlugin()
  ]
})