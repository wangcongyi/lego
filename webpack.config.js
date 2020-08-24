const path = require('path')
const webpack = require('webpack')
const env = process.env.NODE_ENV || 'development'
// const env = 'production'
const isProd = env === 'production'
const excludeAcps = isProd
// const excludeAcps = false // TODO ACPS 排除acps - 要部署生产的Acps 需要取消注释
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
// const TerserPlugin = require('terser-webpack-plugin')
// const HtmlWebPackPlugin = require("html-webpack-plugin");

function resolve(dir) {
  return path.resolve(__dirname, dir)
}

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    // filename: "[name]-[chunkhash:6].bundle.js",
    // chunkFilename: "[name]-[chunkhash:6].chunk.js",
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/static/'
  },
  externals: {
    'vue': 'Vue',
    // 'vue-router': 'VueRouter',
    'element-ui': 'ELEMENT'
  },
  mode: env,
  module: {
    // https://blog.csdn.net/weixin_34000916/article/details/90252187
    // require function is used in a way in which dependencies cannot be statically extracted
    // unknownContextCritical : false,
    rules: [
      {
        test: /\.less$/,
        use: ['vue-style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.styl$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'postcss-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: excludeAcps ? /Acps.vue/ : []
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          // limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        exclude: [resolve('src/icons')],
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.env.BUILD_ARGVS': JSON.stringify(process.env.BUILD_ARGVS)
    }),
    // make sure to include the plugin!
    new VueLoaderPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled', // 不启动展示打包报告的http服务器 server disabled
      generateStatsFile: false // 是否生成stats.json文件
    })
    // 默认配置的具体配置项
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: '8888',
    //   reportFilename: 'report.html',
    //   defaultSizes: 'parsed',
    //   openAnalyzer: true,
    //   generateStatsFile: false,
    //   statsFilename: 'stats.json',
    //   statsOptions: null,
    //   excludeAssets: null,
    //   logLevel: info
    // })
    // new HtmlWebPackPlugin({
    //   template: "./index.html"
    // })
  ],
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src')
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devtool: isProd ? false : '#eval-source-map'
}
