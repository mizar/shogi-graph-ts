/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const { gzip } = require("@gfx/zopfli");
const { name } = require("./package.json");

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = env => ({
    devtool: "source-map",
    entry: "./src/main.ts",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader"
            },
            {
                test: /\.(jpe?g|png|gif|svg|ttf|otf)$/i,
                loader: "url-loader"
            }
        ]
    },
    plugins: [].concat(
        env && env.production ? [new CleanWebpackPlugin()] : [],
        [
            new HtmlWebPackPlugin({
                title: name,
                template: "./src/index.ejs"
            })
        ],
        env && env.production
            ? [
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
                      deleteOriginalAssets: false
                  }),
                  new CompressionPlugin({
                      algorithm: "brotliCompress",
                      filename: "[path].brotli[query]",
                      test: /\.(css|html|js|json|map|svg|ttf|otf)$/,
                      compressionOptions: { level: 11 },
                      threshold: 10240,
                      minRatio: 0.8,
                      deleteOriginalAssets: false
                  })
              ]
            : [],
        env && env.analyze ? [new BundleAnalyzerPlugin()] : []
    ),
    resolve: {
        extensions: [".html", ".ts", ".js", ".json"]
    }
});
