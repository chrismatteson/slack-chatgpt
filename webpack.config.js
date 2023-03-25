const path = require('path');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
//        fallback: {
//            "crypto": require.resolve("crypto-browserify"),
//            "url": require.resolve("url/"),
//            "path": require.resolve("path-browserify"),
//            "util": require.resolve("util/"),
//            "stream": require.resolve("stream-browserify"),
//            "buffer": require.resolve("buffer/"),
//            "http": require.resolve("stream-http"),
//            "zlib": require.resolve("browserify-zlib"),
//            "os": require.resolve("os-browserify/browser"),
//            "https": require.resolve("https-browserify"),
//            "assert": require.resolve("assert/"),
//            async_hooks: false,
//            fs: false,
//            net: false
//        }

    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'spin.js',
        library: 'spin'
    },
    optimization: {
        minimize: false
    },
};
