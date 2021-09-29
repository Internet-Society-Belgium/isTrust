const path = require('path')

const { DefinePlugin } = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebExtPlugin = require('web-ext-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const pkg = require('./package.json')

module.exports = (env, options) => {
    return {
        entry: {
            'background/index': './src/background/index.ts',
            'popup/index': './src/popup/index.ts',
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            clean: true,
        },
        resolve: {
            extensions: ['.ts', '.js', '.vue', '.json'],
        },
        devtool: false,
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader', 'postcss-loader'],
                },
                {
                    test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'popup/fonts/[hash][ext]',
                    },
                },
                {
                    test: /\.(png|jpe?g|gif|webm|mp4|svg)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'popup/assets/[hash][ext]',
                    },
                },
            ],
        },
        plugins: [
            new DefinePlugin({
                __VUE_OPTIONS_API__: false,
                __VUE_PROD_DEVTOOLS__: false,
            }),
            new VueLoaderPlugin(),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'public/manifest.json',
                        to: 'manifest.json',
                        transform(content) {
                            const manifest = JSON.parse(content.toString())
                            manifest.version = pkg.version
                            return JSON.stringify(manifest, null, 2)
                        },
                    },
                    {
                        from: 'public/index.html',
                        to: 'popup/index.html',
                    },
                    {
                        from: 'assets/icons',
                        to: 'icons',
                    },
                    {
                        from: 'public/_locales',
                        to: '_locales',
                    },
                ],
            }),
            new WebExtPlugin({
                sourceDir: path.join(__dirname, 'build'),
                target: env?.target || 'firefox-desktop',
            }),
        ],
        optimization: {
            minimizer: [`...`, new CssMinimizerPlugin()],
        },
        performance: {
            hints: false,
        },
    }
}
