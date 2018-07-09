
const path                  = require('path');
const webpack               = require('webpack')
const uglify                = require('uglifyjs-webpack-plugin');
const htmlPlugin            = require('html-webpack-plugin');
const extractTextPlugin     = require("extract-text-webpack-plugin");
const glob                  = require('glob');
const PurifyCSSPlugin       = require("purifycss-webpack");
const copyWebpackPlugin     = require("copy-webpack-plugin");

//配置环境变量   env==开发环境   online 生产环境
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'env';
console.log(WEBPACK_ENV);

var getHtml = function (name, title) {
    return {
        template    : './src/view' + name + '.html',
        filename    : 'view'+name + '.html',
        favicon     : './favicon.ico',
        title       : title,
        inject      : true,
        hash        : true,
        chunks      : [name,'common']  //chunks 默认会在生成的 html 文件中引用所有的 js 文件，当然你也可以指定引入哪些特定的文件。
    };
};
var webpackConfig = {
    entry: {
        'common' : ['./src/page/common/index.js']
    },
    output: {
        path        : path.resolve(__dirname, 'dist'),
        publicPath  : 'http://localhost:8181/',
        filename    : 'js/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use : extractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader' }
                    ]
                })
            },
            {
                test: /\.(png|jpg|gif)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 5000,
                        outputPath: 'resource/'
                    }
                }]
            },
            {
                test: /\.(js|jsx)$/,
                use: [
                    { loader: "babel-loader" },
                ],
                exclude: /node_modules/
            },
            // 字体图标的配置
            {
                test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'resource/[name].[ext]'
                        }
                    }
                ]
            } 
        ]
    },
    resolve : {
        alias : {
            node_modules    : __dirname + '/node_modules',
            util            : __dirname + '/src/util',
            page            : __dirname + '/src/page',
            service         : __dirname + '/src/service',
            image           : __dirname + '/src/image'
        }
    },
    plugins: [
        //压缩js
        new uglify(),
        // 独立通用模块到js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            name : 'common',
            filename : 'js/base.js'
        }),
        new htmlPlugin(getHtml('index', '主页')),
        //单独打包css
        new extractTextPlugin('css/[name].css'),
        //全局使用第三方类库
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new webpack.BannerPlugin('买菜的家朋版权所有'),
        //一些不用的照片（设计图或者文档都可以打包）
        // new copyWebpackPlugin([{
        //     from: __dirname + '/src/image',
        //     to: './public'
        // }])
    ],
    devServer: {
        historyApiFallback: {
            index: './src/view/index.html'
        },
        port: '8181',
    }
}

module.exports = webpackConfig;