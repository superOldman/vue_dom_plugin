const path = require('path');
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
// const env = require(`./config/${process.env.env_config}.env`)

function resolve(dir) {
    return path.join(__dirname, dir)
}


module.exports = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        static: {
            directory: path.resolve(__dirname, './dist'),
        },
        hot: true,
        port: '7777',
        allowedHosts: 'all',
        devMiddleware: {
            stats: 'minimal',
        },
    },
    // watch: process.env.env_config == "dev",
    entry: {
        core: './src/index.js',
    },
    resolve: { // 路径别名
        alias: {
            '@': path.resolve('src'),
        }
    },
    output: {
        filename: '[name].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                    // options: {
                    //     shadowMode: true
                    // }
                }
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            'syntax-dynamic-import',
                            ["component", 
                                {
                                    "libraryName": "element-ui",
                                    "styleLibraryName": "theme-chalk"
                                }
                            ]
                        ]
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "vue-style-loader",
                        // options: {
                        //     shadowMode: true
                        // }
                    },
                    // 'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "vue-style-loader",
                        // options: {
                        //     shadowMode: true
                        // }
                    },
                    {
                        loader: 'css-loader',
                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                exclude: [resolve('src/icons')],
                options: {
                    limit: 10000,
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader'
            }
        ]
    },
    plugins: [
        // new webpack.DefinePlugin({
        //     'process.env': env
        // }),
        // 请确保引入这个插件！
        new VueLoaderPlugin()
    ],
    optimization: {
        minimize: false
    }
};