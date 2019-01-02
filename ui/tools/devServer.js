import path from "path";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import config from "../webpack.config";


const host = "0.0.0.0";

config.entry.unshift(`webpack-dev-server/client?http://${host}:443/`, "webpack/hot/dev-server");

const compiler = webpack(config);
const options = {
    historyApiFallback: true,
    disableHostCheck: true,
    hot: true,
    contentBase: path.join(__dirname, "dist"),
    clientLogLevel: "error"
};
const server = new WebpackDevServer(compiler, options);

server.listen(3000, host);
