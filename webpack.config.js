'use strict'

module.exports = {
    entry: {
        mvue: './min-vue/mvue.js'
    },
    output: {
        path: __dirname,
        filename: '_./build/[name].js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': resolve('src'),
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('node_modules/webpack-dev-server/client')]
            }
        ]
    }
}
