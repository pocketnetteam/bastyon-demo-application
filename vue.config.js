const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
    productionSourceMap: false,
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8081, // CHANGE YOUR PORT HERE!
        https: true,
        hotOnly: false,
    },
    
    css: {
        extract: false,
    },
    publicPath: "/",
    configureWebpack: {
        optimization: {
            splitChunks: false
        },

        plugins: [
            new HtmlWebpackPlugin({
                filename: 'output.html', // the output file name that will be created
                template: 'src/output.html', // this is important - a template file to use for insertion
                inlineSource: '.(js|css)$' // embed all javascript and css inline
            }),
            new HtmlWebpackInlineSourcePlugin()
        ]
    },

}