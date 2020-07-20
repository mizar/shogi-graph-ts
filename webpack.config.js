/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const { gzip } = require("@gfx/zopfli");
const { name } = require("./package.json");
const CopyFilePlugin = require("copy-webpack-plugin");
const path = require("path");

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = (env) => ({
    devtool: "source-map",
    entry: "./src/main.ts",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
            },
            {
                test: /\.(jpe?g|png|gif|ttf|otf)$/i,
                loader: "url-loader",
            },
            {
                test: /\.svg$/i,
                loader: "raw-loader",
            },
        ],
    },
    plugins: [].concat(
        [new CleanWebpackPlugin()],
        [
            new HtmlWebPackPlugin({
                title: name,
                template: "./src/floodgate_single.ejs",
                chunks: ["floodgate_single"],
                filename: "floodgate_single.html",
            }),
            new HtmlWebPackPlugin({
                title: name,
                template: "./src/floodgate_multi.ejs",
                chunks: ["floodgate_multi"],
                filename: "floodgate_multi.html",
            }),
            new HtmlWebPackPlugin({
                title: name,
                template: "./src/denryusen_single.ejs",
                chunks: ["denryusen_single"],
                filename: "denryusen_single.html",
            }),
            new HtmlWebPackPlugin({
                title: name,
                template: "./src/denryusen_multi.ejs",
                chunks: ["denryusen_multi"],
                filename: "denryusen_multi.html",
            }),
            new HtmlWebPackPlugin({
                title: name,
                template: "./src/denryusen_single_test1.ejs",
                chunks: ["denryusen_single_test"],
                filename: "denryusen_single_test1.html",
            }),
            new HtmlWebPackPlugin({
                title: name,
                template: "./src/denryusen_single_test2.ejs",
                chunks: ["denryusen_single_test"],
                filename: "denryusen_single_test2.html",
            }),
            new HtmlWebPackPlugin({
                title: name,
                template: "./src/denryusen_single_test3.ejs",
                chunks: ["denryusen_single_test"],
                filename: "denryusen_single_test3.html",
            }),
            new HtmlWebPackPlugin({
                title: name,
                template: "./src/denryusen_multi_test1.ejs",
                chunks: ["denryusen_multi_test"],
                filename: "denryusen_multi_test1.html",
            }),
            new HtmlWebPackPlugin({
                title: name,
                template: "./src/denryusen_multi_test2.ejs",
                chunks: ["denryusen_multi_test"],
                filename: "denryusen_multi_test2.html",
            }),
            new HtmlWebPackPlugin({
                title: name,
                template: "./src/denryusen_multi_test3.ejs",
                chunks: ["denryusen_multi_test"],
                filename: "denryusen_multi_test3.html",
            }),
        ],
        [
            new CompressionPlugin({
                // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                algorithm(input, compressionOptions, callback) {
                    return gzip(input, compressionOptions, callback);
                },
                filename: "[path].gz[query]",
                test: /\.(css|html|js|json|map|svg|ttf|otf)$/,
                compressionOptions: { numiterations: 15 },
                threshold: 10240,
                minRatio: 0.8,
                deleteOriginalAssets: false,
            }),
            new CompressionPlugin({
                algorithm: "brotliCompress",
                filename: "[path].brotli[query]",
                test: /\.(css|html|js|json|map|svg|ttf|otf)$/,
                compressionOptions: { level: 11 },
                threshold: 10240,
                minRatio: 0.8,
                deleteOriginalAssets: false,
            }),
        ],
        env && env.analyze ? [new BundleAnalyzerPlugin()] : [],
        [
            new CopyFilePlugin(
                {
                    patterns: [
                        {
                            context: "node_modules/kifu-for-js/bundle",
                            from: "kifu-for-js-*",
                            to: path.resolve(__dirname, "dist"),
                        },
                        {
                            context: "src",
                            from: "*\\.php",
                            to: path.resolve(__dirname, "dist"),
                        },
                    ],
                },
                {
                    copyUnmodified: true,
                }
            ),
        ]
    ),
    resolve: {
        extensions: [".html", ".ts", ".js", ".json"],
    },
});
