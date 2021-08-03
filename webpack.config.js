const path = require('path')

const { VueLoaderPlugin } = require('vue-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebExtPlugin = require('web-ext-plugin');

const pkg = require('./package.json')

module.exports = {
  entry: {
    'background/index': './src/background/index.ts',
    'content_scripts/index': './src/content_scripts/index.ts',
    'popup/index': './src/popup/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
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
              outputPath: 'popup/assets',
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
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
          from: 'public/index.html',
          to: 'popup/index.html',
        },
        {
          from: 'public/favicon.ico',
          to: 'popup/favicon.ico',
        },
        {
          from: 'public/icons',
          to: 'icons',
        },
        {
          from: 'public/_locales',
          to: '_locales',
        },
        {
          from: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js',
          to: 'lib/browser-polyfill.js',
          transform: (content) => {
            return content
              .toString()
              .replace('//# sourceMappingURL=browser-polyfill.min.js.map', '')
          },
        },
      ],
    }),
    new WebExtPlugin({sourceDir: path.join(__dirname, 'build')}),
  ],
}