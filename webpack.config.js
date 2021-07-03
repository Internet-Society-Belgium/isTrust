const path = require('path')

const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const pkg = require('./package.json')

module.exports = {
  entry: {
    background: './src/background/index.ts',
    content_scripts: './src/content_scripts/index.ts',
    popup: './src/popup/index.ts',
  },
  output: {
    path: path.join(__dirname, 'build'),
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
        use: 'file-loader',
      },
      {
        test: /\.(png|jpe?g|gif|webm|mp4|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/img',
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: pkg.name,
      template: path.resolve(__dirname, 'public', 'index.html'),
      favicon: './public/favicon.ico',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/manifest.json',
          to: 'manifest.json',
          transform(content) {
            const manifest = JSON.parse(content.toString())
            manifest.version = pkg.version
            manifest.content_security_policy =
              "script-src 'self' 'unsafe-eval'; object-src 'self'"
            return JSON.stringify(manifest, null, 2)
          },
        },
        {
          from: 'public/icons',
          to: 'assets/icons',
        },
        {
          from: 'public/_locales',
          to: '_locales',
        },
        {
          from: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js',
          to: 'lib/browser-polyfill.js',
        },
      ],
    }),
  ],
}
