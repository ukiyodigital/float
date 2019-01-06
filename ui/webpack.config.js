/* eslint-disable no-console */
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";


const ENVS = {
    development: {
        API_URL: "https://api.float.lvh.me",
    }
};

const GLOBAL_CONSTS = Object.entries(ENVS[process.env.APP_ENV]).reduce(
    (acc, [key, val]) => Object.assign(acc, {[`process.env.${key}`]: JSON.stringify(val)}),
    {}
);

const mode = process.env.APP_ENV === "development" ? "development" : "production";

console.log(`webpack is compiling in ${mode} mode.`);

export default {
    mode,
    target: "web",
    resolve: {
        extensions: ["*", ".js", ".jsx", ".json"]
    },
    entry: [
        "./src/index.js"
    ],
    output: {
        filename: "[name].[hash].js",
        path: path.resolve(__dirname, "dist")
    },
    optimization: {
        noEmitOnErrors: true,
        runtimeChunk: "single",
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                }
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({template: "./src/index.html"}),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin(GLOBAL_CONSTS)
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, "src"),
                use: ["babel-loader"].concat(mode === "development" ? ["eslint-loader"] : [])
            },
            {
                test: /\.eot(\?v=\d+.\d+.\d+)?$/,
                use: ["file-loader"]
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        mimetype: "application/font-woff"
                    }
                }]
            },
            {
                test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        mimetype: "application/octet-stream"
                    }
                }]
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        mimetype: "image/svg+xml"
                    }
                }]
            },
            {
                test: /\.(jpe?g|png|gif|ico)$/i,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]"
                    }
                }]
            },
            {
                test: /(\.css|\.less)$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    "postcss-loader",
                    {
                        loader: "less-loader",
                        options: {
                            javascriptEnabled: true
                        }
                    }
                ]
            }
        ]
    }
};
