const path = require('path')
const env = process.env.NODE_ENV || 'development'
// const env = 'production'
const isProd = env === 'production'
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

function resolve(dir) {
  return path.resolve(__dirname, dir)
}

module.exports = {
  devtool: isProd ? false : '#eval-source-map',
  output: {
    filename: '[name]-[chunkhash].js'
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      // 公用前端模板的src
      '@': resolve('../../../src')
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  mode: env,
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['vue-style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: loader => [
                require('autoprefixer')(),
                require('postcss-px-to-viewport')({
                  viewportWidth: 375, // (Number) The width of the viewport.
                  viewportHeight: 667, // (Number) The height of the viewport.
                  unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
                  viewportUnit: 'vw', // (String) Expected units.
                  selectorBlackList: ['.ignore', '.hairlines'], // (Array) The selectors to ignore and leave as px.
                  minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
                  mediaQuery: false // (Boolean) Allow px to be converted in media queries.
                })
              ]
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
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
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    // make sure to include the plugin!
    new VueLoaderPlugin()
    // new HtmlWebPackPlugin({
    //   template: "./index.html"
    // })
  ]
}
