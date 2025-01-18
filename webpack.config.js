const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/renderer/index.js',
        financial: './src/renderer/financial.js',
        'tax-entries': './src/renderer/tax-entries.js',
        'tax-entry-details': './src/renderer/tax-entry-details.js'
    },
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    target: 'electron-renderer'
};