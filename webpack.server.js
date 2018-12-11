const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './server.js',
    target: 'node',
    externals: [nodeExternals()],
    output: {
        path: path.resolve('server-build'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: [
                    /node_modules/,
                    /bower_components/,
                    /server-build/,
                    /webpack.config.js/
                ],
                loader: 'babel-loader'
            }
        ]
    },
    resolve: {
        alias: {
            component: path.resolve(__dirname, "./src/components"),
            container: path.resolve(__dirname, "./src/containers"),
            action: path.resolve(__dirname, "./src/actions"),
            helper: path.resolve(__dirname, "./src/helpers"),
            config: path.resolve(__dirname, "./config.json")
        },
        extensions: [".jsx", ".js", ".json"]
    }
};