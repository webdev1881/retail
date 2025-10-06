// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

// const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

module.exports = {
    configureWebpack: {
    optimization: {
      splitChunks: false
    },
    output: {
      filename: 'app.js'
    },
    plugins: [
    //   new ScriptExtHtmlWebpackPlugin({
    //     inline: ['app.js'] // инлайнить итоговый бандл
    //   })
    ]
  },
  css: {
    extract: false // стили внутрь JS
  },
  productionSourceMap: true, // отключить source map в продакшн
    devServer: {
        proxy: {
            '/api': {
                target: 'https://89.105.216.114/',
                changeOrigin: true,
                ws: true,
                secure: false
            },
            '/skuSet': {
                target: 'https://89.105.216.114/',
                changeOrigin: true,
                ws: true,
                secure: false
            }
        }
    }
}